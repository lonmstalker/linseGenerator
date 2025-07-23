import { ToolContext, ToolResult } from '../types';
import { createSessionMiddleware } from '../../modules/stateManager/index.js';

export async function handleEvaluateCreativity(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const { ideas, evaluation_criteria = ['novelty', 'usefulness'], comparison_mode = false } = args;
    
    if (!Array.isArray(ideas) || ideas.length === 0) {
      throw new Error('At least one idea must be provided');
    }
    
    // Apply session middleware
    const sessionMiddleware = createSessionMiddleware(context.stateManager);
    const enrichedArgs = await sessionMiddleware.beforeToolExecution(
      'evaluate_creativity',
      args
    );
    
    // Create evaluation framework
    let evaluationText = `=== CREATIVITY EVALUATION FRAMEWORK ===\n\n`;
    evaluationText += `Ideas to evaluate: ${ideas.length}\n`;
    evaluationText += `Criteria: ${evaluation_criteria.join(', ')}\n`;
    evaluationText += `Mode: ${comparison_mode ? 'Comparative' : 'Individual'}\n\n`;
    
    // Add evaluation structure
    evaluationText += `EVALUATION STRUCTURE:\n\n`;
    
    ideas.forEach((idea, index) => {
      evaluationText += `${index + 1}. "${idea.substring(0, 50)}${idea.length > 50 ? '...' : ''}"\n`;
      evaluation_criteria.forEach((criterion: string) => {
        evaluationText += `   - ${criterion.charAt(0).toUpperCase() + criterion.slice(1)}: [Analysis here]\n`;
      });
      evaluationText += '\n';
    });
    
    if (comparison_mode) {
      evaluationText += `COMPARATIVE ANALYSIS:\n`;
      evaluationText += `- Most Novel: [Identify which idea and why]\n`;
      evaluationText += `- Most Useful: [Identify which idea and why]\n`;
      evaluationText += `- Best Overall: [Identify which idea and why]\n`;
    }
    
    // Update session
    await sessionMiddleware.afterToolExecution(
      'evaluate_creativity',
      { evaluatedCount: ideas.length },
      enrichedArgs.sessionId,
      args
    );
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: evaluationText
      }],
      metadata: {
        sessionId: enrichedArgs.sessionId,
        ideaCount: ideas.length,
        criteria: evaluation_criteria,
        comparisonMode: comparison_mode
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to evaluate creativity: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}