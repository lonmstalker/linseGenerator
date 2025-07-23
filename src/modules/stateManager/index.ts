export { StateManager } from './manager';
export { PersistenceHandler } from './persistence';
export { ContextManager } from './contextManager';
export { SessionAnalytics } from './analytics';
export { 
  createSessionMiddleware,
  createAutoSaveMiddleware,
  createCleanupMiddleware,
  createContextLimitMiddleware,
} from './middleware';

export * from './types';
export { STATE_CONFIG, SNAPSHOT_CONFIG, CONTEXT_LIMITS, METRICS_CONFIG } from './config';