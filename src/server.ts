/**
 * Dynamic Creative Lens Generator - MCP Server
 * 
 * This server provides tools for generating creative solutions through unique perception lenses.
 * It helps Claude analyze problems from multiple perspectives using metaphors from diverse domains.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import * as dotenv from 'dotenv';
import { LensPromptGenerator } from './modules/lensGenerator/index.js';
import { IdeaEvolutionAssistant } from './modules/ideaProcessor/index.js';
import { CrossPollinator } from './modules/crossPollinator/index.js';
import { StateManager } from './modules/stateManager/index.js';
import { tools, ToolRegistry, ToolContext } from './tools/index.js';
import { resources } from './resources/index.js';
import { handleResourceRequest } from './resources/handlers/index.js';
import { EventBus, EventType, createToolEvent, createResourceEvent } from './tools/events.js';
import { JsonValidator } from './utils/json-validator.js';
import { StartupValidator } from './utils/startup-config.js';
import { MemoryGuard } from './utils/memory-guard.js';

/**
 * Logger utility with configurable levels
 */
class Logger {
  private static logLevel: string = process.env['LOG_LEVEL'] || 'info';
  private static levels = ['debug', 'info', 'warn', 'error'];
  
  private static shouldLog(level: string): boolean {
    const currentLevelIndex = this.levels.indexOf(this.logLevel);
    const messageLevelIndex = this.levels.indexOf(level);
    return messageLevelIndex >= currentLevelIndex;
  }
  
  private static format(level: string, message: string, ...args: any[]): void {
    if (this.shouldLog(level)) {
      const timestamp = new Date().toISOString();
      // In MCP server context, only output to stderr to avoid breaking JSON protocol
      // Only log errors to stderr, everything else is suppressed in production
      if (level === 'error' || process.env.NODE_ENV === 'development') {
        console.error(`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
      }
    }
  }
  
  static debug(message: string, ...args: any[]): void {
    this.format('debug', message, ...args);
  }
  
  static info(message: string, ...args: any[]): void {
    this.format('info', message, ...args);
  }
  
  static warn(message: string, ...args: any[]): void {
    this.format('warn', message, ...args);
  }
  
  static error(message: string, ...args: any[]): void {
    this.format('error', message, ...args);
  }
}

/**
 * Configuration from environment variables
 */
const CONFIG = {
  LOG_LEVEL: process.env['LOG_LEVEL'] || 'info',
  MAX_SESSIONS: parseInt(process.env['MAX_SESSIONS'] || '100', 10),
  SESSION_TIMEOUT: parseInt(process.env['SESSION_TIMEOUT'] || '3600000', 10), // 1 hour
  STATE_PERSISTENCE: process.env['STATE_PERSISTENCE'] || 'memory',
  STARTUP: StartupValidator.merge({
    isStartupOnLoginEnabled: false,
    autoStart: false,
    startupDelay: 1000
  })
};

/**
 * Main server class for the Creative Lens Generator
 * Extends the MCP Server to provide creative thinking tools
 */
export class CreativeLensServer extends Server {
  private stateManager: StateManager;
  private lensGenerator: LensPromptGenerator;
  private ideaEvolution: IdeaEvolutionAssistant;
  private crossPollinator: CrossPollinator;
  private toolRegistry: ToolRegistry;
  private toolContext: ToolContext;
  private eventBus: EventBus;
  
  private memoryCheckInterval?: NodeJS.Timeout;
  
  constructor() {
    super({
      name: 'dynamic-creative-lens-generator',
      version: '1.0.0'
    }, {
      capabilities: {
        tools: {},
        resources: {}
      }
    });
    
    Logger.info('Initializing Creative Lens Generator server...');
    
    // Set up memory monitoring
    this.setupMemoryMonitoring();
    
    // Initialize state manager
    try {
      this.stateManager = new StateManager();
    } catch (error) {
      Logger.error('Failed to initialize StateManager:', error);
      throw error;
    }
    
    // Initialize modules
    try {
      this.lensGenerator = new LensPromptGenerator();
      this.ideaEvolution = new IdeaEvolutionAssistant();
      this.crossPollinator = new CrossPollinator();
    } catch (error) {
      Logger.error('Failed to initialize modules:', error);
      throw error;
    }
    
    // Initialize event bus
    this.eventBus = EventBus.getInstance();
    
    // Initialize tool registry and context
    try {
      this.toolRegistry = new ToolRegistry();
      this.toolContext = {
        stateManager: this.stateManager,
        lensGenerator: this.lensGenerator,
        ideaEvolution: this.ideaEvolution,
        crossPollinator: this.crossPollinator
      };
    } catch (error) {
      Logger.error('Failed to initialize tool registry:', error);
      throw error;
    }
    
    // Initialize server components
    this.setupHandlers();
    this.initializeStateManager();
  }
  
  /**
   * Set up request handlers for MCP protocol
   */
  private setupHandlers(): void {
    Logger.debug('Setting up request handlers...');
    
    // Add global JSON validation for stdio transport
    const originalWrite = process.stdout.write;
    process.stdout.write = function(chunk: any, ...args: any[]): boolean {
      try {
        // Check if this is JSON data
        if (typeof chunk === 'string' && chunk.trim().startsWith('{')) {
          // Validate JSON before sending
          const validated = JsonValidator.safeParse(chunk);
          if (!validated.success) {
            Logger.error('Invalid JSON being sent:', validated.error);
            Logger.debug('JSON chunk:', chunk.substring(0, 200) + '...');
          }
        }
      } catch (e) {
        // Ignore validation errors in logging
      }
      return originalWrite.apply(process.stdout, [chunk, ...args]);
    };
    
    // Tool list handler
    this.setRequestHandler(ListToolsRequestSchema, async () => {
      Logger.debug('Handling tools/list request');
      
      return {
        tools: tools
      };
    });
    
    // Tool call handler
    this.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      Logger.info(`Executing tool: ${name}`);
      Logger.debug('Tool arguments:', args);
      
      const startTime = Date.now();
      
      // Emit tool called event
      this.eventBus.emitEvent(createToolEvent(
        EventType.TOOL_CALLED,
        name,
        args?.['session_id'] as string,
        args
      ));
      
      try {
        // Use tool registry to execute tools
        const result = await this.toolRegistry.executeTool(name, args, this.toolContext);
        
        if (!result.success) {
          throw new Error(result.error || 'Tool execution failed');
        }
        
        const duration = Date.now() - startTime;
        
        // Emit tool completed event
        this.eventBus.emitEvent(createToolEvent(
          EventType.TOOL_COMPLETED,
          name,
          args?.['session_id'] as string,
          args,
          result,
          undefined,
          duration
        ));
        
        // Check response size before sending
        let response = {
          content: result.content || [],
          ...(result.metadata && typeof result.metadata === 'object' ? result.metadata : {})
        };
        
        // Truncate if too large
        if (!MemoryGuard.checkResponseSize(response)) {
          Logger.warn(`Response too large for tool ${name}, truncating...`);
          response = MemoryGuard.truncateResponse(response);
        }
        
        // Ensure the response is properly sanitized for JSON
        const sanitizedResponse = JSON.parse(JsonValidator.createSafeResponse(response));
        
        return sanitizedResponse;
      } catch (error) {
        Logger.error(`Error in tool ${name}:`, error);
        
        const duration = Date.now() - startTime;
        
        // Emit tool failed event
        this.eventBus.emitEvent(createToolEvent(
          EventType.TOOL_FAILED,
          name,
          args?.['session_id'] as string,
          args,
          undefined,
          error as Error,
          duration
        ));
        
        // Return error in MCP format
        const errorResponse = {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
          }],
          isError: true
        };
        
        // Ensure error response is properly sanitized
        const sanitizedErrorResponse = JSON.parse(JsonValidator.createSafeResponse(errorResponse));
        
        return sanitizedErrorResponse;
      }
    });
    
    // Resource list handler
    this.setRequestHandler(ListResourcesRequestSchema, async () => {
      Logger.debug('Handling resources/list request');
      
      return {
        resources: resources
      };
    });
    
    // Resource read handler
    this.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      Logger.info(`Reading resource: ${uri}`);
      
      try {
        const content = await handleResourceRequest(uri);
        
        // Emit resource accessed event
        this.eventBus.emitEvent(createResourceEvent(
          uri,
          content.uri.split('://')[1].split('/')[0],
          'read'
        ));
        
        // Ensure content.data is a string for the text field
        const textContent = typeof content.data === 'string' 
          ? content.data 
          : JsonValidator.createSafeResponse(content.data);
        
        return {
          contents: [{
            uri: content.uri,
            mimeType: content.mimeType,
            text: textContent
          }]
        };
      } catch (error) {
        Logger.error(`Error reading resource ${uri}:`, error);
        
        return {
          contents: [{
            uri: uri,
            mimeType: 'text/plain',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
          }],
          isError: true
        };
      }
    });
  }
  
  /**
   * Set up memory monitoring
   */
  private setupMemoryMonitoring(): void {
    // Check memory every 30 seconds
    this.memoryCheckInterval = setInterval(() => {
      const memInfo = MemoryGuard.checkMemoryUsage();
      
      if (memInfo.percentage > 80) {
        Logger.warn(`High memory usage: ${memInfo.percentage.toFixed(1)}%`);
        
        // Try to free memory
        MemoryGuard.forceGC();
        
        // Clean up old sessions if memory is critical
        if (memInfo.percentage > 90) {
          Logger.error('Critical memory usage, cleaning up old sessions...');
          this.stateManager.cleanupInactiveSessions(60000); // Clean up sessions inactive for 1 minute
        }
      }
    }, 30000);
  }
  
  /**
   * Initialize state manager
   */
  private async initializeStateManager(): Promise<void> {
    try {
      await this.stateManager.initialize();
      Logger.info('State manager initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize state manager:', error);
      throw error;
    }
  }
  
  /**
   * Clean up and close server
   */
  override async close(): Promise<void> {
    Logger.info('Closing server...');
    
    // Stop memory monitoring
    if (this.memoryCheckInterval) {
      clearInterval(this.memoryCheckInterval);
    }
    
    try {
      await this.stateManager.shutdown();
      Logger.info('State manager shut down successfully');
    } catch (error) {
      Logger.error('Failed to shut down state manager:', error);
    }
    
    await super.close();
    Logger.info('Server closed');
  }
}

/**
 * Main entry point
 * Creates and starts the MCP server with stdio transport
 */
async function main() {
  // Load environment variables
  dotenv.config();
  
  Logger.info('Starting Creative Lens Generator MCP server...');
  Logger.info('Configuration:', CONFIG);
  
  const server = new CreativeLensServer();
  const transport = new StdioServerTransport();
  
  // Initialize state manager
  try {
    await server['initializeStateManager']();
  } catch (error) {
    Logger.error('Failed to initialize server:', error);
    process.exit(1);
  }
  
  // Handle graceful shutdown
  const shutdown = async () => {
    Logger.info('Shutdown signal received');
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      Logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  };
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
  // Handle uncaught errors
  process.on('uncaughtException', (error) => {
    Logger.error('Uncaught exception:', error);
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });
  
  // Connect transport and start server
  await server.connect(transport);
  
  Logger.info('Creative Lens Generator MCP server is running');
  Logger.info('Ready to generate creative solutions through unique perception lenses');
}

// Export main for testing purposes
export { main };

// Run main function only when this file is executed directly
// Using import.meta.url for ES modules compatibility
if (typeof require !== 'undefined' && require.main === module) {
  main().catch((error) => {
    Logger.error('Fatal error:', error);
    process.exit(1);
  });
}