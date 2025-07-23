import { ToolContext, ToolResult } from '../types';
import { createSessionMiddleware } from '../../modules/stateManager/index.js';

export async function handleCreateHybrid(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const { idea_a, idea_b, fusion_method = 'auto' } = args;
    
    // Apply session middleware
    const sessionMiddleware = createSessionMiddleware(context.stateManager);
    const enrichedArgs = await sessionMiddleware.beforeToolExecution(
      'create_hybrid_framework',
      { 
        ...args, 
        ideaA: idea_a, 
        ideaB: idea_b, 
        method: fusion_method 
      }
    );
    
    // Create hybrid framework
    const methodName = fusion_method === 'auto' ? undefined : fusion_method;
    const result = context.crossPollinator.createHybridFramework(
      idea_a,
      idea_b,
      methodName
    );
    
    // Update session after execution
    await sessionMiddleware.afterToolExecution(
      'create_hybrid_framework',
      { hybrid: result.guidingPrompt, success: true },
      enrichedArgs.sessionId,
      enrichedArgs
    );
    
    // Format result based on emphasis
    let formattedText = result.guidingPrompt;
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: formattedText
      }],
      metadata: {
        sessionId: enrichedArgs.sessionId,
        method: result.framework.method,
        exampleCount: result.exampleHybrids.length,
        examples: result.exampleHybrids,
        framework: result.framework
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to create hybrid: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}