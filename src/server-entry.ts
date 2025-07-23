#!/usr/bin/env tsx
/**
 * Unified MCP Server entry point with configurable output filtering
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CreativeLensServer } from './server.js';
import { JsonValidator } from './utils/json-validator.js';
import { ErrorBoundary } from './utils/error-boundary.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine output mode from environment or CLI args
// Default to silent mode for MCP servers to prevent stdio pollution
const OUTPUT_MODE = process.env['MCP_OUTPUT_MODE'] || 
  (process.argv.includes('--verbose') ? 'normal' : 'silent');

/**
 * Configure console output based on mode
 */
function configureOutput() {
  if (OUTPUT_MODE === 'silent') {
    // Silent mode: suppress all console output
    const noop = () => {};
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.debug = noop;
    console.dir = noop;
    console.table = noop;
    
    // Set environment for minimal logging
    process.env.LOG_LEVEL = 'error';
    process.env.NODE_ENV = 'production';
  }
}

/**
 * Custom transport that filters stdout for JSON-RPC only
 */
class FilteredStdioTransport extends StdioServerTransport {
  private originalWrite: typeof process.stdout.write;
  
  constructor() {
    super();
    
    if (OUTPUT_MODE === 'silent') {
      // Store original write
      this.originalWrite = process.stdout.write.bind(process.stdout);
      
      // Override stdout to filter non-JSON content
      const self = this;
      process.stdout.write = function(chunk: any, encoding?: any, callback?: any): boolean {
        // Only allow valid JSON-RPC messages through
        if (JsonValidator.isValidJsonRpcMessage(chunk)) {
          return self.originalWrite(chunk, encoding, callback);
        }
        // Silently drop non-JSON output
        if (callback) callback();
        return true;
      };
    }
  }
}

/**
 * Main server startup
 */
async function main() {
  // Setup global error handlers first
  ErrorBoundary.setupGlobalHandlers();
  
  configureOutput();
  
  try {
    const server = new CreativeLensServer();
    const transport = OUTPUT_MODE === 'silent' 
      ? new FilteredStdioTransport() 
      : new StdioServerTransport();
    
    await server.connect(transport);
  } catch (error) {
    // Only log critical startup errors in production
    if (process.env.NODE_ENV === 'development') {
      process.stderr.write(`Server error: ${error}\n`);
    }
    // Create a clean error response instead of crashing
    const errorResponse = ErrorBoundary.createErrorResponse(error);
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
    process.exit(1);
  }
}

// Error handling is now managed by ErrorBoundary.setupGlobalHandlers()

// Start server
main();