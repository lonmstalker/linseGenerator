/**
 * Idea Evolution Assistant
 * Main class for evolving ideas through progressive transformation
 */

import { 
  IdeaEvolutionResult,
  EvolutionPromptKit,
  EvolutionPattern,
  EvolutionContext,
  EvolutionOptions,
  AmplifierType
} from './types';
import { 
  EVOLUTION_PATTERNS, 
  getRandomPatternForStage,
  calculatePatternFitness
} from './patterns';
import { DomainInjector } from './domainInjector';
import { EvolutionTrackerImpl } from './evolutionTracker';

export class IdeaEvolutionAssistant {
  private evolutionPatterns: Map<string, EvolutionPattern>;
  private domainInjector: DomainInjector;
  private trackers: Map<string, EvolutionTrackerImpl> = new Map();
  
  constructor() {
    // Initialize pattern map
    this.evolutionPatterns = new Map();
    for (const pattern of EVOLUTION_PATTERNS) {
      this.evolutionPatterns.set(pattern.name, pattern);
    }
    
    this.domainInjector = new DomainInjector();
  }
  
  /**
   * Create evolution prompt for an idea
   */
  createEvolutionPrompt(
    idea: string, 
    stage: number, 
    targetMadness: number,
    options?: EvolutionOptions
  ): IdeaEvolutionResult {
    // Validate inputs
    if (stage < 1 || stage > 3) {
      throw new Error('Stage must be between 1 and 3');
    }
    if (targetMadness < 1 || targetMadness > 10) {
      throw new Error('Target madness must be between 1 and 10');
    }
    
    // Select evolution pattern
    const pattern = this.selectEvolutionPattern(stage, targetMadness, options);
    
    // Inject random domain
    const injection = this.domainInjector.injectRandomDomain(idea);
    
    // Generate madness amplifiers
    const currentMadness = this.estimateCurrentMadness(stage);
    const amplifiers = this.generateMadnessAmplifiers(currentMadness, targetMadness);
    
    // Create evolution context
    const context: EvolutionContext = {
      idea,
      stage,
      targetMadness,
      pattern,
      injectedDomain: injection.domain,
      domainElement: injection.element,
      madnessAmplifiers: amplifiers,
      guidingQuestions: this.createGuidingQuestions(stage, pattern, injection.domain)
    };
    
    // Generate the prompt
    const evolutionPrompt = this.generateEvolutionPrompt(context);
    
    // Create evaluation criteria
    const evaluationCriteria = {
      madnessIndex: `Target: ${targetMadness}/10 - Current estimate: ${currentMadness}/10`,
      practicalityCheck: stage < 3 
        ? 'Should maintain some connection to real-world feasibility'
        : 'Practicality optional - embrace the impossible',
      noveltyAssessment: 'Must introduce elements not present in original idea'
    };
    
    // Create supporting framework
    const supportingFramework = {
      techniques: this.getTechniquesForStage(stage),
      examples: this.getExampleTransformations(pattern, stage),
      warnings: this.getWarningsForMadnessLevel(targetMadness)
    };
    
    return {
      originalIdea: idea,
      evolutionPrompt,
      evaluationCriteria,
      supportingFramework
    };
  }
  
  /**
   * Generate madness amplifiers based on levels
   */
  generateMadnessAmplifiers(currentLevel: number, targetLevel: number): string[] {
    const amplifiers: string[] = [];
    const gap = targetLevel - currentLevel;
    
    // Base amplifiers by type
    if (gap >= 1) {
      amplifiers.push(this.getAmplifierByType(AmplifierType.SCALE));
    }
    if (gap >= 2) {
      amplifiers.push(this.getAmplifierByType(AmplifierType.ABSTRACTION));
    }
    if (gap >= 3) {
      amplifiers.push(this.getAmplifierByType(AmplifierType.INVERSION));
    }
    if (targetLevel >= 7) {
      amplifiers.push(this.getAmplifierByType(AmplifierType.PARADOX));
    }
    if (targetLevel >= 9) {
      amplifiers.push(this.getAmplifierByType(AmplifierType.RECURSION));
    }
    
    return amplifiers;
  }
  
  /**
   * Select appropriate evolution pattern
   */
  selectEvolutionPattern(
    stage: number, 
    targetMadness: number,
    options?: EvolutionOptions
  ): EvolutionPattern {
    // Filter out avoided patterns
    let availablePatterns = Array.from(this.evolutionPatterns.values());
    if (options?.avoidPatterns) {
      availablePatterns = availablePatterns.filter(p => 
        !options.avoidPatterns!.includes(p.name)
      );
    }
    
    // If preferred patterns specified, prioritize them
    if (options?.preferredPatterns && options.preferredPatterns.length > 0) {
      const preferred = availablePatterns.filter(p => 
        options.preferredPatterns!.includes(p.name)
      );
      if (preferred.length > 0) {
        return preferred[Math.floor(Math.random() * preferred.length)]!;
      }
    }
    
    // Calculate fitness for each pattern
    const currentMadness = this.estimateCurrentMadness(stage);
    const patternFitness = availablePatterns.map(pattern => ({
      pattern,
      fitness: calculatePatternFitness(pattern, currentMadness, targetMadness)
    }));
    
    // Sort by fitness and select from top candidates
    patternFitness.sort((a, b) => b.fitness - a.fitness);
    const topCandidates = patternFitness.slice(0, 5);
    
    // Random selection from top candidates
    const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    return selected?.pattern || getRandomPatternForStage(stage);
  }
  
  /**
   * Create progression path for multiple stages
   */
  createProgressionPath(totalStages: number): EvolutionPromptKit[] {
    const path: EvolutionPromptKit[] = [];
    
    for (let stage = 1; stage <= totalStages; stage++) {
      const targetMadness = Math.min(10, stage * 3 + 1); // Progressive madness
      
      const kit: EvolutionPromptKit = {
        stage,
        directions: this.getStageDirections(stage),
        crossDomainInjections: this.getCrossDomainSuggestions(stage),
        madnessAmplifiers: this.generateMadnessAmplifiers(stage * 2, targetMadness),
        constraintQuestions: this.getConstraintQuestions(stage)
      };
      
      path.push(kit);
    }
    
    return path;
  }
  
  /**
   * Validate coherence between original and evolved
   */
  validateEvolutionCoherence(original: string, evolved: string): boolean {
    // Use tracker's implementation
    const tracker = new EvolutionTrackerImpl('temp', original);
    return tracker.validateEvolutionCoherence(original, evolved);
  }
  
  /**
   * Generate the evolution prompt
   */
  private generateEvolutionPrompt(context: EvolutionContext): string {
    const feasibilityNote = context.stage < 3 ? 'preferred' : 'optional';
    
    return `=== IDEA EVOLUTION: STAGE ${context.stage} of 3 ===

Original idea: "${context.idea}"

🎯 Goal: Evolve idea to madness level ${context.targetMadness}/10

Applied pattern: ${context.pattern.name}
Technique: ${context.pattern.application}

🧬 Domain injection: ${context.injectedDomain}
Add element: ${context.domainElement}

📈 Madness amplifiers:
${context.madnessAmplifiers.map(amp => `• ${amp}`).join('\n')}

✅ Success criteria:
• Deviation from original: 30-50%
• Problem connection: mandatory
• Surprise factor: high
• Theoretical feasibility: ${feasibilityNote}

💭 Guiding questions:
${context.guidingQuestions.map(q => `• ${q}`).join('\n')}

Example transformation using this pattern:
${context.pattern.exampleTransformation}

Now evolve the idea by:
1. Applying the ${context.pattern.name} pattern
2. Injecting ${context.domainElement} from ${context.injectedDomain}
3. Amplifying madness using the listed amplifiers
4. Ensuring the evolution addresses the guiding questions

Present your evolved idea with a brief explanation of the transformation logic.`;
  }
  
  /**
   * Estimate current madness level
   */
  private estimateCurrentMadness(stage: number): number {
    // Simple progression: stages 1, 2, 3 map to madness 2, 5, 8
    return Math.min(10, stage * 2.5 + 0.5);
  }
  
  /**
   * Get amplifier by type
   */
  private getAmplifierByType(type: AmplifierType): string {
    const amplifiers: Record<AmplifierType, string[]> = {
      [AmplifierType.SCALE]: [
        'Scale up to planetary level',
        'Shrink to quantum scale',
        'Expand across dimensions'
      ],
      [AmplifierType.ABSTRACTION]: [
        'Abstract into pure mathematics',
        'Elevate to philosophical principle',
        'Reduce to information patterns'
      ],
      [AmplifierType.COMBINATION]: [
        'Merge with opposite concept',
        'Fuse incompatible elements',
        'Create hybrid impossibility'
      ],
      [AmplifierType.INVERSION]: [
        'Reverse all assumptions',
        'Flip inside becomes outside',
        'Make weakness the strength'
      ],
      [AmplifierType.RECURSION]: [
        'Solution creates itself',
        'Infinite self-improvement loop',
        'Fractal self-similarity'
      ],
      [AmplifierType.PARADOX]: [
        'Simultaneous opposites',
        'Effect precedes cause',
        'Part contains the whole'
      ]
    };
    
    const options = amplifiers[type];
    return options[Math.floor(Math.random() * options.length)]!;
  }
  
  /**
   * Create guiding questions
   */
  private createGuidingQuestions(
    stage: number, 
    pattern: EvolutionPattern, 
    domain: string
  ): string[] {
    const questions = [
      `How does ${pattern.name} transform the core problem?`,
      `What emerges when ${domain} logic takes over?`,
      `Where does this evolution surprise even you?`
    ];
    
    if (stage === 1) {
      questions.push('What practical seeds remain in this wild idea?');
    } else if (stage === 2) {
      questions.push('How do contradictions become features?');
    } else {
      questions.push('What new reality does this necessitate?');
    }
    
    return questions;
  }
  
  /**
   * Get techniques for stage
   */
  private getTechniquesForStage(stage: number): string[] {
    const techniques: Record<number, string[]> = {
      1: [
        'Metaphorical substitution',
        'Scale transformation',
        'Domain translation'
      ],
      2: [
        'Paradoxical synthesis',
        'Reality bending',
        'Consciousness injection'
      ],
      3: [
        'Recursive transformation',
        'Dimensional transcendence',
        'Narrative causality override'
      ]
    };
    
    return techniques[stage] || techniques[1]!;
  }
  
  /**
   * Get example transformations
   */
  private getExampleTransformations(pattern: EvolutionPattern, stage: number): string[] {
    return [
      pattern.exampleTransformation,
      `Stage ${stage} example: ${this.getStageSpecificExample(stage)}`,
      'Remember: The wilder the better, but maintain conceptual thread'
    ];
  }
  
  /**
   * Get stage-specific example
   */
  private getStageSpecificExample(stage: number): string {
    const examples = {
      1: 'Email system → Living coral reef of messages that grow and interact',
      2: 'Calendar app → Time-traveling consciousness that negotiates with past/future selves',
      3: 'Search engine → Reality compiler that debugs existence itself'
    };
    
    return examples[stage as keyof typeof examples] || examples[1];
  }
  
  /**
   * Get warnings for madness level
   */
  private getWarningsForMadnessLevel(level: number): string[] {
    const warnings: string[] = [];
    
    if (level >= 8) {
      warnings.push('Extreme abstraction may lose all practical meaning');
    }
    if (level >= 6) {
      warnings.push('Ensure core problem connection remains visible');
    }
    if (level >= 4) {
      warnings.push('Balance creativity with comprehensibility');
    }
    
    warnings.push('Avoid clichéd tech buzzwords even at high madness');
    
    return warnings;
  }
  
  /**
   * Get stage directions
   */
  private getStageDirections(stage: number): string[] {
    const directions: Record<number, string[]> = {
      1: [
        'Introduce first transformation',
        'Maintain recognizable elements',
        'Plant seeds of madness'
      ],
      2: [
        'Amplify transformation dramatically',
        'Merge incompatible concepts',
        'Question fundamental assumptions'
      ],
      3: [
        'Transcend original constraints',
        'Embrace full impossibility',
        'Redefine reality itself'
      ]
    };
    
    return directions[stage] || directions[1]!;
  }
  
  /**
   * Get cross-domain suggestions
   */
  private getCrossDomainSuggestions(stage: number): string[] {
    return [
      'Biology + Technology fusion',
      'Physics + Consciousness merger',
      'Art + Mathematics synthesis',
      'Philosophy + Engineering hybrid'
    ].slice(0, stage + 1);
  }
  
  /**
   * Get constraint questions
   */
  private getConstraintQuestions(stage: number): string[] {
    return [
      'What if there were no physical laws?',
      'What if time flowed differently here?',
      'What if consciousness was the building material?',
      'What if logic itself was negotiable?'
    ].slice(0, stage + 1);
  }
  
  /**
   * Start tracking evolution
   */
  startEvolutionTracking(sessionId: string, originalIdea: string): EvolutionTrackerImpl {
    const tracker = new EvolutionTrackerImpl(sessionId, originalIdea);
    this.trackers.set(sessionId, tracker);
    return tracker;
  }
  
  /**
   * Get evolution tracker
   */
  getTracker(sessionId: string): EvolutionTrackerImpl | undefined {
    return this.trackers.get(sessionId);
  }
}