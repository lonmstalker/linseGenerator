/**
 * Jest test setup file
 * Configure test environment and global test utilities
 */

// Mock MCP SDK before any imports
jest.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: class MockServer {
    constructor() {}
    setRequestHandler() {}
    connect() {}
    close() {}
  }
}));

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: class MockTransport {
    constructor() {}
  }
}));

jest.mock('@modelcontextprotocol/sdk/types.js', () => ({
  CallToolRequestSchema: {},
  ListToolsRequestSchema: {},
  ListResourcesRequestSchema: {},
  ReadResourceRequestSchema: {}
}));

import { jest } from '@jest/globals';
import { MockStateManager } from './mocks/stateManager';
import { setupTestDatabase, cleanupTestDatabase } from './helpers/database';
import { generateTestSessionId, generateTestProblem } from './helpers/generators';

// Set test environment variables
process.env['NODE_ENV'] = 'test';
process.env['LOG_LEVEL'] = 'error'; // Minimize logs during tests
process.env['MAX_SESSIONS'] = '10';
process.env['SESSION_TIMEOUT'] = '60000'; // 1 minute for tests
process.env['STATE_PERSISTENCE'] = 'memory';

// Mock console methods to reduce test output noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  // Keep warn and error for important test messages
  warn: console.warn,
  error: console.error
};

// Global test timeout
jest.setTimeout(10000);

// Mock external services (removed - no external integrations in this project)

// Global setup
beforeAll(async () => {
  // Initialize test database
  await setupTestDatabase();
});

// Global cleanup
afterAll(async () => {
  // Clean up test database
  await cleanupTestDatabase();
  // Clear all mocks
  jest.clearAllMocks();
});

// Add custom matchers
expect.extend({
  toBeValidPrompt(received: string) {
    const pass = 
      typeof received === 'string' &&
      received.length > 100 &&
      received.includes('===') &&
      /\d+\./.test(received); // Contains numbered list
    
    return {
      pass,
      message: () => 
        pass
          ? `expected ${received} not to be a valid prompt`
          : `expected ${received} to be a valid prompt (length > 100, contains === and numbered list)`
    };
  },
  
  toHaveMinimumCreativityScore(received: number, expected: number) {
    const pass = received >= expected;
    return {
      pass,
      message: () => 
        pass
          ? `expected creativity score ${received} not to be at least ${expected}`
          : `expected creativity score ${received} to be at least ${expected}`
    };
  },
  
  toContainUniqueDomains(received: string[], minUnique: number) {
    const unique = new Set(received);
    const pass = unique.size >= minUnique;
    return {
      pass,
      message: () => 
        pass
          ? `expected ${unique.size} unique domains not to be at least ${minUnique}`
          : `expected ${unique.size} unique domains to be at least ${minUnique}`
    };
  }
});

// Test context helper
export interface TestContext {
  stateManager: MockStateManager;
  sessionId?: string;
}

export function createTestContext(): TestContext {
  return {
    stateManager: new MockStateManager(),
    sessionId: generateTestSessionId()
  };
}

// Re-export test data generators from centralized location
export { generateTestSessionId, generateTestProblem } from './helpers/generators';

// Performance tracking
export interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  memoryStart: number;
  memoryEnd?: number;
  memoryDelta?: number;
}

export function startPerformanceTracking(): PerformanceMetrics {
  return {
    startTime: Date.now(),
    memoryStart: process.memoryUsage().heapUsed
  };
}

export function endPerformanceTracking(metrics: PerformanceMetrics): PerformanceMetrics {
  const endTime = Date.now();
  const memoryEnd = process.memoryUsage().heapUsed;
  
  return {
    ...metrics,
    endTime,
    duration: endTime - metrics.startTime,
    memoryEnd,
    memoryDelta: memoryEnd - metrics.memoryStart
  };
}

// Declare global test types
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidPrompt(): R;
      toHaveMinimumCreativityScore(score: number): R;
      toContainUniqueDomains(minUnique: number): R;
    }
  }
}