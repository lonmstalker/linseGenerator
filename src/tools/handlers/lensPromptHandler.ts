import { ToolContext, ToolResult } from '../types';
import { createSessionMiddleware } from '../../modules/stateManager/index.js';
import { ErrorBoundary } from '../../utils/error-boundary.js';

export async function handleGenerateLensPrompt(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    // Validate input
    if (!ErrorBoundary.validateInput(args, {
      type: 'object',
      required: ['problem'],
      maxSize: 10000
    })) {
      throw new Error('Invalid input parameters');
    }
    
    const { problem, complexity = 'moderate', domains_to_explore, avoid_domains } = args;
    
    // Apply session middleware
    const sessionMiddleware = createSessionMiddleware(context.stateManager);
    const enrichedArgs = await sessionMiddleware.beforeToolExecution(
      'generate_creative_lens_prompt',
      args
    );
    
    // Generate lens prompts
    const result = context.lensGenerator.generateLensPrompts(problem, {
      complexity: complexity as 'simple' | 'moderate' | 'complex',
      preferredDomains: domains_to_explore,
      avoidDomains: avoid_domains,
    });
    
    // Update session after execution
    await sessionMiddleware.afterToolExecution(
      'generate_creative_lens_prompt',
      { 
        prompt: result.prompts.mainPrompt, 
        domains: result.metadata.suggestedDomains 
      },
      enrichedArgs.sessionId,
      args
    );
    
    // Return structured result
    return {
      success: true,
      content: [{
        type: 'text',
        text: result.prompts.mainPrompt
      }],
      metadata: {
        sessionId: enrichedArgs.sessionId,
        domains: result.metadata.suggestedDomains,
        timestamp: result.metadata.timestamp,
        guidingQuestions: result.prompts.guidingQuestions,
        exampleFormat: result.prompts.exampleFormat
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to generate lens prompt: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}