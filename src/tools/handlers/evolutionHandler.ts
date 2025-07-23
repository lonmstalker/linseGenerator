import { ToolContext, ToolResult } from '../types';
import { createSessionMiddleware } from '../../modules/stateManager/index.js';

export async function handleEvolveIdea(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const { current_idea, evolution_stage, desired_madness, preferred_patterns } = args;
    
    // Validate stage
    if (evolution_stage < 1 || evolution_stage > 3) {
      throw new Error('Evolution stage must be between 1 and 3');
    }
    
    // Apply session middleware
    const sessionMiddleware = createSessionMiddleware(context.stateManager);
    const enrichedArgs = await sessionMiddleware.beforeToolExecution(
      'evolve_idea_with_structure',
      { 
        ...args, 
        idea: current_idea, 
        targetStage: evolution_stage, 
        madnessLevel: desired_madness 
      }
    );
    
    // Generate evolution prompt
    const result = context.ideaEvolution.createEvolutionPrompt(
      current_idea,
      evolution_stage,
      desired_madness,
      {
        avoidPatterns: [],
        preferredPatterns: preferred_patterns || []
      }
    );
    
    // Update session after execution
    await sessionMiddleware.afterToolExecution(
      'evolve_idea_with_structure',
      { evolution: result.evolutionPrompt },
      enrichedArgs.sessionId,
      enrichedArgs
    );
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: result.evolutionPrompt
      }],
      metadata: {
        sessionId: enrichedArgs.sessionId,
        evaluationCriteria: result.evaluationCriteria,
        supportingFramework: result.supportingFramework
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to evolve idea: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}