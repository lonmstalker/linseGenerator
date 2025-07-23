import { ToolContext, ToolHandler, ToolResult } from './types';
import {
  handleGenerateLensPrompt,
  handleEvolveIdea,
  handleCreateHybrid,
  handleEvaluateCreativity,
  handleGetSessionInsights,
  handleListSessions,
  handleGetSessionHistory
} from './handlers';

export class ToolRegistry {
  private handlers: Map<string, ToolHandler> = new Map();
  
  constructor() {
    this.registerHandlers();
  }
  
  private registerHandlers(): void {
    this.handlers.set('generate_creative_lens_prompt', handleGenerateLensPrompt);
    this.handlers.set('evolve_idea_with_structure', handleEvolveIdea);
    this.handlers.set('create_hybrid_framework', handleCreateHybrid);
    this.handlers.set('evaluate_creativity', handleEvaluateCreativity);
    this.handlers.set('get_session_insights', handleGetSessionInsights);
    this.handlers.set('list_sessions', handleListSessions);
    this.handlers.set('get_session_history', handleGetSessionHistory);
  }
  
  async executeTool(
    toolName: string, 
    args: unknown, 
    context: ToolContext
  ): Promise<ToolResult> {
    const handler = this.handlers.get(toolName);
    
    if (!handler) {
      return {
        success: false,
        error: `Unknown tool: ${toolName}`
      };
    }
    
    try {
      return await handler(args, context);
    } catch (error) {
      return {
        success: false,
        error: `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
  
  getHandler(toolName: string): ToolHandler | undefined {
    return this.handlers.get(toolName);
  }
  
  hasHandler(toolName: string): boolean {
    return this.handlers.has(toolName);
  }
  
  getAllToolNames(): string[] {
    return Array.from(this.handlers.keys());
  }
}