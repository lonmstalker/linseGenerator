/**
 * Synergy Detector
 * Identifies potential synergies and emergent properties in hybrid ideas
 */

import { 
  ISynergyDetector, 
  SynergyPoint, 
  HybridConcept,
  IdeaAnalysis 
} from './types';

export class SynergyDetector implements ISynergyDetector {
  /**
   * Detect potential synergies between two ideas
   */
  detectPotentialSynergies(ideaA: string, ideaB: string): SynergyPoint[] {
    const synergies: SynergyPoint[] = [];
    
    // Analyze both ideas
    const analysisA = this.analyzeIdea(ideaA);
    const analysisB = this.analyzeIdea(ideaB);
    
    // Find complementary elements
    for (const componentA of analysisA.keyComponents) {
      for (const componentB of analysisB.keyComponents) {
        const synergy = this.evaluateSynergy(componentA, componentB, analysisA, analysisB);
        if (synergy) {
          synergies.push(synergy);
        }
      }
    }
    
    // Find principle-based synergies
    for (const principleA of analysisA.underlyingPrinciples) {
      for (const principleB of analysisB.underlyingPrinciples) {
        const synergy = this.evaluatePrincipleSynergy(principleA, principleB);
        if (synergy) {
          synergies.push(synergy);
        }
      }
    }
    
    // Sort by strength
    synergies.sort((a, b) => b.strength - a.strength);
    
    return synergies;
  }
  
  /**
   * Calculate synergy score for a hybrid concept
   */
  calculateSynergyScore(hybrid: HybridConcept): number {
    let score = 0;
    
    // Base score from component balance
    const componentBalance = Math.min(
      hybrid.components.fromA.length,
      hybrid.components.fromB.length
    ) / Math.max(
      hybrid.components.fromA.length,
      hybrid.components.fromB.length
    );
    score += componentBalance * 0.3;
    
    // Score from emergent properties
    const emergenceScore = Math.min(hybrid.emergentProperties.length / 3, 1) * 0.4;
    score += emergenceScore;
    
    // Score from unique value
    const uniqueValueScore = this.assessUniqueValue(hybrid.uniqueValue) * 0.3;
    score += uniqueValueScore;
    
    return Math.min(score, 1);
  }
  
  /**
   * Identify emergent properties from component combination
   */
  identifyEmergentProperties(components: string[], combination: string): string[] {
    const emergentProperties: string[] = [];
    
    // Check for amplification patterns
    if (this.hasAmplificationPattern(components, combination)) {
      emergentProperties.push('Mutual amplification of core capabilities');
    }
    
    // Check for new capability emergence
    if (this.hasNewCapabilityPattern(components, combination)) {
      emergentProperties.push('Novel capability not present in either component');
    }
    
    // Check for transcendent properties
    if (this.hasTranscendentPattern(components, combination)) {
      emergentProperties.push('Transcendent property beyond sum of parts');
    }
    
    // Check for adaptive properties
    if (this.hasAdaptivePattern(components, combination)) {
      emergentProperties.push('Self-adaptive behavior emerging from interaction');
    }
    
    // Check for systemic properties
    if (this.hasSystemicPattern(components, combination)) {
      emergentProperties.push('System-level behavior from component interaction');
    }
    
    return emergentProperties;
  }
  
  /**
   * Find unexpected interactions between elements
   */
  findUnexpectedInteractions(elementA: string, elementB: string): string[] {
    const interactions: string[] = [];
    
    // Opposite attracts pattern
    if (this.areOpposites(elementA, elementB)) {
      interactions.push(`Paradoxical harmony between opposing ${elementA} and ${elementB}`);
    }
    
    // Cascade effect pattern
    if (this.hasCascadePotential(elementA, elementB)) {
      interactions.push(`Cascade effect: ${elementA} triggers exponential ${elementB}`);
    }
    
    // Resonance pattern
    if (this.hasResonancePotential(elementA, elementB)) {
      interactions.push(`Resonance amplification between ${elementA} and ${elementB}`);
    }
    
    // Transformation pattern
    if (this.hasTransformationPotential(elementA, elementB)) {
      interactions.push(`${elementA} transforms nature of ${elementB}`);
    }
    
    return interactions;
  }
  
  /**
   * Analyze idea into components
   */
  private analyzeIdea(idea: string): IdeaAnalysis {
    // Simplified analysis - in production would use NLP
    const words = idea.toLowerCase().split(/\s+/);
    
    return {
      coreFunction: this.extractCoreFunction(idea),
      keyComponents: this.extractKeyComponents(words),
      underlyingPrinciples: this.extractPrinciples(words),
      constraints: this.extractConstraints(words),
      opportunities: this.extractOpportunities(words)
    };
  }
  
  /**
   * Extract core function from idea
   */
  private extractCoreFunction(idea: string): string {
    // Simple heuristic
    if (idea.includes('improve')) return 'improvement';
    if (idea.includes('create')) return 'creation';
    if (idea.includes('solve')) return 'solution';
    if (idea.includes('connect')) return 'connection';
    if (idea.includes('transform')) return 'transformation';
    return 'innovation';
  }
  
  /**
   * Extract key components
   */
  private extractKeyComponents(words: string[]): string[] {
    const components: string[] = [];
    
    // Look for nouns and key concepts
    const keyWords = ['system', 'process', 'user', 'data', 'interface', 
                      'network', 'platform', 'service', 'tool', 'framework'];
    
    for (const word of words) {
      if (keyWords.some(key => word.includes(key))) {
        components.push(word);
      }
    }
    
    // Add some inferred components
    if (words.includes('communication')) components.push('messaging');
    if (words.includes('collaboration')) components.push('teamwork');
    if (words.includes('automation')) components.push('efficiency');
    
    return [...new Set(components)];
  }
  
  /**
   * Extract underlying principles
   */
  private extractPrinciples(words: string[]): string[] {
    const principles: string[] = [];
    
    const principleMap: Record<string, string> = {
      'transparent': 'transparency',
      'secure': 'security',
      'efficient': 'efficiency',
      'scalable': 'scalability',
      'flexible': 'flexibility',
      'simple': 'simplicity',
      'robust': 'robustness',
      'innovative': 'innovation'
    };
    
    for (const word of words) {
      for (const [key, principle] of Object.entries(principleMap)) {
        if (word.includes(key)) {
          principles.push(principle);
        }
      }
    }
    
    return [...new Set(principles)];
  }
  
  /**
   * Extract constraints
   */
  private extractConstraints(words: string[]): string[] {
    const constraints: string[] = [];
    
    if (words.includes('limited')) constraints.push('resource limitations');
    if (words.includes('secure')) constraints.push('security requirements');
    if (words.includes('fast')) constraints.push('performance requirements');
    if (words.includes('reliable')) constraints.push('reliability requirements');
    
    return constraints;
  }
  
  /**
   * Extract opportunities
   */
  private extractOpportunities(words: string[]): string[] {
    const opportunities: string[] = [];
    
    if (words.includes('new')) opportunities.push('innovation potential');
    if (words.includes('improve')) opportunities.push('enhancement opportunity');
    if (words.includes('transform')) opportunities.push('transformation potential');
    if (words.includes('connect')) opportunities.push('integration opportunity');
    
    return opportunities;
  }
  
  /**
   * Evaluate synergy between components
   */
  private evaluateSynergy(
    componentA: string, 
    componentB: string,
    _analysisA: IdeaAnalysis,
    _analysisB: IdeaAnalysis
  ): SynergyPoint | null {
    // Check for complementary functions
    if (this.areComplementary(componentA, componentB)) {
      return {
        elementA: componentA,
        elementB: componentB,
        interactionType: 'complementary',
        potentialEmergence: `Enhanced ${componentA}-${componentB} integration`,
        strength: 0.7
      };
    }
    
    // Check for amplification potential
    if (this.canAmplify(componentA, componentB)) {
      return {
        elementA: componentA,
        elementB: componentB,
        interactionType: 'amplification',
        potentialEmergence: `Exponential ${componentA} through ${componentB}`,
        strength: 0.8
      };
    }
    
    return null;
  }
  
  /**
   * Evaluate principle synergy
   */
  private evaluatePrincipleSynergy(principleA: string, principleB: string): SynergyPoint | null {
    const synergyMap: Record<string, Record<string, string>> = {
      'transparency': {
        'security': 'Secure transparency',
        'efficiency': 'Efficient openness',
        'innovation': 'Open innovation'
      },
      'efficiency': {
        'scalability': 'Efficient scaling',
        'simplicity': 'Elegant efficiency',
        'flexibility': 'Adaptive efficiency'
      },
      'security': {
        'flexibility': 'Secure adaptability',
        'simplicity': 'Simple security',
        'innovation': 'Innovative protection'
      }
    };
    
    const emergence = synergyMap[principleA]?.[principleB] || 
                     synergyMap[principleB]?.[principleA];
    
    if (emergence) {
      return {
        elementA: principleA,
        elementB: principleB,
        interactionType: 'principle fusion',
        potentialEmergence: emergence,
        strength: 0.6
      };
    }
    
    return null;
  }
  
  /**
   * Check if components are complementary
   */
  private areComplementary(a: string, b: string): boolean {
    const complementaryPairs = [
      ['data', 'interface'],
      ['user', 'system'],
      ['process', 'automation'],
      ['network', 'security'],
      ['platform', 'service']
    ];
    
    return complementaryPairs.some(pair => 
      (pair.includes(a) && pair.includes(b)) ||
      (a.includes(pair[0]!) && b.includes(pair[1]!)) ||
      (a.includes(pair[1]!) && b.includes(pair[0]!))
    );
  }
  
  /**
   * Check if components can amplify each other
   */
  private canAmplify(a: string, b: string): boolean {
    const amplifyingPairs = [
      ['network', 'effect'],
      ['data', 'intelligence'],
      ['automation', 'efficiency'],
      ['collaboration', 'innovation']
    ];
    
    return amplifyingPairs.some(pair => 
      a.includes(pair[0]!) && b.includes(pair[1]!)
    );
  }
  
  /**
   * Pattern detection methods
   */
  private hasAmplificationPattern(components: string[], combination: string): boolean {
    return components.some(c => combination.includes(`enhanced ${c}`) || 
                               combination.includes(`amplified ${c}`));
  }
  
  private hasNewCapabilityPattern(components: string[], combination: string): boolean {
    const combinationWords = combination.toLowerCase().split(/\s+/);
    const componentWords = components.join(' ').toLowerCase().split(/\s+/);
    
    // Look for words in combination not in components
    return combinationWords.some(word => 
      word.length > 4 && !componentWords.includes(word)
    );
  }
  
  private hasTranscendentPattern(_components: string[], combination: string): boolean {
    const transcendentKeywords = ['beyond', 'transcend', 'emerge', 'transform'];
    return transcendentKeywords.some(keyword => combination.includes(keyword));
  }
  
  private hasAdaptivePattern(_components: string[], combination: string): boolean {
    const adaptiveKeywords = ['adapt', 'evolve', 'learn', 'grow', 'respond'];
    return adaptiveKeywords.some(keyword => combination.includes(keyword));
  }
  
  private hasSystemicPattern(_components: string[], combination: string): boolean {
    const systemicKeywords = ['system', 'ecosystem', 'network', 'holistic'];
    return systemicKeywords.some(keyword => combination.includes(keyword));
  }
  
  /**
   * Relationship checks
   */
  private areOpposites(a: string, b: string): boolean {
    const opposites = [
      ['centralized', 'decentralized'],
      ['simple', 'complex'],
      ['private', 'public'],
      ['individual', 'collective']
    ];
    
    return opposites.some(pair => 
      (a.includes(pair[0]!) && b.includes(pair[1]!)) ||
      (a.includes(pair[1]!) && b.includes(pair[0]!))
    );
  }
  
  private hasCascadePotential(a: string, b: string): boolean {
    return (a.includes('trigger') || a.includes('initiate')) && 
           (b.includes('effect') || b.includes('reaction'));
  }
  
  private hasResonancePotential(a: string, b: string): boolean {
    return (a.includes('frequency') || a.includes('pattern')) && 
           (b.includes('resonate') || b.includes('align'));
  }
  
  private hasTransformationPotential(a: string, b: string): boolean {
    return (a.includes('catalyst') || a.includes('transform')) && 
           (b.includes('state') || b.includes('nature'));
  }
  
  /**
   * Assess unique value of hybrid
   */
  private assessUniqueValue(value: string): number {
    if (!value) return 0;
    
    // Simple scoring based on value description
    let score = 0.5; // Base score
    
    if (value.includes('never before')) score += 0.2;
    if (value.includes('revolutionary')) score += 0.15;
    if (value.includes('paradigm')) score += 0.15;
    if (value.includes('breakthrough')) score += 0.1;
    
    return Math.min(score, 1);
  }
}