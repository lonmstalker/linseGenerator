export interface SessionContext {
  currentProblem: string;
  generatedLenses: Array<{
    timestamp: number;
    prompt: string;
    domains: string[];
  }>;
  evolutionChains: Array<{
    originalIdea: string;
    stages: Array<{
      stage: number;
      content: string;
      madnessLevel: number;
      timestamp: number;
    }>;
    currentStage: number;
  }>;
  hybridAttempts: Array<{
    ideaA: string;
    ideaB: string;
    method: string;
    result?: string;
    timestamp: number;
  }>;
}

export interface SessionMetrics {
  totalGenerations: number;
  averageMadnessIndex: number;
  uniqueDomainsUsed: Set<string>;
  successfulHybrids: number;
  toolUsage: Map<string, number>;
}

export interface SessionPreferences {
  preferredDomains?: string[];
  avoidDomains?: string[];
  targetMadnessLevel?: number;
}

export interface Session {
  id: string;
  userId: string;
  startTime: number;
  lastActivity: number;
  context: SessionContext;
  metrics: SessionMetrics;
  preferences: SessionPreferences;
}

export interface StateSnapshot {
  id: string;
  sessionId: string;
  timestamp: number;
  state: Session;
  checksum: string;
}

export interface PersistenceConfig {
  type: 'memory' | 'file' | 'redis';
  location?: string;
  compression?: boolean;
  autoSaveInterval?: number;
}

export interface PriorityCriteria {
  maxAge?: number;
  minImportance?: number;
  preserveRecent?: number;
}

export interface ArchivedData {
  archiveId: string;
  timestamp: number;
  compressedData: string;
  summary: {
    itemCount: number;
    dateRange: [number, number];
    keyHighlights: string[];
  };
}

export interface TrendData {
  direction: 'increasing' | 'decreasing' | 'stable';
  rate: number;
  confidence: number;
  recentValues: number[];
}

export interface DomainStats {
  domain: string;
  usageCount: number;
  averageCreativityScore: number;
  successRate: number;
  lastUsed: number;
}

export interface PatternAnalysis {
  commonPatterns: Array<{
    pattern: string;
    frequency: number;
    effectiveness: number;
  }>;
  unusualCombinations: Array<{
    combination: string[];
    uniqueness: number;
    outcome: string;
  }>;
}

export interface SessionReport {
  sessionId: string;
  duration: number;
  summary: {
    totalIdeasGenerated: number;
    averageCreativity: number;
    mostUsedDomains: string[];
    peakMadnessLevel: number;
  };
  highlights: string[];
  recommendations: string[];
}

export interface StateManagerOptions {
  persistence: PersistenceConfig;
  limits: {
    maxSessionAge: number;
    maxSnapshots: number;
    maxContextSize: number;
    maxSessions: number;
  };
  cleanup: {
    inactiveThreshold: number;
    runInterval: number;
  };
}