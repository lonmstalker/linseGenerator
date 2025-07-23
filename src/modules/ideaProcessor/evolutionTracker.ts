/**
 * Evolution Tracker
 * Tracks the progression of ideas through evolution stages
 */

import { 
  EvolutionTracker, 
  EvolutionStep, 
  EvolutionBranch,
  EvolutionMetrics 
} from './types';

export class EvolutionTrackerImpl implements EvolutionTracker {
  sessionId: string;
  originalIdea: string;
  evolutionChain: EvolutionStep[] = [];
  branches: Map<number, EvolutionBranch> = new Map();
  totalMadnessProgression: number[] = [];
  
  constructor(sessionId: string, originalIdea: string) {
    this.sessionId = sessionId;
    this.originalIdea = originalIdea;
  }
  
  /**
   * Add a new evolution step
   */
  addStep(step: EvolutionStep): void {
    // Calculate semantic distance if not provided
    if (step.semanticDistance === undefined) {
      step.semanticDistance = this.calculateSemanticDistance(
        this.originalIdea,
        step.idea
      );
    }
    
    this.evolutionChain.push(step);
    this.totalMadnessProgression.push(step.madnessIndex);
  }
  
  /**
   * Create a branch point
   */
  createBranch(fromStage: number, alternatives: string[], reason: string): void {
    const branch: EvolutionBranch = {
      fromStage,
      alternativeIdeas: alternatives,
      selectedIndex: 0, // Default to first option
      branchReason: reason
    };
    
    this.branches.set(fromStage, branch);
  }
  
  /**
   * Get current evolution state
   */
  getCurrentState(): { stage: number; idea: string; madness: number } | null {
    const lastStep = this.evolutionChain[this.evolutionChain.length - 1];
    
    if (!lastStep) return null;
    
    return {
      stage: lastStep.stage,
      idea: lastStep.idea,
      madness: lastStep.madnessIndex
    };
  }
  
  /**
   * Calculate semantic distance between ideas
   * Simplified version - in production would use embeddings
   */
  calculateSemanticDistance(original: string, evolved: string): number {
    const originalWords = new Set(original.toLowerCase().split(/\s+/));
    const evolvedWords = new Set(evolved.toLowerCase().split(/\s+/));
    
    // Calculate Jaccard distance
    const intersection = new Set([...originalWords].filter(x => evolvedWords.has(x)));
    const union = new Set([...originalWords, ...evolvedWords]);
    
    const similarity = intersection.size / union.size;
    return 1 - similarity; // Distance is inverse of similarity
  }
  
  /**
   * Detect cliché patterns in evolution
   */
  detectClichePatterns(idea: string): string[] {
    const cliches = [
      { pattern: /ai.?powered/i, message: 'Overused "AI-powered" concept' },
      { pattern: /blockchain/i, message: 'Generic blockchain application' },
      { pattern: /uber.?for/i, message: 'Tired "Uber for X" model' },
      { pattern: /disrupt/i, message: 'Clichéd disruption narrative' },
      { pattern: /revolutionary/i, message: 'Overused revolutionary claim' },
      { pattern: /game.?changer/i, message: 'Generic game-changer phrase' },
      { pattern: /synergy/i, message: 'Corporate buzzword detected' },
      { pattern: /leverage/i, message: 'Overused leverage terminology' }
    ];
    
    const detected: string[] = [];
    
    for (const cliche of cliches) {
      if (cliche.pattern.test(idea)) {
        detected.push(cliche.message);
      }
    }
    
    return detected;
  }
  
  /**
   * Suggest amplification strategies
   */
  suggestAmplification(currentMadness: number, targetMadness: number): string[] {
    const suggestions: string[] = [];
    const gap = targetMadness - currentMadness;
    
    if (gap >= 3) {
      suggestions.push(
        'Apply reality-bending transformation',
        'Introduce paradoxical elements',
        'Add recursive self-modification'
      );
    } else if (gap >= 2) {
      suggestions.push(
        'Inject consciousness or awareness',
        'Create impossible combinations',
        'Apply quantum logic'
      );
    } else if (gap >= 1) {
      suggestions.push(
        'Scale up dramatically',
        'Add unexpected domain fusion',
        'Introduce time paradoxes'
      );
    }
    
    return suggestions;
  }
  
  /**
   * Validate evolution coherence
   */
  validateEvolutionCoherence(original: string, evolved: string): boolean {
    // Check if core problem is still addressed
    const originalKeywords = this.extractKeywords(original);
    const evolvedKeywords = this.extractKeywords(evolved);
    
    // At least 20% of original keywords should remain
    const retained = originalKeywords.filter(k => evolvedKeywords.includes(k));
    const retentionRate = retained.length / originalKeywords.length;
    
    return retentionRate >= 0.2;
  }
  
  /**
   * Extract keywords (simplified)
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'as', 'are', 'was', 'were', 'to', 'for', 'of', 'in', 'by', 'with']);
    
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word));
  }
  
  /**
   * Generate evolution metrics
   */
  getEvolutionMetrics(): EvolutionMetrics {
    const lastStep = this.evolutionChain[this.evolutionChain.length - 1];
    
    if (!lastStep) {
      return {
        semanticDistance: 0,
        coherenceScore: 1,
        noveltyScore: 0,
        practicalityScore: 1,
        madnessIndex: 1
      };
    }
    
    // Calculate average semantic distance
    const avgDistance = this.evolutionChain.reduce((sum, step) => 
      sum + (step.semanticDistance || 0), 0
    ) / this.evolutionChain.length;
    
    // Coherence based on validation
    const coherenceScore = this.validateEvolutionCoherence(
      this.originalIdea,
      lastStep.idea
    ) ? 0.8 : 0.3;
    
    // Novelty based on distance and madness
    const noveltyScore = Math.min(1, (avgDistance + lastStep.madnessIndex / 10) / 2);
    
    // Practicality inversely related to madness
    const practicalityScore = Math.max(0, 1 - (lastStep.madnessIndex / 10) * 0.7);
    
    return {
      semanticDistance: avgDistance,
      coherenceScore,
      noveltyScore,
      practicalityScore,
      madnessIndex: lastStep.madnessIndex
    };
  }
  
  /**
   * Generate branch points for alternative evolutions
   */
  generateBranchPoint(stage: number): string[] {
    const currentStep = this.evolutionChain.find(s => s.stage === stage);
    if (!currentStep) return [];
    
    const alternatives = [
      `What if we took the opposite approach to ${currentStep.pattern}?`,
      `What if we combined this with ${currentStep.injectedDomain} instead?`,
      `What if we amplified the madness exponentially here?`,
      `What if we grounded this in practical reality?`,
      `What if we went meta and evolved the evolution process?`
    ];
    
    return alternatives.slice(0, 3);
  }
  
  /**
   * Export tracker data
   */
  exportData(): object {
    return {
      sessionId: this.sessionId,
      originalIdea: this.originalIdea,
      evolutionChain: this.evolutionChain,
      branches: Array.from(this.branches.entries()),
      totalMadnessProgression: this.totalMadnessProgression,
      metrics: this.getEvolutionMetrics()
    };
  }
}