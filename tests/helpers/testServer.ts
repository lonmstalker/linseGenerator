/**
 * Test server implementation for unit and integration tests
 */

import { CreativeLensServer } from '../../src/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { Readable, Writable } from 'stream';

export interface TestServerOptions {
  silent?: boolean;
  mockTransport?: boolean;
}

export class TestServer {
  private server: CreativeLensServer;
  private transport?: StdioServerTransport;
  private mockStdin?: Readable;
  private mockStdout?: Writable;
  private mockStderr?: Writable;
  private started: boolean = false;

  constructor(private options: TestServerOptions = {}) {
    this.server = new CreativeLensServer();
  }

  async start(): Promise<void> {
    if (this.started) {
      throw new Error('Test server already started');
    }

    // Initialize the server's state manager
    // @ts-ignore - accessing private method for testing
    await this.server['initializeStateManager']();
    
    this.started = true;
  }

  async stop(): Promise<void> {
    if (!this.started) {
      return;
    }

    // @ts-ignore - accessing private property for testing
    await this.server['stateManager'].shutdown();
    this.started = false;
  }

  async callTool(toolName: string, args?: any): Promise<any> {
    if (!this.started) {
      throw new Error('Test server not started');
    }

    try {
      // @ts-ignore - accessing internal method for testing
      const handler = this.server['toolRegistry'].getHandler(toolName);
      if (!handler) {
        throw new Error(`Tool ${toolName} not found`);
      }

      // @ts-ignore - accessing internal property for testing
      const toolContext = this.server['toolContext'];
      
      const result = await handler(args || {}, toolContext);
      
      return {
        success: true,
        ...result,
        session_id: (result.metadata as any)?.sessionId || args?.session_id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async readResource(uri: string): Promise<any> {
    if (!this.started) {
      throw new Error('Test server not started');
    }

    try {
      // Import handleResourceRequest dynamically
      const { handleResourceRequest } = await import('../../src/resources/handlers/index.js');
      const content = await handleResourceRequest(uri);
      return {
        success: true,
        content: content.data,
        mimeType: content.mimeType
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  getServer(): CreativeLensServer {
    return this.server;
  }

  isStarted(): boolean {
    return this.started;
  }
}

// Helper to create a minimal test server for specific tool testing
export function createMockToolServer(tools: Record<string, any>): TestServer {
  const server = new TestServer({ mockTransport: true });
  
  // Override tool registry
  // @ts-ignore
  server.getServer()['toolRegistry'] = {
    getHandler: (name: string) => tools[name],
    executeTool: async (name: string, args: any, context: any) => {
      const handler = tools[name];
      if (!handler) {
        throw new Error(`Tool ${name} not found`);
      }
      return await handler(args, context);
    }
  };
  
  return server;
}