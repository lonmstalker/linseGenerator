/**
 * Error boundary utilities for crash prevention
 */

import { JsonValidator } from './json-validator.js';

export interface ErrorResponse {
  error: {
    code: number;
    message: string;
    data?: any;
  };
}

export class ErrorBoundary {
  /**
   * Wrap async function with error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    fallback: T,
    context?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (context) {
        console.error(`Error in ${context}:`, error);
      }
      return fallback;
    }
  }
  
  /**
   * Wrap sync function with error handling
   */
  static wrap<T>(
    fn: () => T,
    fallback: T,
    context?: string
  ): T {
    try {
      return fn();
    } catch (error) {
      if (context) {
        console.error(`Error in ${context}:`, error);
      }
      return fallback;
    }
  }
  
  /**
   * Create a safe wrapper for event handlers
   */
  static createSafeHandler<T extends (...args: any[]) => any>(
    handler: T,
    context?: string
  ): T {
    return ((...args: any[]) => {
      try {
        const result = handler(...args);
        if (result instanceof Promise) {
          return result.catch((error: Error) => {
            console.error(`Async error in ${context || 'handler'}:`, error);
          });
        }
        return result;
      } catch (error) {
        console.error(`Sync error in ${context || 'handler'}:`, error);
      }
    }) as T;
  }
  
  /**
   * Validate input to prevent crashes
   */
  static validateInput(input: any, schema: {
    type?: string;
    required?: string[];
    maxLength?: number;
    maxSize?: number;
  }): boolean {
    try {
      // Type check
      if (schema.type && typeof input !== schema.type) {
        return false;
      }
      
      // Required fields
      if (schema.required && typeof input === 'object') {
        for (const field of schema.required) {
          if (!(field in input)) {
            return false;
          }
        }
      }
      
      // String length
      if (schema.maxLength && typeof input === 'string') {
        return input.length <= schema.maxLength;
      }
      
      // Object size
      if (schema.maxSize && typeof input === 'object') {
        const size = JSON.stringify(input).length;
        return size <= schema.maxSize;
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Create a standardized error response for MCP
   */
  static createErrorResponse(
    error: Error | unknown,
    code: number = -32603
  ): ErrorResponse {
    let message = 'Internal error';
    let data: any = undefined;

    if (error instanceof Error) {
      message = error.message;
      if (process.env.NODE_ENV === 'development') {
        data = {
          stack: error.stack,
          name: error.name
        };
      }
    } else if (typeof error === 'string') {
      message = error;
    } else {
      message = 'Unknown error occurred';
    }

    return {
      error: {
        code,
        message,
        data
      }
    };
  }

  /**
   * Wrap MCP tool handler with comprehensive error boundary
   */
  static wrapToolHandler<T extends (...args: any[]) => any>(
    handler: T
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        const result = await handler(...args);
        
        // Ensure result is properly formatted
        if (result && typeof result === 'object') {
          // Sanitize the result to ensure it's JSON-serializable
          const sanitized = JsonValidator.sanitize(result);
          return sanitized;
        }
        
        return result;
      } catch (error) {
        // Log error for debugging only in development
        if (process.env.NODE_ENV === 'development') {
          console.error('Tool handler error:', error);
        }
        
        // Return error in MCP format
        return {
          content: [{
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
          }],
          isError: true
        };
      }
    }) as T;
  }

  /**
   * Setup global error handlers to prevent crashes
   */
  static setupGlobalHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      // Log to stderr only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Uncaught exception:', error);
      }
      
      // Try to continue running instead of crashing
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      // Log to stderr only in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Unhandled rejection at:', promise, 'reason:', reason);
      }
      
      // Try to continue running instead of crashing
    });

    // Handle SIGTERM gracefully
    process.on('SIGTERM', () => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Received SIGTERM, shutting down gracefully...');
      }
      process.exit(0);
    });

    // Handle SIGINT gracefully
    process.on('SIGINT', () => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Received SIGINT, shutting down gracefully...');
      }
      process.exit(0);
    });
  }

  /**
   * Validate and sanitize tool arguments to prevent injection
   */
  static validateToolArgs(args: any): any {
    if (!args || typeof args !== 'object') {
      return {};
    }

    // Remove any potentially harmful properties
    const sanitized = { ...args };
    delete sanitized.__proto__;
    delete sanitized.constructor;
    delete sanitized.prototype;

    // Ensure all string values are properly escaped
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        // Remove any control characters that could break JSON
        sanitized[key] = value.replace(/[\x00-\x1F\x7F]/g, '');
      }
    }

    return sanitized;
  }
}