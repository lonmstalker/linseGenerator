import * as fs from 'fs/promises';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { createHash } from 'crypto';
import { PersistenceConfig } from './types';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class PersistenceHandler {
  private storageType: 'memory' | 'file' | 'redis';
  private compression: boolean;
  private location: string;
  private memoryStore: Map<string, any> = new Map();

  constructor(config: PersistenceConfig) {
    this.storageType = config.type;
    this.compression = config.compression || false;
    // Use absolute path based on project root
    const projectRoot = path.resolve(__dirname, '../../../..');
    this.location = config.location || path.join(projectRoot, 'data', 'state');
  }

  async initialize(): Promise<void> {
    if (this.storageType === 'file') {
      await this.ensureDirectoryExists(this.location);
    }
  }

  async save(key: string, data: any): Promise<void> {
    const serialized = JSON.stringify(data);
    const toStore = this.compression ? await this.compressData(serialized) : serialized;

    switch (this.storageType) {
      case 'memory':
        this.memoryStore.set(key, toStore);
        break;
      case 'file':
        await this.saveToFile(key, toStore);
        break;
      case 'redis':
        await this.saveToRedis(key, toStore);
        break;
    }
  }

  async load(key: string): Promise<any> {
    let data: any;

    switch (this.storageType) {
      case 'memory':
        data = this.memoryStore.get(key);
        break;
      case 'file':
        data = await this.loadFromFile(key);
        break;
      case 'redis':
        data = await this.loadFromRedis(key);
        break;
    }

    if (!data) {
      return null;
    }

    const decompressed = this.compression && data instanceof Buffer
      ? await this.decompressData(data)
      : data;

    return typeof decompressed === 'string' ? JSON.parse(decompressed) : decompressed;
  }

  async delete(key: string): Promise<boolean> {
    switch (this.storageType) {
      case 'memory':
        return this.memoryStore.delete(key);
      case 'file':
        return await this.deleteFile(key);
      case 'redis':
        return await this.deleteFromRedis(key);
    }
  }

  async list(pattern: string): Promise<string[]> {
    switch (this.storageType) {
      case 'memory':
        return Array.from(this.memoryStore.keys()).filter(k => k.includes(pattern));
      case 'file':
        return await this.listFiles(pattern);
      case 'redis':
        return await this.listFromRedis(pattern);
    }
  }

  async exists(key: string): Promise<boolean> {
    switch (this.storageType) {
      case 'memory':
        return this.memoryStore.has(key);
      case 'file':
        return await this.fileExists(key);
      case 'redis':
        return await this.existsInRedis(key);
    }
  }

  // File storage methods
  private async saveToFile(key: string, data: any): Promise<void> {
    const filePath = path.join(this.location, `${key}.json`);
    const content = data instanceof Buffer ? data : Buffer.from(data);
    await fs.writeFile(filePath, content);
  }

  private async loadFromFile(key: string): Promise<any> {
    try {
      const filePath = path.join(this.location, `${key}.json`);
      const content = await fs.readFile(filePath);
      return this.compression ? content : content.toString('utf-8');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  private async deleteFile(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.location, `${key}.json`);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async listFiles(pattern: string): Promise<string[]> {
    try {
      const files = await fs.readdir(this.location);
      return files
        .filter(f => f.endsWith('.json') && f.includes(pattern))
        .map(f => f.replace('.json', ''));
    } catch {
      return [];
    }
  }

  private async fileExists(key: string): Promise<boolean> {
    try {
      const filePath = path.join(this.location, `${key}.json`);
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  // Redis storage methods (placeholder implementations)
  private async saveToRedis(_key: string, _data: any): Promise<void> {
    throw new Error('Redis storage not implemented yet');
  }

  private async loadFromRedis(_key: string): Promise<any> {
    throw new Error('Redis storage not implemented yet');
  }

  private async deleteFromRedis(_key: string): Promise<boolean> {
    throw new Error('Redis storage not implemented yet');
  }

  private async listFromRedis(_pattern: string): Promise<string[]> {
    throw new Error('Redis storage not implemented yet');
  }

  private async existsInRedis(_key: string): Promise<boolean> {
    throw new Error('Redis storage not implemented yet');
  }

  // Compression methods
  private async compressData(data: string): Promise<Buffer> {
    return await gzip(Buffer.from(data, 'utf-8'));
  }

  private async decompressData(buffer: Buffer): Promise<string> {
    const decompressed = await gunzip(buffer);
    return decompressed.toString('utf-8');
  }

  // Utility methods
  private async ensureDirectoryExists(dir: string): Promise<void> {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  generateChecksum(data: any): string {
    const content = typeof data === 'string' ? data : JSON.stringify(data);
    return createHash('sha256').update(content).digest('hex');
  }
}