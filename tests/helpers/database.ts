/**
 * Test database setup and utilities
 */

export interface TestDatabase {
  sessions: Map<string, any>;
  prompts: Map<string, any>;
  metrics: Map<string, any>;
}

let testDb: TestDatabase | null = null;

export async function setupTestDatabase(): Promise<void> {
  testDb = {
    sessions: new Map(),
    prompts: new Map(),
    metrics: new Map()
  };
}

export async function cleanupTestDatabase(): Promise<void> {
  if (testDb) {
    testDb.sessions.clear();
    testDb.prompts.clear();
    testDb.metrics.clear();
    testDb = null;
  }
}

export function getTestDatabase(): TestDatabase {
  if (!testDb) {
    throw new Error('Test database not initialized. Call setupTestDatabase() first.');
  }
  return testDb;
}

export async function resetTestDatabase(): Promise<void> {
  if (testDb) {
    testDb.sessions.clear();
    testDb.prompts.clear();
    testDb.metrics.clear();
  }
}

// Mock database operations
export const mockDb = {
  async insert(table: string, data: any): Promise<string> {
    const db = getTestDatabase();
    const id = `${table}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const collection = db[table as keyof TestDatabase] as Map<string, any>;
    if (collection) {
      collection.set(id, { id, ...data, createdAt: new Date() });
    }
    return id;
  },

  async findById(table: string, id: string): Promise<any> {
    const db = getTestDatabase();
    const collection = db[table as keyof TestDatabase] as Map<string, any>;
    return collection?.get(id);
  },

  async findAll(table: string, filter?: (item: any) => boolean): Promise<any[]> {
    const db = getTestDatabase();
    const collection = db[table as keyof TestDatabase] as Map<string, any>;
    const items = Array.from(collection?.values() || []);
    return filter ? items.filter(filter) : items;
  },

  async update(table: string, id: string, updates: any): Promise<boolean> {
    const db = getTestDatabase();
    const collection = db[table as keyof TestDatabase] as Map<string, any>;
    const existing = collection?.get(id);
    if (existing) {
      collection.set(id, { ...existing, ...updates, updatedAt: new Date() });
      return true;
    }
    return false;
  },

  async delete(table: string, id: string): Promise<boolean> {
    const db = getTestDatabase();
    const collection = db[table as keyof TestDatabase] as Map<string, any>;
    return collection?.delete(id) || false;
  }
};