/**
 * Type definitions for the Idea Processor module
 */

/**
 * Kit for generating evolution prompts at different stages
 */
export interface EvolutionPromptKit {
  stage: number;
  directions: string[];
  crossDomainInjections: string[];
  madnessAmplifiers: string[];
  constraintQuestions: string[];
}

/**
 * Result of idea evolution process
 */
export interface IdeaEvolutionResult {
  originalIdea: string;
  evolutionPrompt: string;
  evaluationCriteria: {
    madnessIndex: string;
    practicalityCheck: string;
    noveltyAssessment: string;
  };
  supportingFramework: {
    techniques: string[];
    examples: string[];
    warnings: string[];
  };
}

/**
 * Pattern for transforming ideas
 */
export interface EvolutionPattern {
  name: string;
  description: string;
  application: string;
  exampleTransformation: string;
  bestForStage?: number; // 1, 2, or 3
  madnessMultiplier?: number; // How much this pattern increases madness
}

/**
 * Domain injection details
 */
export interface DomainInjection {
  domain: string;
  injectionPoint: string;
  element: string;
  rationale: string;
}

/**
 * Context for evolution process
 */
export interface EvolutionContext {
  idea: string;
  stage: number;
  targetMadness: number;
  pattern: EvolutionPattern;
  injectedDomain: string;
  domainElement: string;
  madnessAmplifiers: string[];
  guidingQuestions: string[];
}

/**
 * Tracks evolution progress
 */
export interface EvolutionTracker {
  sessionId: string;
  originalIdea: string;
  evolutionChain: EvolutionStep[];
  branches: Map<number, EvolutionBranch>;
  totalMadnessProgression: number[];
}

/**
 * Single step in evolution chain
 */
export interface EvolutionStep {
  stage: number;
  idea: string;
  madnessIndex: number;
  pattern: string;
  injectedDomain: string;
  timestamp: number;
  semanticDistance?: number;
}

/**
 * Branch point in evolution
 */
export interface EvolutionBranch {
  fromStage: number;
  alternativeIdeas: string[];
  selectedIndex: number;
  branchReason: string;
}

/**
 * Options for evolution
 */
export interface EvolutionOptions {
  preferredPatterns?: string[];
  avoidPatterns?: string[];
  maintainPracticality?: boolean;
  allowAbsurdity?: boolean;
  domainPool?: string[];
}

/**
 * Madness amplifier types
 */
export enum AmplifierType {
  SCALE = 'scale',
  ABSTRACTION = 'abstraction',
  COMBINATION = 'combination',
  INVERSION = 'inversion',
  RECURSION = 'recursion',
  PARADOX = 'paradox'
}

/**
 * Evaluation metrics
 */
export interface EvolutionMetrics {
  semanticDistance: number; // 0-1, how far from original
  coherenceScore: number; // 0-1, internal consistency
  noveltyScore: number; // 0-1, uniqueness
  practicalityScore: number; // 0-1, feasibility
  madnessIndex: number; // 1-10, overall craziness
}