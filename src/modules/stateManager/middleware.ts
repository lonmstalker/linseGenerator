import { StateManager } from './manager';

export interface MiddlewareContext {
  sessionId?: string;
  [key: string]: any;
}

export interface MiddlewareResult {
  sessionId: string;
  [key: string]: any;
}

export function createSessionMiddleware(stateManager: StateManager) {
  return {
    beforeToolExecution: async (
      tool: string, 
      args: any, 
      context?: MiddlewareContext
    ): Promise<MiddlewareResult> => {
      let sessionId = context?.sessionId || args.sessionId;
      
      if (!sessionId) {
        const session = stateManager.createSession('anonymous');
        sessionId = session.id;
      }
      
      // Update last activity
      stateManager.updateSession(sessionId, { lastActivity: Date.now() });
      
      // Track tool usage
      stateManager.updateMetrics(sessionId, 'toolUsage', tool);
      
      return { ...args, sessionId };
    },
    
    afterToolExecution: async (
      tool: string, 
      result: any, 
      sessionId: string,
      args: any
    ): Promise<void> => {
      if (!sessionId) return;

      // Add to context based on tool type
      switch (tool) {
        case 'generate_creative_lens_prompt':
          if (result.prompt) {
            stateManager.addToContext(sessionId, 'lens', {
              prompt: result.prompt,
              domains: result.domains || [],
            });
            stateManager.updateMetrics(sessionId, 'totalGenerations', 1);
            
            // Update domain metrics
            result.domains?.forEach((domain: string) => {
              stateManager.updateMetrics(sessionId, 'domain', domain);
            });
          }
          break;
          
        case 'evolve_idea_with_structure':
          if (result.evolution) {
            stateManager.addToContext(sessionId, 'evolution', {
              originalIdea: args.idea,
              stage: {
                stage: args.targetStage || 1,
                content: result.evolution,
                madnessLevel: args.madnessLevel || 5,
                timestamp: Date.now(),
              },
            });
            stateManager.updateMetrics(sessionId, 'madnessIndex', args.madnessLevel || 5);
          }
          break;
          
        case 'create_hybrid_framework':
          if (result.hybrid) {
            stateManager.addToContext(sessionId, 'hybrid', {
              ideaA: args.ideaA,
              ideaB: args.ideaB,
              method: args.method || 'synthesis',
              result: result.hybrid,
            });
            
            if (result.success) {
              stateManager.updateMetrics(sessionId, 'successfulHybrid', 1);
            }
          }
          break;
      }
      
      // Auto-snapshot after important operations
      if (['evolve_idea_with_structure', 'create_hybrid_framework'].includes(tool)) {
        stateManager.createSnapshot(sessionId);
      }
    },
    
    onError: async (
      tool: string, 
      error: Error, 
      sessionId?: string
    ): Promise<void> => {
      if (sessionId) {
        console.error(`Tool ${tool} failed for session ${sessionId}:`, error);
        // Could add error tracking to session metrics
      }
    },
  };
}

export function createAutoSaveMiddleware(stateManager: StateManager, interval: number = 60000) {
  let lastSave = Date.now();
  
  return {
    afterToolExecution: async (): Promise<void> => {
      const now = Date.now();
      if (now - lastSave > interval) {
        await stateManager.saveState();
        lastSave = now;
      }
    },
  };
}

export function createCleanupMiddleware(stateManager: StateManager, options?: {
  maxSessionAge?: number;
  checkInterval?: number;
}) {
  const maxAge = options?.maxSessionAge || 7 * 24 * 60 * 60 * 1000; // 7 days
  const checkInterval = options?.checkInterval || 60 * 60 * 1000; // 1 hour
  let lastCheck = Date.now();
  
  return {
    afterToolExecution: async (): Promise<void> => {
      const now = Date.now();
      if (now - lastCheck > checkInterval) {
        stateManager.cleanupInactiveSessions(maxAge);
        lastCheck = now;
      }
    },
  };
}

export function createContextLimitMiddleware(stateManager: StateManager, maxSize: number = 100 * 1024) {
  return {
    afterToolExecution: async (_tool: string, _result: any, sessionId: string): Promise<void> => {
      const session = stateManager.getSession(sessionId);
      if (session) {
        const contextSize = JSON.stringify(session.context).length;
        if (contextSize > maxSize) {
          console.warn(`Session ${sessionId} context exceeds limit (${contextSize} > ${maxSize})`);
          // Context trimming is handled automatically in updateSession
        }
      }
    },
  };
}