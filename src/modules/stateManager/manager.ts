import { randomUUID } from 'crypto';
import {
  Session,
  StateSnapshot,
  SessionMetrics,
  StateManagerOptions,
} from './types';
import { PersistenceHandler } from './persistence';
import { ContextManager } from './contextManager';
import { SessionAnalytics } from './analytics';
import { STATE_CONFIG } from './config';

export class StateManager {
  private sessions: Map<string, Session>;
  private snapshots: Map<string, StateSnapshot[]>;
  private persistenceHandler: PersistenceHandler;
  private contextManager: ContextManager;
  private analytics: SessionAnalytics;
  private autoSaveInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;
  private options: StateManagerOptions;

  constructor(options?: Partial<StateManagerOptions>) {
    this.options = {
      ...STATE_CONFIG,
      ...options,
    };
    
    this.sessions = new Map();
    this.snapshots = new Map();
    this.persistenceHandler = new PersistenceHandler(this.options.persistence);
    this.contextManager = new ContextManager();
    this.analytics = new SessionAnalytics();
  }

  async initialize(): Promise<void> {
    await this.persistenceHandler.initialize();
    await this.loadState();
    
    // Setup auto-save
    if (this.options.persistence.autoSaveInterval) {
      this.autoSaveInterval = setInterval(
        () => this.saveState().catch(console.error),
        this.options.persistence.autoSaveInterval
      );
    }

    // Setup cleanup
    this.cleanupInterval = setInterval(
      () => this.cleanupInactiveSessions(this.options.cleanup.inactiveThreshold),
      this.options.cleanup.runInterval
    );
  }

  async shutdown(): Promise<void> {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
    }
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    await this.saveState();
  }

  // Helper to create default metrics
  private createDefaultMetrics(): SessionMetrics {
    return {
      totalGenerations: 0,
      averageMadnessIndex: 0,
      uniqueDomainsUsed: new Set(),
      successfulHybrids: 0,
      toolUsage: new Map(),
    };
  }

  // Session management
  createSession(userId: string, initialProblem?: string): Session {
    if (this.sessions.size >= this.options.limits.maxSessions) {
      // Remove oldest inactive session
      const oldestSession = Array.from(this.sessions.values())
        .sort((a, b) => a.lastActivity - b.lastActivity)[0];
      if (oldestSession) {
        this.deleteSession(oldestSession.id);
      }
    }

    const session: Session = {
      id: randomUUID(),
      userId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      context: {
        currentProblem: initialProblem || '',
        generatedLenses: [],
        evolutionChains: [],
        hybridAttempts: [],
      },
      metrics: this.createDefaultMetrics(),
      preferences: {},
    };

    this.sessions.set(session.id, session);
    return session;
  }

  getSession(sessionId: string): Session | null {
    return this.sessions.get(sessionId) || null;
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  updateSession(sessionId: string, updates: Partial<Session>): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Deep merge updates
    const updated = this.deepMergeSession(session, updates);
    updated.lastActivity = Date.now();
    
    // Ensure context doesn't exceed limits
    const contextSize = JSON.stringify(updated.context).length;
    if (contextSize > this.options.limits.maxContextSize) {
      updated.context = this.contextManager.trimContext(
        updated.context,
        this.options.limits.maxContextSize
      );
    }

    this.sessions.set(sessionId, updated);
  }

  deleteSession(sessionId: string): boolean {
    this.snapshots.delete(sessionId);
    return this.sessions.delete(sessionId);
  }

  // Snapshot management
  createSnapshot(sessionId: string): StateSnapshot {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const snapshot: StateSnapshot = {
      id: randomUUID(),
      sessionId,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(session)), // Deep clone
      checksum: this.persistenceHandler.generateChecksum(session),
    };

    const sessionSnapshots = this.snapshots.get(sessionId) || [];
    sessionSnapshots.push(snapshot);

    // Limit snapshots per session
    if (sessionSnapshots.length > this.options.limits.maxSnapshots) {
      sessionSnapshots.shift(); // Remove oldest
    }

    this.snapshots.set(sessionId, sessionSnapshots);
    return snapshot;
  }

  listSnapshots(sessionId: string): StateSnapshot[] {
    return this.snapshots.get(sessionId) || [];
  }

  rollbackToSnapshot(snapshotId: string): Session {
    for (const [sessionId, snapshots] of this.snapshots.entries()) {
      const snapshot = snapshots.find(s => s.id === snapshotId);
      if (snapshot) {
        const restoredSession = JSON.parse(JSON.stringify(snapshot.state));
        this.sessions.set(sessionId, restoredSession);
        return restoredSession;
      }
    }
    throw new Error(`Snapshot ${snapshotId} not found`);
  }

  // Context and metrics
  addToContext(sessionId: string, contextType: string, data: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    switch (contextType) {
      case 'lens':
        session.context.generatedLenses.push({
          timestamp: Date.now(),
          prompt: data.prompt,
          domains: data.domains || [],
        });
        break;
      case 'evolution':
        const chain = session.context.evolutionChains.find(
          c => c.originalIdea === data.originalIdea
        );
        if (chain) {
          chain.stages.push(data.stage);
          chain.currentStage = chain.stages.length - 1;
        } else {
          session.context.evolutionChains.push({
            originalIdea: data.originalIdea,
            stages: [data.stage],
            currentStage: 0,
          });
        }
        break;
      case 'hybrid':
        session.context.hybridAttempts.push({
          ...data,
          timestamp: Date.now(),
        });
        break;
    }

    // No need to call updateSession as we already modified the session directly
    session.lastActivity = Date.now();
  }

  updateMetrics(sessionId: string, metric: string, value: any): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    switch (metric) {
      case 'totalGenerations':
        session.metrics.totalGenerations++;
        break;
      case 'madnessIndex':
        const currentAvg = session.metrics.averageMadnessIndex;
        const count = session.metrics.totalGenerations || 1;
        session.metrics.averageMadnessIndex = 
          (currentAvg * (count - 1) + value) / count;
        break;
      case 'domain':
        session.metrics.uniqueDomainsUsed.add(value);
        break;
      case 'successfulHybrid':
        session.metrics.successfulHybrids++;
        break;
      case 'toolUsage':
        const currentCount = session.metrics.toolUsage.get(value) || 0;
        session.metrics.toolUsage.set(value, currentCount + 1);
        break;
    }

    // No need to call updateSession as we already modified the session directly
    session.lastActivity = Date.now();
  }

  getSessionMetrics(sessionId: string): SessionMetrics | null {
    const session = this.sessions.get(sessionId);
    return session ? session.metrics : null;
  }

  // Persistence
  async saveState(): Promise<void> {
    const state = {
      sessions: Array.from(this.sessions.entries()),
      snapshots: Array.from(this.snapshots.entries()),
      timestamp: Date.now(),
    };

    await this.persistenceHandler.save('state', state);

    // Save individual sessions for redundancy
    for (const [id, session] of this.sessions) {
      await this.persistenceHandler.save(`session_${id}`, session);
    }
  }

  async loadState(): Promise<void> {
    try {
      const state = await this.persistenceHandler.load('state');
      if (state) {
        this.sessions = new Map(state.sessions);
        this.snapshots = new Map(state.snapshots);

        // Restore Set and Map objects in metrics
        for (const session of this.sessions.values()) {
          // Ensure metrics object exists
          if (!session.metrics) {
            session.metrics = this.createDefaultMetrics();
          }
          
          // Safely restore uniqueDomainsUsed
          if (session.metrics.uniqueDomainsUsed) {
            session.metrics.uniqueDomainsUsed = new Set(
              Array.from(session.metrics.uniqueDomainsUsed)
            );
          } else {
            session.metrics.uniqueDomainsUsed = new Set();
          }
          
          // Safely restore toolUsage
          if (session.metrics.toolUsage) {
            session.metrics.toolUsage = new Map(
              Array.from(session.metrics.toolUsage)
            );
          } else {
            session.metrics.toolUsage = new Map();
          }
        }
      }
    } catch (error) {
      console.error('Failed to load state:', error);
    }
  }

  async exportSession(sessionId: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const snapshots = this.snapshots.get(sessionId) || [];
    const report = this.analytics.generateSessionReport(session);

    const exportData = {
      session: {
        ...session,
        metrics: {
          ...session.metrics,
          uniqueDomainsUsed: Array.from(session.metrics.uniqueDomainsUsed),
          toolUsage: Array.from(session.metrics.toolUsage),
        },
      },
      snapshots,
      report,
      exportTimestamp: Date.now(),
      version: '1.0.0',
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importSession(exportData: string): Promise<Session> {
    try {
      const data = JSON.parse(exportData);
      
      if (!data.session || !data.version) {
        throw new Error('Invalid export format');
      }

      const session = data.session;
      session.id = randomUUID(); // Generate new ID
      session.metrics.uniqueDomainsUsed = new Set(session.metrics.uniqueDomainsUsed);
      session.metrics.toolUsage = new Map(session.metrics.toolUsage);

      this.sessions.set(session.id, session);

      if (data.snapshots) {
        this.snapshots.set(session.id, data.snapshots);
      }

      return session;
    } catch (error) {
      throw new Error(`Failed to import session: ${error}`);
    }
  }

  // Maintenance
  cleanupInactiveSessions(maxInactiveMs: number): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of this.sessions) {
      if (now - session.lastActivity > maxInactiveMs) {
        this.deleteSession(id);
        cleaned++;
      }
    }

    return cleaned;
  }

  compressOldSnapshots(sessionId: string, keepLast: number): void {
    const snapshots = this.snapshots.get(sessionId);
    if (!snapshots || snapshots.length <= keepLast) {
      return;
    }

    const toKeep = snapshots.slice(-keepLast);
    const toArchive = snapshots.slice(0, -keepLast);

    // Create archive entry
    const archive = {
      sessionId,
      archivedCount: toArchive.length,
      dateRange: [
        toArchive[0]?.timestamp || Date.now(),
        toArchive[toArchive.length - 1]?.timestamp || Date.now(),
      ],
      summary: 'Compressed snapshots',
    };

    // Store archive reference (actual compression would happen in persistence layer)
    this.persistenceHandler.save(`archive_${sessionId}_${Date.now()}`, archive);
    
    this.snapshots.set(sessionId, toKeep);
  }

  validateSessionIntegrity(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    try {
      // Check required fields
      if (!session.id || !session.userId || !session.context) {
        return false;
      }

      // Validate metrics
      if (session.metrics.totalGenerations < 0 ||
          session.metrics.averageMadnessIndex < 0 ||
          session.metrics.averageMadnessIndex > 10) {
        return false;
      }

      // Validate timestamps
      if (session.startTime > session.lastActivity ||
          session.startTime > Date.now()) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  // Analytics methods
  getSessionReport(sessionId: string): ReturnType<SessionAnalytics['generateSessionReport']> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return this.analytics.generateSessionReport(session);
  }

  getSessionHealth(sessionId: string): ReturnType<SessionAnalytics['calculateSessionHealth']> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    return this.analytics.calculateSessionHealth(session);
  }

  // Private helpers
  private deepMergeSession(target: Session, source: Partial<Session>): Session {
    const result = { ...target };

    if (source.context) {
      result.context = {
        ...target.context,
        ...source.context,
        generatedLenses: [
          ...target.context.generatedLenses,
          ...(source.context.generatedLenses || []),
        ],
        evolutionChains: [
          ...target.context.evolutionChains,
          ...(source.context.evolutionChains || []),
        ],
        hybridAttempts: [
          ...target.context.hybridAttempts,
          ...(source.context.hybridAttempts || []),
        ],
      };
    }

    if (source.metrics) {
      result.metrics = {
        ...target.metrics,
        ...source.metrics,
      };
    }

    if (source.preferences) {
      result.preferences = {
        ...target.preferences,
        ...source.preferences,
      };
    }

    return result;
  }
}