import { StateManager } from '../modules/stateManager/index.js';
import { LensPromptGenerator } from '../modules/lensGenerator/index.js';
import { IdeaEvolutionAssistant } from '../modules/ideaProcessor/index.js';
import { CrossPollinator } from '../modules/crossPollinator/index.js';

export interface ToolContext {
  stateManager: StateManager;
  lensGenerator: LensPromptGenerator;
  ideaEvolution: IdeaEvolutionAssistant;
  crossPollinator: CrossPollinator;
}

export interface ToolResult {
  success: boolean;
  content?: Array<{
    type: string;
    text?: string;
    data?: unknown;
  }>;
  metadata?: unknown;
  error?: string;
}

export interface ToolHandler {
  (args: unknown, context: ToolContext): Promise<ToolResult>;
}