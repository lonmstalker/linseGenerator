/**
 * JSON validation and sanitization utilities
 */

export class JsonValidator {
  /**
   * Safely parse JSON with error handling
   */
  static safeParse<T = any>(data: string): { success: boolean; data?: T; error?: string } {
    try {
      // Remove any non-printable characters
      const cleaned = data.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      // Check for common JSON issues
      if (!cleaned.trim()) {
        return { success: false, error: 'Empty JSON string' };
      }
      
      // Attempt to parse
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch (error) {
      // Extract position from error message
      const posMatch = error.message.match(/position (\d+)/);
      const position = posMatch ? parseInt(posMatch[1], 10) : -1;
      
      // Try to identify the issue
      if (position > 0 && position < data.length) {
        const context = data.substring(Math.max(0, position - 20), Math.min(data.length, position + 20));
        return { 
          success: false, 
          error: `JSON parse error at position ${position}: "${context}"` 
        };
      }
      
      return { 
        success: false, 
        error: error.message || 'Unknown JSON parse error' 
      };
    }
  }
  
  /**
   * Validate JSON-RPC message structure
   */
  static isValidJsonRpcMessage(data: any): boolean {
    try {
      const str = typeof data === 'string' ? data : data.toString();
      
      // Basic structure check
      if (!str.includes('"jsonrpc"') || !str.includes('"2.0"')) {
        return false;
      }
      
      // Try to parse and validate structure
      const parsed = this.safeParse(str);
      if (!parsed.success) {
        return false;
      }
      
      const msg = parsed.data;
      return msg.jsonrpc === '2.0' && (msg.method || msg.result !== undefined || msg.error);
    } catch {
      return false;
    }
  }
  
  /**
   * Sanitize output to ensure valid JSON
   */
  static sanitizeForJson(value: any): any {
    if (value === undefined) return null;
    if (value === null) return null;
    
    // Handle special number cases
    if (typeof value === 'number') {
      if (isNaN(value)) return null;
      if (!isFinite(value)) return null;
    }
    
    // Handle strings with special characters
    if (typeof value === 'string') {
      // Remove control characters
      return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    }
    
    // Handle objects recursively
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(item => this.sanitizeForJson(item));
      }
      
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        sanitized[key] = this.sanitizeForJson(val);
      }
      return sanitized;
    }
    
    return value;
  }
  
  /**
   * Create safe JSON response
   */
  static createSafeResponse(data: any): string {
    try {
      const sanitized = this.sanitizeForJson(data);
      return JSON.stringify(sanitized, null, 2);
    } catch (error) {
      // Fallback to error response
      return JSON.stringify({
        error: 'Failed to serialize response',
        details: error.message
      }, null, 2);
    }
  }
}