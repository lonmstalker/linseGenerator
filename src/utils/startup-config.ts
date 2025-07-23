/**
 * Startup configuration validator for MCP servers
 */

export interface StartupConfig {
  isStartupOnLoginEnabled?: boolean;
  autoStart?: boolean;
  startupDelay?: number;
  maxRetries?: number;
}

export class StartupValidator {
  /**
   * Validate startup configuration
   */
  static validate(config: any): StartupConfig {
    const validated: StartupConfig = {};
    
    // Validate boolean fields
    if (config.isStartupOnLoginEnabled !== undefined) {
      validated.isStartupOnLoginEnabled = Boolean(config.isStartupOnLoginEnabled);
    }
    
    if (config.autoStart !== undefined) {
      validated.autoStart = Boolean(config.autoStart);
    }
    
    // Validate numeric fields
    if (config.startupDelay !== undefined) {
      const delay = Number(config.startupDelay);
      if (!isNaN(delay) && delay >= 0) {
        validated.startupDelay = delay;
      }
    }
    
    if (config.maxRetries !== undefined) {
      const retries = Number(config.maxRetries);
      if (!isNaN(retries) && retries >= 0) {
        validated.maxRetries = Math.floor(retries);
      }
    }
    
    return validated;
  }
  
  /**
   * Create default startup configuration
   */
  static getDefaults(): StartupConfig {
    return {
      isStartupOnLoginEnabled: false,
      autoStart: false,
      startupDelay: 0,
      maxRetries: 3
    };
  }
  
  /**
   * Merge configurations with defaults
   */
  static merge(config: Partial<StartupConfig>): StartupConfig {
    return {
      ...this.getDefaults(),
      ...this.validate(config)
    };
  }
}