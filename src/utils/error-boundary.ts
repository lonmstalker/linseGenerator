/**
 * Error boundary utilities for crash prevention
 */

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
}