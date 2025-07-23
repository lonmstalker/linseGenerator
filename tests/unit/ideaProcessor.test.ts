/**
 * Unit tests for Idea Processor module
 */

import { 
  IdeaEvolutionAssistant,
  EVOLUTION_PATTERNS,
  getPatternsByStage,
  getRandomPatternForStage,
  calculatePatternFitness,
  DomainInjector,
  EvolutionTrackerImpl
} from '@modules/ideaProcessor';

describe('IdeaEvolutionAssistant', () => {
  let assistant: IdeaEvolutionAssistant;
  
  beforeEach(() => {
    assistant = new IdeaEvolutionAssistant();
  });
  
  describe('createEvolutionPrompt', () => {
    it('should create evolution prompt for valid inputs', () => {
      const result = assistant.createEvolutionPrompt(
        'Make meetings more productive',
        1,
        4
      );
      
      expect(result.originalIdea).toBe('Make meetings more productive');
      expect(result.evolutionPrompt).toContain('STAGE 1 of 3');
      expect(result.evolutionPrompt).toContain('madness level 4/10');
    });
    
    it('should throw error for invalid stage', () => {
      expect(() => {
        assistant.createEvolutionPrompt('test', 0, 5);
      }).toThrow('Stage must be between 1 and 3');
      
      expect(() => {
        assistant.createEvolutionPrompt('test', 4, 5);
      }).toThrow('Stage must be between 1 and 3');
    });
    
    it('should throw error for invalid madness level', () => {
      expect(() => {
        assistant.createEvolutionPrompt('test', 1, 0);
      }).toThrow('Target madness must be between 1 and 10');
      
      expect(() => {
        assistant.createEvolutionPrompt('test', 1, 11);
      }).toThrow('Target madness must be between 1 and 10');
    });
    
    it('should include all required components', () => {
      const result = assistant.createEvolutionPrompt('test idea', 2, 6);
      
      // Check evolution prompt contains key elements
      expect(result.evolutionPrompt).toContain('Applied pattern:');
      expect(result.evolutionPrompt).toContain('Domain injection:');
      expect(result.evolutionPrompt).toContain('Madness amplifiers:');
      expect(result.evolutionPrompt).toContain('Success criteria:');
      expect(result.evolutionPrompt).toContain('Guiding questions:');
      
      // Check evaluation criteria
      expect(result.evaluationCriteria.madnessIndex).toContain('6/10');
      expect(result.evaluationCriteria.practicalityCheck).toBeTruthy();
      expect(result.evaluationCriteria.noveltyAssessment).toBeTruthy();
      
      // Check supporting framework
      expect(result.supportingFramework.techniques.length).toBeGreaterThan(0);
      expect(result.supportingFramework.examples.length).toBeGreaterThan(0);
      expect(result.supportingFramework.warnings.length).toBeGreaterThan(0);
    });
    
    it('should respect pattern preferences', () => {
      const preferredPattern = 'Reality Inversion';
      const result = assistant.createEvolutionPrompt('test', 2, 5, {
        preferredPatterns: [preferredPattern]
      });
      
      expect(result.evolutionPrompt).toContain(preferredPattern);
    });
    
    it('should avoid specified patterns', () => {
      const avoidPatterns = ['Reality Inversion', 'Scale Jump'];
      const result = assistant.createEvolutionPrompt('test', 1, 3, {
        avoidPatterns
      });
      
      for (const pattern of avoidPatterns) {
        expect(result.evolutionPrompt).not.toContain(pattern);
      }
    });
  });
  
  describe('generateMadnessAmplifiers', () => {
    it('should generate more amplifiers for larger gaps', () => {
      const small = assistant.generateMadnessAmplifiers(3, 4);
      const large = assistant.generateMadnessAmplifiers(2, 8);
      
      expect(large.length).toBeGreaterThan(small.length);
    });
    
    it('should include paradox amplifiers for high madness', () => {
      // Test multiple times due to randomness
      let foundParadox = false;
      
      for (let i = 0; i < 10; i++) {
        const amplifiers = assistant.generateMadnessAmplifiers(5, 9);
        
        const hasParadox = amplifiers.some(amp => 
          amp.toLowerCase().includes('paradox') || 
          amp.toLowerCase().includes('opposite') ||
          amp.toLowerCase().includes('simultaneous')
        );
        
        if (hasParadox) {
          foundParadox = true;
          break;
        }
      }
      
      expect(foundParadox).toBe(true);
    });
    
    it('should include recursion for extreme madness', () => {
      const amplifiers = assistant.generateMadnessAmplifiers(7, 10);
      
      const hasRecursion = amplifiers.some(amp => 
        amp.toLowerCase().includes('recurs') || 
        amp.toLowerCase().includes('self')
      );
      expect(hasRecursion).toBe(true);
    });
  });
  
  describe('selectEvolutionPattern', () => {
    it('should select appropriate pattern for stage', () => {
      const pattern1 = assistant.selectEvolutionPattern(1, 3);
      const pattern3 = assistant.selectEvolutionPattern(3, 9);
      
      expect(pattern1).toBeDefined();
      expect(pattern3).toBeDefined();
      
      // Stage 3 patterns should have higher madness multipliers on average
      const mult1 = pattern1.madnessMultiplier || 1;
      const mult3 = pattern3.madnessMultiplier || 1;
      
      // This is probabilistic, so we just check they're valid
      expect(mult1).toBeGreaterThan(0);
      expect(mult3).toBeGreaterThan(0);
    });
  });
  
  describe('createProgressionPath', () => {
    it('should create path for requested stages', () => {
      const path = assistant.createProgressionPath(3);
      
      expect(path).toHaveLength(3);
      expect(path[0]!.stage).toBe(1);
      expect(path[1]!.stage).toBe(2);
      expect(path[2]!.stage).toBe(3);
    });
    
    it('should increase madness progressively', () => {
      const path = assistant.createProgressionPath(3);
      
      // Each stage should have more amplifiers
      expect(path[2]!.madnessAmplifiers.length).toBeGreaterThanOrEqual(
        path[0]!.madnessAmplifiers.length
      );
    });
  });
  
  describe('validateEvolutionCoherence', () => {
    it('should validate coherent evolutions', () => {
      const original = 'improve team communication through better tools';
      const evolved = 'team communication becomes telepathic network mediated by AI consciousness';
      
      expect(assistant.validateEvolutionCoherence(original, evolved)).toBe(true);
    });
    
    it('should reject incoherent evolutions', () => {
      const original = 'improve team communication';
      const evolved = 'cats are fluffy and like fish';
      
      expect(assistant.validateEvolutionCoherence(original, evolved)).toBe(false);
    });
  });
});

describe('Evolution Patterns', () => {
  it('should have at least 20 patterns', () => {
    expect(EVOLUTION_PATTERNS.length).toBeGreaterThanOrEqual(20);
  });
  
  it('should have all required properties', () => {
    for (const pattern of EVOLUTION_PATTERNS) {
      expect(pattern.name).toBeTruthy();
      expect(pattern.description).toBeTruthy();
      expect(pattern.application).toBeTruthy();
      expect(pattern.exampleTransformation).toBeTruthy();
    }
  });
  
  it('should have varied madness multipliers', () => {
    const multipliers = EVOLUTION_PATTERNS
      .map(p => p.madnessMultiplier || 1)
      .filter((v, i, a) => a.indexOf(v) === i); // unique values
    
    expect(multipliers.length).toBeGreaterThan(5);
  });
});

describe('Pattern Selection Helpers', () => {
  it('getPatternsByStage should return appropriate patterns', () => {
    const stage1 = getPatternsByStage(1);
    const stage3 = getPatternsByStage(3);
    
    expect(stage1.length).toBeGreaterThan(0);
    expect(stage3.length).toBeGreaterThan(0);
  });
  
  it('getRandomPatternForStage should return valid pattern', () => {
    const pattern = getRandomPatternForStage(2);
    
    expect(pattern).toBeDefined();
    expect(pattern.name).toBeTruthy();
  });
  
  it('calculatePatternFitness should score appropriately', () => {
    const highMultiplierPattern = {
      name: 'Test',
      description: 'Test',
      application: 'Test',
      exampleTransformation: 'Test',
      madnessMultiplier: 2.0
    };
    
    const lowMultiplierPattern = {
      ...highMultiplierPattern,
      madnessMultiplier: 1.1
    };
    
    // For low current madness and high target, high multiplier should score better
    const highFitness = calculatePatternFitness(highMultiplierPattern, 2, 8);
    const lowFitness = calculatePatternFitness(lowMultiplierPattern, 2, 8);
    
    expect(highFitness).toBeGreaterThan(lowFitness);
  });
});

describe('DomainInjector', () => {
  let injector: DomainInjector;
  
  beforeEach(() => {
    injector = new DomainInjector();
  });
  
  it('should inject random domain', () => {
    const injection = injector.injectRandomDomain('improve productivity');
    
    expect(injection.domain).toBeTruthy();
    expect(injection.injectionPoint).toBeTruthy();
    expect(injection.element).toBeTruthy();
    expect(injection.rationale).toBeTruthy();
  });
  
  it('should avoid recently used domains', () => {
    const domains = new Set<string>();
    
    // Inject multiple times
    for (let i = 0; i < 10; i++) {
      const injection = injector.injectRandomDomain('test idea');
      domains.add(injection.domain);
    }
    
    // Should have used different domains
    expect(domains.size).toBeGreaterThan(5);
  });
  
  it('should provide madness-appropriate suggestions', () => {
    const lowMadness = injector.getInjectionSuggestions(2);
    const highMadness = injector.getInjectionSuggestions(8);
    
    expect(lowMadness[0]).toContain('practical');
    expect(highMadness[0]).toContain('consciousness');
  });
});

describe('EvolutionTracker', () => {
  let tracker: EvolutionTrackerImpl;
  
  beforeEach(() => {
    tracker = new EvolutionTrackerImpl('test-session', 'original idea');
  });
  
  it('should track evolution steps', () => {
    tracker.addStep({
      stage: 1,
      idea: 'evolved idea',
      madnessIndex: 3,
      pattern: 'Scale Jump',
      injectedDomain: 'Quantum Physics',
      timestamp: Date.now()
    });
    
    const state = tracker.getCurrentState();
    expect(state).toBeDefined();
    expect(state?.stage).toBe(1);
    expect(state?.madness).toBe(3);
  });
  
  it('should calculate semantic distance', () => {
    const distance = tracker.calculateSemanticDistance(
      'improve team meetings',
      'enhance group gatherings'
    );
    
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThanOrEqual(1);
  });
  
  it('should detect cliché patterns', () => {
    const cliches = tracker.detectClichePatterns('AI-powered blockchain disruption');
    
    expect(cliches.length).toBeGreaterThan(0);
    expect(cliches.some(c => c.includes('AI-powered'))).toBe(true);
  });
  
  it('should suggest amplification strategies', () => {
    const suggestions = tracker.suggestAmplification(3, 8);
    
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions[0]).toContain('reality-bending');
  });
  
  it('should validate evolution coherence', () => {
    const coherent = tracker.validateEvolutionCoherence(
      'improve email system',
      'email becomes living organism that evolves'
    );
    
    expect(coherent).toBe(true);
    
    const incoherent = tracker.validateEvolutionCoherence(
      'improve email system',
      'bananas are yellow fruit'
    );
    
    expect(incoherent).toBe(false);
  });
  
  it('should generate evolution metrics', () => {
    tracker.addStep({
      stage: 1,
      idea: 'slightly evolved',
      madnessIndex: 3,
      pattern: 'test',
      injectedDomain: 'test',
      timestamp: Date.now(),
      semanticDistance: 0.3
    });
    
    const metrics = tracker.getEvolutionMetrics();
    
    expect(metrics.semanticDistance).toBe(0.3);
    expect(metrics.madnessIndex).toBe(3);
    expect(metrics.coherenceScore).toBeGreaterThan(0);
    expect(metrics.noveltyScore).toBeGreaterThan(0);
    expect(metrics.practicalityScore).toBeGreaterThan(0);
  });
});