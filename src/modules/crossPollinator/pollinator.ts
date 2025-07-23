/**
 * Cross-Pollinator
 * Main class for synthesizing hybrid ideas from two concepts
 */

import {
  CrossPollinationResult,
  FusionMethod,
  HybridFramework,
  CrossPollinationContext,
  ExampleHybrid,
  CrossPollinationOptions,
  HybridConcept
} from './types';
import { 
  FUSION_METHODS, 
  COMBINATION_PATTERNS,
  METHOD_WARNINGS,
  getEmergentPropertySuggestions,
  findBestMethodForTypes
} from './methods';
import { SynergyDetector } from './synergyDetector';
import { findSimilarExamples, getExamplesForMethod } from './examples';

export class CrossPollinator {
  private fusionMethods: Map<string, FusionMethod>;
  private synergyDetector: SynergyDetector;
  
  constructor() {
    // Initialize fusion methods map
    this.fusionMethods = new Map();
    for (const method of FUSION_METHODS) {
      this.fusionMethods.set(method.name, method);
    }
    
    this.synergyDetector = new SynergyDetector();
  }
  
  /**
   * Create hybrid framework for two ideas
   */
  createHybridFramework(
    ideaA: string, 
    ideaB: string, 
    methodName?: string,
    options?: CrossPollinationOptions
  ): CrossPollinationResult {
    // Select fusion method
    const method = methodName 
      ? this.fusionMethods.get(methodName) || this.selectOptimalFusionMethod(ideaA, ideaB, options)
      : this.selectOptimalFusionMethod(ideaA, ideaB, options);
    
    // Generate combination patterns
    const combinationPatterns = this.generateCombinationPatterns(method);
    
    // Create emergent property checklist
    const emergentChecklist = this.createEmergentPropertyChecklist([
      this.extractIdeaType(ideaA),
      this.extractIdeaType(ideaB)
    ], method.name);
    
    // Get warning flags
    const warningFlags = METHOD_WARNINGS[method.name] || [];
    
    // Find relevant examples
    const exampleHybrids = this.findExampleHybrids(method.name, ideaA, ideaB);
    
    // Create context
    const context: CrossPollinationContext = {
      ideaA,
      ideaB,
      method,
      combinationPatterns,
      emergentChecklist,
      warningFlags,
      exampleHybrids
    };
    
    // Build hybrid framework
    const framework: HybridFramework = {
      method: method.name as any,
      synthesisGuide: this.createSynthesisGuide(method),
      combinationPatterns,
      emergentChecklist,
      warningFlags
    };
    
    // Generate guiding prompt
    const guidingPrompt = this.buildGuidingPrompt(context);
    
    // Create evaluation criteria
    const evaluationCriteria = {
      synergyScore: 'Measure how well elements amplify each other (0-10)',
      noveltyCheck: 'Ensure hybrid creates something neither component could alone',
      coherenceTest: 'Verify the synthesis makes logical and practical sense'
    };
    
    return {
      framework,
      guidingPrompt,
      exampleHybrids,
      evaluationCriteria
    };
  }
  
  /**
   * Select optimal fusion method for two ideas
   */
  selectOptimalFusionMethod(
    ideaA: string, 
    ideaB: string,
    options?: CrossPollinationOptions
  ): FusionMethod {
    if (options?.preferredMethod) {
      const preferred = this.fusionMethods.get(options.preferredMethod);
      if (preferred) return preferred;
    }
    
    // Analyze idea types
    const typeA = this.extractIdeaType(ideaA);
    const typeB = this.extractIdeaType(ideaB);
    
    // Find best method for types
    const bestMethod = findBestMethodForTypes(typeA, typeB);
    if (bestMethod) return bestMethod;
    
    // Score all methods
    const scores = Array.from(this.fusionMethods.values()).map(method => ({
      method,
      score: this.scoreMethodFitness(method, ideaA, ideaB, options)
    }));
    
    // Sort by score and return best
    scores.sort((a, b) => b.score - a.score);
    return scores[0]?.method || FUSION_METHODS[0]!;
  }
  
  /**
   * Generate combination patterns for method
   */
  generateCombinationPatterns(method: FusionMethod): string[] {
    const basePatterns = COMBINATION_PATTERNS[method.name] || [];
    
    // Add method-specific variations
    const variations = this.createPatternVariations(method);
    
    return [...basePatterns, ...variations].slice(0, 5);
  }
  
  /**
   * Create emergent property checklist
   */
  createEmergentPropertyChecklist(ideaTypes: string[], methodName: string): string[] {
    const baseChecklist = getEmergentPropertySuggestions(methodName);
    
    // Add type-specific emergent properties
    const typeSpecific: string[] = [];
    
    for (const type of ideaTypes) {
      if (type.includes('system')) {
        typeSpecific.push('System-level behaviors not in components');
      }
      if (type.includes('process')) {
        typeSpecific.push('New process flows from combination');
      }
      if (type.includes('tool')) {
        typeSpecific.push('Unexpected tool capabilities');
      }
      if (type.includes('concept')) {
        typeSpecific.push('Philosophical insights from merger');
      }
    }
    
    return [...baseChecklist, ...typeSpecific].slice(0, 6);
  }
  
  /**
   * Build guiding prompt for cross-pollination
   */
  buildGuidingPrompt(context: CrossPollinationContext): string {
    const { ideaA, ideaB, method, combinationPatterns, emergentChecklist, warningFlags, exampleHybrids } = context;
    
    return `=== CROSS-POLLINATION OF IDEAS ===

Idea A: "${ideaA}"
Idea B: "${ideaB}"

🔄 Synthesis method: ${method.name}
${method.description}

📋 Hybrid creation process:
${method.process.map((step, i) => `${i + 1}. ${step}`).join('\n')}

🎯 Combination patterns for this method:
${combinationPatterns.map(p => `• ${p}`).join('\n')}

✨ Emergent properties checklist - look for:
${emergentChecklist.map(item => `□ ${item}`).join('\n')}

📊 Successful hybrid example:
${method.example}

💡 Additional examples from similar domains:
${exampleHybrids.map(ex => 
  `• ${ex.sourceA} + ${ex.sourceB} = ${ex.result}
  Emergent: ${ex.emergentProperty}`
).join('\n\n')}

⚠️ Avoid:
${warningFlags.map(w => `• ${w}`).join('\n')}

🎨 Create 3 hybrid variants, where each:
1. Takes different elements from each source
2. Uses a different combination pattern
3. Reveals unique emergent properties
4. Becomes progressively more innovative

For each hybrid specify:
- Which specific elements come from Idea A
- Which specific elements come from Idea B  
- How they synthesize using the ${method.name} method
- What emergent properties arise
- Why this hybrid is uniquely valuable

Make each variant more radical than the last!`;
  }
  
  /**
   * Find relevant example hybrids
   */
  findExampleHybrids(methodName: string, ideaA: string, ideaB: string): ExampleHybrid[] {
    // Get method examples
    const methodExamples = getExamplesForMethod(methodName);
    
    // Find similar examples based on content
    const similar = findSimilarExamples(ideaA, ideaB, methodName);
    
    // Combine and deduplicate
    const combined = [...similar];
    
    for (const example of methodExamples) {
      if (!combined.some(e => e.result === example.result)) {
        combined.push(example);
      }
    }
    
    return combined.slice(0, 4);
  }
  
  /**
   * Extract idea type for method selection
   */
  private extractIdeaType(idea: string): string {
    const lower = idea.toLowerCase();
    
    if (lower.includes('conflict') || lower.includes('paradox') || lower.includes('versus')) return 'conflict';
    if (lower.includes('system') || lower.includes('platform')) return 'system';
    if (lower.includes('process') || lower.includes('workflow')) return 'process';
    if (lower.includes('tool') || lower.includes('app')) return 'tool';
    if (lower.includes('concept') || lower.includes('philosophy')) return 'concept';
    if (lower.includes('organization') || lower.includes('structure')) return 'organization';
    
    return 'general';
  }
  
  /**
   * Score method fitness for ideas
   */
  private scoreMethodFitness(
    method: FusionMethod, 
    ideaA: string, 
    ideaB: string,
    options?: CrossPollinationOptions
  ): number {
    let score = 0;
    
    // Check if method suits idea types
    const typeA = this.extractIdeaType(ideaA);
    const typeB = this.extractIdeaType(ideaB);
    
    if (method.bestFor.includes(typeA) || method.bestFor.includes(typeB)) {
      score += 0.3;
    }
    
    // Check complexity match
    if (options?.targetComplexity) {
      if (method.complexity === options.targetComplexity) {
        score += 0.2;
      }
    }
    
    // Check emergence preference
    if (options?.emphasizeEmergence && method.emergenceLevel === 'high') {
      score += 0.2;
    }
    
    // Detect potential synergies
    const synergies = this.synergyDetector.detectPotentialSynergies(ideaA, ideaB);
    score += Math.min(synergies.length * 0.1, 0.3);
    
    return score;
  }
  
  /**
   * Create synthesis guide for method
   */
  private createSynthesisGuide(method: FusionMethod): string {
    const guides: Record<string, string> = {
      structural: 'Build hybrid architecture by interweaving load-bearing elements',
      functional: 'Merge capabilities to create amplified functionality',
      conceptual: 'Blend abstract essences into new philosophical framework',
      dialectical: 'Resolve contradictions through transcendent synthesis',
      quantum: 'Create superposition allowing simultaneous existence',
      biomimetic: 'Develop symbiotic relationship with mutual benefits',
      temporal: 'Bridge time dimensions for trans-temporal solution'
    };
    
    return guides[method.name] || 'Synthesize elements into cohesive hybrid';
  }
  
  /**
   * Create pattern variations
   */
  private createPatternVariations(method: FusionMethod): string[] {
    const variations: string[] = [];
    
    switch (method.name) {
      case 'structural':
        variations.push(
          'Modular hybrid: Swappable components from both',
          'Layered hybrid: A as foundation, B as superstructure'
        );
        break;
      case 'functional':
        variations.push(
          'Synergistic functions: 1+1=3 effect',
          'Complementary functions: A enables B enables A'
        );
        break;
      case 'quantum':
        variations.push(
          'Observer-dependent manifestation',
          'Probability-weighted characteristics'
        );
        break;
    }
    
    return variations;
  }
  
  /**
   * Evaluate a proposed hybrid
   */
  evaluateHybrid(hybrid: HybridConcept): {
    synergyScore: number;
    viabilityScore: number;
    innovationScore: number;
    overallScore: number;
  } {
    const synergyScore = this.synergyDetector.calculateSynergyScore(hybrid);
    
    // Simple viability scoring
    const viabilityScore = hybrid.synthesis.length > 50 ? 0.7 : 0.5;
    
    // Innovation based on emergent properties
    const innovationScore = Math.min(hybrid.emergentProperties.length * 0.2, 1);
    
    const overallScore = (synergyScore + viabilityScore + innovationScore) / 3;
    
    return {
      synergyScore,
      viabilityScore,
      innovationScore,
      overallScore
    };
  }
}