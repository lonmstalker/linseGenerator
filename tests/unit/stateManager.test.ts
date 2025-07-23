import { 
  StateManager,
  Session,
  StateSnapshot,
} from '@modules/stateManager';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager({
      persistence: {
        type: 'memory',
        autoSaveInterval: 0,
      },
      limits: {
        maxSessionAge: 7 * 24 * 60 * 60 * 1000,
        maxSnapshots: 50,
        maxContextSize: 100 * 1024,
        maxSessions: 10,
      },
      cleanup: {
        inactiveThreshold: 60 * 60 * 1000,
        runInterval: 60 * 60 * 1000,
      }
    });
  });

  afterEach(async () => {
    await stateManager.shutdown();
  });

  describe('Session Management', () => {
    it('should create a new session', () => {
      const session = stateManager.createSession('testUser', 'test problem');
      
      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.userId).toBe('testUser');
      expect(session.context.currentProblem).toBe('test problem');
      expect(session.metrics.totalGenerations).toBe(0);
    });

    it('should retrieve an existing session', () => {
      const session = stateManager.createSession('testUser');
      const retrieved = stateManager.getSession(session.id);
      
      expect(retrieved).toEqual(session);
    });

    it('should return null for non-existent session', () => {
      const retrieved = stateManager.getSession('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should update session properties', (done) => {
      const session = stateManager.createSession('testUser');
      const originalActivity = session.lastActivity;
      
      // Use setTimeout to ensure time difference
      setTimeout(() => {
        stateManager.updateSession(session.id, {
          preferences: { targetMadnessLevel: 7 }
        });
        
        const updated = stateManager.getSession(session.id);
        expect(updated?.preferences.targetMadnessLevel).toBe(7);
        expect(updated?.lastActivity).toBeGreaterThan(originalActivity);
        done();
      }, 10);
    });

    it('should delete a session', () => {
      const session = stateManager.createSession('testUser');
      const deleted = stateManager.deleteSession(session.id);
      
      expect(deleted).toBe(true);
      expect(stateManager.getSession(session.id)).toBeNull();
    });

    it('should enforce max sessions limit', () => {
      // Create max sessions
      const sessions: Session[] = [];
      for (let i = 0; i < 10; i++) {
        sessions.push(stateManager.createSession(`user${i}`));
      }
      
      // Create one more - should remove oldest
      const newSession = stateManager.createSession('newUser');
      
      expect(stateManager.getAllSessions()).toHaveLength(10);
      expect(stateManager.getSession(sessions[0]?.id || '')).toBeNull();
      expect(stateManager.getSession(newSession.id)).toBeDefined();
    });
  });

  describe('Context Management', () => {
    it('should add lens to context', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.addToContext(session.id, 'lens', {
        prompt: 'test prompt',
        domains: ['physics', 'music']
      });
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.context.generatedLenses).toHaveLength(1);
      expect(updated?.context.generatedLenses[0]?.prompt).toBe('test prompt');
      expect(updated?.context.generatedLenses[0]?.domains).toEqual(['physics', 'music']);
    });

    it('should add evolution to context', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.addToContext(session.id, 'evolution', {
        originalIdea: 'base idea',
        stage: {
          stage: 1,
          content: 'evolved idea',
          madnessLevel: 5,
          timestamp: Date.now()
        }
      });
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.context.evolutionChains).toHaveLength(1);
      expect(updated?.context.evolutionChains[0]?.originalIdea).toBe('base idea');
      expect(updated?.context.evolutionChains[0]?.stages).toHaveLength(1);
    });

    it('should add hybrid to context', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.addToContext(session.id, 'hybrid', {
        ideaA: 'idea 1',
        ideaB: 'idea 2',
        method: 'synthesis',
        result: 'hybrid idea'
      });
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.context.hybridAttempts).toHaveLength(1);
      expect(updated?.context.hybridAttempts[0]?.ideaA).toBe('idea 1');
      expect(updated?.context.hybridAttempts[0]?.method).toBe('synthesis');
    });
  });

  describe('Metrics Management', () => {
    it('should update total generations', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.updateMetrics(session.id, 'totalGenerations', 1);
      stateManager.updateMetrics(session.id, 'totalGenerations', 1);
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.metrics.totalGenerations).toBe(2);
    });

    it('should update madness index average', () => {
      const session = stateManager.createSession('testUser');
      
      // Need to increment totalGenerations for average calculation
      stateManager.updateMetrics(session.id, 'totalGenerations', 1);
      stateManager.updateMetrics(session.id, 'madnessIndex', 4);
      
      stateManager.updateMetrics(session.id, 'totalGenerations', 1);
      stateManager.updateMetrics(session.id, 'madnessIndex', 6);
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.metrics.averageMadnessIndex).toBeCloseTo(5, 1);
    });

    it('should track unique domains', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.updateMetrics(session.id, 'domain', 'physics');
      stateManager.updateMetrics(session.id, 'domain', 'music');
      stateManager.updateMetrics(session.id, 'domain', 'physics'); // duplicate
      
      const updated = stateManager.getSession(session.id);
      expect(updated?.metrics.uniqueDomainsUsed.size).toBe(2);
      expect(Array.from(updated?.metrics.uniqueDomainsUsed || [])).toContain('physics');
      expect(Array.from(updated?.metrics.uniqueDomainsUsed || [])).toContain('music');
    });

    it('should track tool usage', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.updateMetrics(session.id, 'toolUsage', 'generate_lens');
      stateManager.updateMetrics(session.id, 'toolUsage', 'generate_lens');
      stateManager.updateMetrics(session.id, 'toolUsage', 'evolve_idea');
      
      const metrics = stateManager.getSessionMetrics(session.id);
      expect(metrics?.toolUsage.get('generate_lens')).toBe(2);
      expect(metrics?.toolUsage.get('evolve_idea')).toBe(1);
    });
  });

  describe('Snapshot Management', () => {
    it('should create a snapshot', () => {
      const session = stateManager.createSession('testUser');
      stateManager.updateSession(session.id, {
        context: {
          currentProblem: 'updated problem',
          generatedLenses: [],
          evolutionChains: [],
          hybridAttempts: []
        }
      });
      
      const snapshot = stateManager.createSnapshot(session.id);
      
      expect(snapshot).toBeDefined();
      expect(snapshot.sessionId).toBe(session.id);
      expect(snapshot.state.context.currentProblem).toBe('updated problem');
      expect(snapshot.checksum).toBeDefined();
    });

    it('should list snapshots for a session', () => {
      const session = stateManager.createSession('testUser');
      
      stateManager.createSnapshot(session.id);
      stateManager.createSnapshot(session.id);
      
      const snapshots = stateManager.listSnapshots(session.id);
      expect(snapshots).toHaveLength(2);
    });

    it('should rollback to a snapshot', () => {
      const session = stateManager.createSession('testUser');
      
      // Create snapshot with initial state
      const snapshot1 = stateManager.createSnapshot(session.id);
      
      // Modify session
      stateManager.updateSession(session.id, {
        context: {
          currentProblem: 'modified problem',
          generatedLenses: [],
          evolutionChains: [],
          hybridAttempts: []
        }
      });
      
      // Rollback
      const restored = stateManager.rollbackToSnapshot(snapshot1.id);
      
      expect(restored.context.currentProblem).toBe('');
    });

    it('should limit snapshots per session', () => {
      const session = stateManager.createSession('testUser');
      
      // Create more than limit
      for (let i = 0; i < 55; i++) {
        stateManager.createSnapshot(session.id);
      }
      
      const snapshots = stateManager.listSnapshots(session.id);
      expect(snapshots).toHaveLength(50);
    });
  });

  describe('Session Integrity', () => {
    it('should validate valid session', () => {
      const session = stateManager.createSession('testUser');
      const isValid = stateManager.validateSessionIntegrity(session.id);
      
      expect(isValid).toBe(true);
    });

    it('should invalidate session with bad metrics', () => {
      const session = stateManager.createSession('testUser');
      
      // Manually corrupt metrics
      const corruptedSession = stateManager.getSession(session.id);
      if (corruptedSession) {
        corruptedSession.metrics.averageMadnessIndex = -1;
        corruptedSession.metrics.totalGenerations = -5;
      }
      
      const isValid = stateManager.validateSessionIntegrity(session.id);
      expect(isValid).toBe(false);
    });
  });

  describe('Cleanup Operations', () => {
    it('should cleanup inactive sessions', () => {
      jest.useFakeTimers();
      
      const session1 = stateManager.createSession('user1');
      const session2 = stateManager.createSession('user2');
      
      // Advance time for session1 to become inactive
      jest.advanceTimersByTime(2 * 60 * 60 * 1000); // 2 hours
      
      // Update session2 to keep it active
      stateManager.updateSession(session2.id, {});
      
      const cleaned = stateManager.cleanupInactiveSessions(60 * 60 * 1000); // 1 hour threshold
      
      expect(cleaned).toBe(1);
      expect(stateManager.getSession(session1.id)).toBeNull();
      expect(stateManager.getSession(session2.id)).toBeDefined();
      
      jest.useRealTimers();
    });

    it('should compress old snapshots', () => {
      const session = stateManager.createSession('testUser');
      
      // Create many snapshots
      for (let i = 0; i < 10; i++) {
        stateManager.createSnapshot(session.id);
      }
      
      stateManager.compressOldSnapshots(session.id, 3);
      
      const snapshots = stateManager.listSnapshots(session.id);
      expect(snapshots).toHaveLength(3);
    });
  });

  describe('Import/Export', () => {
    it('should export session data', async () => {
      const session = stateManager.createSession('testUser', 'test problem');
      
      stateManager.updateMetrics(session.id, 'totalGenerations', 1);
      stateManager.createSnapshot(session.id);
      
      const exported = await stateManager.exportSession(session.id);
      const parsed = JSON.parse(exported);
      
      expect(parsed.session).toBeDefined();
      expect(parsed.session.userId).toBe('testUser');
      expect(parsed.snapshots).toHaveLength(1);
      expect(parsed.report).toBeDefined();
      expect(parsed.version).toBe('1.0.0');
    });

    it('should import session data', async () => {
      const session = stateManager.createSession('testUser', 'test problem');
      const exported = await stateManager.exportSession(session.id);
      
      // Delete original
      stateManager.deleteSession(session.id);
      
      // Import
      const imported = await stateManager.importSession(exported);
      
      expect(imported.userId).toBe('testUser');
      expect(imported.context.currentProblem).toBe('test problem');
      expect(imported.id).not.toBe(session.id); // Should have new ID
    });
  });
});