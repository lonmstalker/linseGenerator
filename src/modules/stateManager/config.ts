import { StateManagerOptions } from './types';
import * as path from 'path';

// Calculate project root from this file location
const projectRoot = path.resolve(__dirname, '../../../..');

export const STATE_CONFIG: StateManagerOptions = {
  persistence: {
    type: (process.env['PERSISTENCE_TYPE'] as 'memory' | 'file' | 'redis') || 'file',
    location: process.env['STATE_LOCATION'] || path.join(projectRoot, 'data', 'state'),
    compression: process.env['ENABLE_COMPRESSION'] === 'true',
    autoSaveInterval: 30000, // 30 seconds
  },
  limits: {
    maxSessionAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxSnapshots: 50,
    maxContextSize: 100 * 1024, // 100KB
    maxSessions: 1000,
  },
  cleanup: {
    inactiveThreshold: 60 * 60 * 1000, // 1 hour
    runInterval: 15 * 60 * 1000, // 15 minutes
  }
};

export const SNAPSHOT_CONFIG = {
  compressionThreshold: 10 * 1024, // 10KB
  checksumAlgorithm: 'sha256' as const,
  maxSnapshotsPerSession: 50,
  archiveAfterDays: 7,
};

export const CONTEXT_LIMITS = {
  maxLensesPerSession: 100,
  maxEvolutionChains: 50,
  maxHybridAttempts: 100,
  maxDomainHistory: 200,
};

export const METRICS_CONFIG = {
  madnessIndexRange: [0, 10] as [number, number],
  creativityScoreRange: [0, 100] as [number, number],
  successThreshold: 0.7,
  sampleWindowSize: 20,
};