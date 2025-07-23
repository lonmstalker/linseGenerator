/**
 * Memory guard utilities to prevent crashes
 */

export class MemoryGuard {
  private static readonly MAX_RESPONSE_SIZE = 1024 * 1024; // 1MB
  private static readonly MAX_ARRAY_LENGTH = 10000;
  private static readonly MAX_STRING_LENGTH = 100000;
  
  /**
   * Check if response size is within limits
   */
  static checkResponseSize(data: any): boolean {
    try {
      const size = JSON.stringify(data).length;
      return size <= this.MAX_RESPONSE_SIZE;
    } catch {
      return false;
    }
  }
  
  /**
   * Truncate response if too large
   */
  static truncateResponse(data: any): any {
    const stringified = JSON.stringify(data);
    if (stringified.length <= this.MAX_RESPONSE_SIZE) {
      return data;
    }
    
    // Try to truncate arrays first
    if (Array.isArray(data)) {
      return data.slice(0, Math.floor(data.length / 2));
    }
    
    // For objects, truncate string values
    if (typeof data === 'object' && data !== null) {
      const truncated: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && value.length > this.MAX_STRING_LENGTH) {
          truncated[key] = value.substring(0, this.MAX_STRING_LENGTH) + '... [truncated]';
        } else if (Array.isArray(value) && value.length > this.MAX_ARRAY_LENGTH) {
          truncated[key] = value.slice(0, this.MAX_ARRAY_LENGTH);
        } else {
          truncated[key] = value;
        }
      }
      return truncated;
    }
    
    // For strings
    if (typeof data === 'string') {
      return data.substring(0, this.MAX_STRING_LENGTH) + '... [truncated]';
    }
    
    return data;
  }
  
  /**
   * Monitor memory usage
   */
  static checkMemoryUsage(): { used: number; limit: number; percentage: number } {
    const usage = process.memoryUsage();
    const heapUsed = usage.heapUsed;
    const heapTotal = usage.heapTotal;
    const percentage = (heapUsed / heapTotal) * 100;
    
    return {
      used: heapUsed,
      limit: heapTotal,
      percentage
    };
  }
  
  /**
   * Force garbage collection if available
   */
  static forceGC(): void {
    if (global.gc) {
      global.gc();
    }
  }
  
  /**
   * Check for potential infinite loops
   */
  static createLoopGuard(maxIterations: number = 10000) {
    let iterations = 0;
    
    return {
      check: () => {
        iterations++;
        if (iterations > maxIterations) {
          throw new Error(`Loop guard triggered after ${maxIterations} iterations`);
        }
      },
      reset: () => {
        iterations = 0;
      }
    };
  }
}