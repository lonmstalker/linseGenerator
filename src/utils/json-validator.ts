/**
 * JSON Validator utility for ensuring valid JSON responses
 * Helps prevent SyntaxError issues when sending data through stdio transport
 */

export class JsonValidator {
  /**
   * Safely parse JSON string with error handling
   */
  static safeParse(jsonString: string): { success: boolean; data?: any; error?: string } {
    try {
      const trimmed = jsonString.trim();
      
      // Check for common issues
      if (!trimmed) {
        return { success: false, error: 'Empty string' };
      }
      
      // Check for multiple JSON objects (common error)
      const firstBrace = trimmed.indexOf('{');
      const lastBrace = trimmed.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1) {
        // Check if there's content after the last closing brace
        const afterContent = trimmed.substring(lastBrace + 1).trim();
        if (afterContent && afterContent !== '') {
          return { 
            success: false, 
            error: `Unexpected content after JSON: "${afterContent.substring(0, 20)}..."` 
          };
        }
      }
      
      const data = JSON.parse(trimmed);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown parse error' 
      };
    }
  }
  
  /**
   * Sanitize object for JSON serialization
   * Removes undefined values, circular references, and functions
   */
  static sanitize(obj: any): any {
    const seen = new WeakSet();
    
    const sanitizeValue = (value: any): any => {
      // Handle null
      if (value === null) return null;
      
      // Handle primitives
      if (typeof value !== 'object') {
        if (typeof value === 'function' || typeof value === 'undefined') {
          return null;
        }
        if (typeof value === 'symbol') {
          return value.toString();
        }
        if (typeof value === 'bigint') {
          return value.toString();
        }
        // Handle NaN and Infinity
        if (typeof value === 'number') {
          if (isNaN(value)) return 'NaN';
          if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
        }
        return value;
      }
      
      // Handle circular references
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
      
      // Handle arrays
      if (Array.isArray(value)) {
        return value.map(sanitizeValue);
      }
      
      // Handle objects
      const sanitized: any = {};
      for (const [key, val] of Object.entries(value)) {
        const sanitizedValue = sanitizeValue(val);
        if (sanitizedValue !== undefined) {
          sanitized[key] = sanitizedValue;
        }
      }
      
      return sanitized;
    };
    
    return sanitizeValue(obj);
  }
  
  /**
   * Create a safe JSON response string
   * Ensures the response can be properly serialized and parsed
   */
  static createSafeResponse(data: any): string {
    try {
      // First sanitize the data
      const sanitized = this.sanitize(data);
      
      // Try to serialize
      const jsonString = JSON.stringify(sanitized);
      
      // Validate the result
      const validation = this.safeParse(jsonString);
      if (!validation.success) {
        throw new Error(`Failed to create valid JSON: ${validation.error}`);
      }
      
      return jsonString;
    } catch (error) {
      // Fallback to error response
      const errorResponse = {
        error: 'Failed to serialize response',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
      
      // This should always succeed since it's a simple object
      return JSON.stringify(errorResponse);
    }
  }
  
  /**
   * Validate that a string contains exactly one JSON object
   */
  static validateSingleJson(str: string): boolean {
    try {
      const trimmed = str.trim();
      
      // Must start with { or [
      if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) {
        return false;
      }
      
      // Parse to validate
      JSON.parse(trimmed);
      
      // Check there's nothing after the JSON
      const parsed = JSON.parse(trimmed);
      const reparsed = JSON.stringify(parsed);
      const secondParse = JSON.parse(reparsed);
      
      // If we can parse and reparse without issues, it's valid
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Fix common JSON issues
   */
  static fixCommonIssues(str: string): string {
    let fixed = str.trim();
    
    // Remove BOM if present
    if (fixed.charCodeAt(0) === 0xFEFF) {
      fixed = fixed.slice(1);
    }
    
    // Replace smart quotes with regular quotes
    fixed = fixed
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');
    
    // Remove trailing commas in objects and arrays
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unquoted keys (simple cases)
    fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
    
    return fixed;
  }
  
  /**
   * Check if a chunk is a valid JSON-RPC message
   */
  static isValidJsonRpcMessage(chunk: any): boolean {
    try {
      // Convert to string if buffer
      const str = typeof chunk === 'string' ? chunk : chunk.toString();
      const trimmed = str.trim();
      
      // Must be JSON
      if (!trimmed.startsWith('{')) {
        return false;
      }
      
      // Parse and check for JSON-RPC structure
      const parsed = JSON.parse(trimmed);
      
      // Check for JSON-RPC required fields
      if (parsed.jsonrpc !== '2.0') {
        return false;
      }
      
      // Must have either result, error, or method
      if (!('result' in parsed) && !('error' in parsed) && !('method' in parsed)) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
}