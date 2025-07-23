/**
 * Type definitions for the Cross-Pollinator module
 */

/**
 * Framework for hybrid idea creation
 */
export interface HybridFramework {
  method: 'structural' | 'functional' | 'conceptual' | 'dialectical' | 'quantum' | 'biomimetic' | 'temporal';
  synthesisGuide: string;
  combinationPatterns: string[];
  emergentChecklist: string[];
  warningFlags: string[];
}

/**
 * Result of cross-pollination process
 */
export interface CrossPollinationResult {
  framework: HybridFramework;
  guidingPrompt: string;
  exampleHybrids: ExampleHybrid[];
  evaluationCriteria: {
    synergyScore: string;
    noveltyCheck: string;
    coherenceTest: string;
  };
}

/**
 * Example of successful hybrid
 */
export interface ExampleHybrid {
  sourceA: string;
  sourceB: string;
  result: string;
  emergentProperty: string;
}

/**
 * Method for fusing ideas
 */
export interface FusionMethod {
  name: string;
  description: string;
  bestFor: string[];
  process: string[];
  example: string;
  complexity: 'simple' | 'moderate' | 'complex';
  emergenceLevel: 'low' | 'medium' | 'high';
}

/**
 * Context for cross-pollination
 */
export interface CrossPollinationContext {
  ideaA: string;
  ideaB: string;
  method: FusionMethod;
  combinationPatterns: string[];
  emergentChecklist: string[];
  warningFlags: string[];
  exampleHybrids: ExampleHybrid[];
}

/**
 * Point of potential synergy
 */
export interface SynergyPoint {
  elementA: string;
  elementB: string;
  interactionType: string;
  potentialEmergence: string;
  strength: number; // 0-1
}

/**
 * Hybrid concept representation
 */
export interface HybridConcept {
  name: string;
  components: {
    fromA: string[];
    fromB: string[];
  };
  synthesis: string;
  emergentProperties: string[];
  uniqueValue: string;
}

/**
 * Analysis of idea components
 */
export interface IdeaAnalysis {
  coreFunction: string;
  keyComponents: string[];
  underlyingPrinciples: string[];
  constraints: string[];
  opportunities: string[];
}

/**
 * Compatibility assessment
 */
export interface CompatibilityAssessment {
  score: number; // 0-1
  compatibleElements: Array<{
    elementA: string;
    elementB: string;
    reason: string;
  }>;
  conflicts: Array<{
    elementA: string;
    elementB: string;
    issue: string;
    resolution?: string;
  }>;
}

/**
 * Options for cross-pollination
 */
export interface CrossPollinationOptions {
  preferredMethod?: string;
  emphasizeEmergence?: boolean;
  maintainSimplicity?: boolean;
  targetComplexity?: 'simple' | 'moderate' | 'complex';
  avoidElements?: string[];
}

/**
 * Synergy detector interface
 */
export interface ISynergyDetector {
  detectPotentialSynergies(ideaA: string, ideaB: string): SynergyPoint[];
  calculateSynergyScore(hybrid: HybridConcept): number;
  identifyEmergentProperties(components: string[], combination: string): string[];
  findUnexpectedInteractions(elementA: string, elementB: string): string[];
}

/**
 * Method selector interface
 */
export interface IMethodSelector {
  selectOptimalMethod(ideaA: string, ideaB: string, options?: CrossPollinationOptions): FusionMethod;
  assessMethodFitness(method: FusionMethod, ideaA: string, ideaB: string): number;
  rankMethods(ideaA: string, ideaB: string): Array<{ method: FusionMethod; score: number }>;
}