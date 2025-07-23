/**
 * Mock state manager for testing
 */

import { Session, SessionContext } from '../../src/modules/stateManager/types';

export class MockStateManager {
  private sessions: Map<string, Session> = new Map();
  private initialized: boolean = false;

  async initialize(): Promise<void> {
    this.initialized = true;
  }

  async shutdown(): Promise<void> {
    this.sessions.clear();
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  createSession(sessionId?: string): string {
    const id = sessionId || `mock-session-${Date.now()}`;
    const session: Session = {
      id,
      userId: 'mock-user',
      startTime: Date.now(),
      lastActivity: Date.now(),
      context: {
        currentProblem: '',
        generatedLenses: [],
        evolutionChains: [],
        hybridAttempts: []
      },
      metrics: {
        totalGenerations: 0,
        averageMadnessIndex: 0,
        uniqueDomainsUsed: new Set<string>(),
        successfulHybrids: 0,
        toolUsage: new Map<string, number>()
      },
      preferences: {}
    };
    
    this.sessions.set(id, session);
    return id;
  }

  getSession(sessionId: string): Session | undefined {
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId: string, updates: Partial<SessionContext>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.context = { ...session.context, ...updates };
      session.lastActivity = Date.now();
    }
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  getAllSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  cleanupExpiredSessions(maxAge: number = 3600000): number {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.sessions.delete(id);
        cleaned++;
      }
    }
    
    return cleaned;
  }

  // Mock-specific methods for testing
  reset(): void {
    this.sessions.clear();
  }

  getSessionCount(): number {
    return this.sessions.size;
  }

  setSession(sessionId: string, session: Session): void {
    this.sessions.set(sessionId, session);
  }

  // Simulate persistence operations
  async save(): Promise<void> {
    // Mock save operation
    return Promise.resolve();
  }

  async load(): Promise<void> {
    // Mock load operation
    return Promise.resolve();
  }

  // Analytics mock
  getAnalytics() {
    return {
      totalSessions: this.sessions.size,
      activeSessions: Array.from(this.sessions.values()).filter(
        s => Date.now() - s.lastActivity < 300000
      ).length,
      averageSessionDuration: this.calculateAverageSessionDuration(),
      mostUsedDomains: this.getMostUsedDomains()
    };
  }

  private calculateAverageSessionDuration(): number {
    if (this.sessions.size === 0) return 0;
    
    const durations = Array.from(this.sessions.values()).map(
      s => s.lastActivity - s.startTime
    );
    
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  }

  private getMostUsedDomains(): string[] {
    const domainCounts = new Map<string, number>();
    
    for (const session of this.sessions.values()) {
      for (const domain of session.metrics.uniqueDomainsUsed) {
        domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
      }
    }
    
    return Array.from(domainCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([domain]) => domain);
  }
}

// Helper to create a pre-populated mock state manager
export function createMockStateManagerWithData(): MockStateManager {
  const manager = new MockStateManager();
  manager.initialize();
  
  // Add some test sessions
  const session1 = manager.createSession('test-session-1');
  manager.updateSession(session1, {
    currentProblem: 'Test problem 1'
  });
  
  const session2 = manager.createSession('test-session-2');
  manager.updateSession(session2, {
    currentProblem: 'Test problem 2'
  });
  
  return manager;
}