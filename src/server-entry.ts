#!/usr/bin/env tsx
/**
 * Unified MCP Server entry point with configurable output filtering
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CreativeLensServer } from './server.js';
import { JsonValidator } from './utils/json-validator.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Determine output mode from environment or CLI args
const OUTPUT_MODE = process.env['MCP_OUTPUT_MODE'] || 
  (process.argv.includes('--silent') ? 'silent' : 'normal');

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
  configureOutput();
  
  try {
    const server = new CreativeLensServer();
    const transport = OUTPUT_MODE === 'silent' 
      ? new FilteredStdioTransport() 
      : new StdioServerTransport();
    
    await server.connect(transport);
  } catch (error) {
    // Always log errors to stderr
    process.stderr.write(`Server error: ${error}\n`);
    process.exit(1);
  }
}

// Handle process errors with recovery
let errorCount = 0;
const MAX_ERRORS = 5;

process.on('uncaughtException', (error) => {
  errorCount++;
  process.stderr.write(`Uncaught exception (${errorCount}/${MAX_ERRORS}): ${error}\n`);
  
  // Try to recover if under error threshold
  if (errorCount < MAX_ERRORS) {
    process.stderr.write('Attempting to recover...\n');
    // Don't exit, let the server continue
  } else {
    process.stderr.write('Too many errors, exiting...\n');
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason) => {
  errorCount++;
  process.stderr.write(`Unhandled rejection (${errorCount}/${MAX_ERRORS}): ${reason}\n`);
  
  if (errorCount >= MAX_ERRORS) {
    process.exit(1);
  }
});

// Reset error count periodically
setInterval(() => {
  if (errorCount > 0) {
    errorCount = Math.max(0, errorCount - 1);
  }
}, 60000); // Every minute

// Start server
main();