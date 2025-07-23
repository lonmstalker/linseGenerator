/**
 * Unit tests for Cross-Pollinator module
 */

import {
  CrossPollinator,
  FUSION_METHODS,
  getMethodsByComplexity,
  getMethodsByEmergence,
  findBestMethodForTypes,
  SynergyDetector,
  HYBRID_EXAMPLES,
  getExamplesForMethod,
  findSimilarExamples
} from '@modules/crossPollinator';

describe('CrossPollinator', () => {
  let pollinator: CrossPollinator;
  
  beforeEach(() => {
    pollinator = new CrossPollinator();
  });
  
  describe('createHybridFramework', () => {
    it('should create hybrid framework for two ideas', () => {
      const result = pollinator.createHybridFramework(
        'online education platform',
        'social networking'
      );
      
      expect(result.framework).toBeDefined();
      expect(result.guidingPrompt).toBeTruthy();
      expect(result.exampleHybrids).toBeDefined();
      expect(result.evaluationCriteria).toBeDefined();
    });
    
    it('should use specified method when provided', () => {
      const result = pollinator.createHybridFramework(
        'test idea A',
        'test idea B',
        'quantum'
      );
      
      expect(result.framework.method).toBe('quantum');
      expect(result.guidingPrompt).toContain('quantum');
    });
    
    it('should select appropriate method automatically', () => {
      const result = pollinator.createHybridFramework(
        'company organization',
        'neural network architecture'
      );
      
      // Should select structural method for these types
      expect(result.framework.method).toBe('structural');
    });
    
    it('should include all framework components', () => {
      const result = pollinator.createHybridFramework('idea A', 'idea B');
      
      expect(result.framework.synthesisGuide).toBeTruthy();
      expect(result.framework.combinationPatterns.length).toBeGreaterThan(0);
      expect(result.framework.emergentChecklist.length).toBeGreaterThan(0);
      expect(result.framework.warningFlags.length).toBeGreaterThan(0);
    });
    
    it('should generate comprehensive guiding prompt', () => {
      const result = pollinator.createHybridFramework(
        'email system',
        'meditation practice'
      );
      
      const prompt = result.guidingPrompt;
      expect(prompt).toContain('email system');
      expect(prompt).toContain('meditation practice');
      expect(prompt).toContain('Synthesis method:');
      expect(prompt).toContain('Hybrid creation process:');
      expect(prompt).toContain('Combination patterns');
      expect(prompt).toContain('Emergent properties');
      expect(prompt).toContain('Create 3 hybrid variants');
    });
  });
  
  describe('selectOptimalFusionMethod', () => {
    it('should select method based on idea types', () => {
      const method = pollinator.selectOptimalFusionMethod(
        'conflict between privacy and transparency',
        'paradox of choice'
      );
      
      expect(method.name).toBe('dialectical');
    });
    
    it('should respect preferred method option', () => {
      const method = pollinator.selectOptimalFusionMethod(
        'any idea',
        'another idea',
        { preferredMethod: 'biomimetic' }
      );
      
      expect(method.name).toBe('biomimetic');
    });
    
    it('should consider target complexity', () => {
      const method = pollinator.selectOptimalFusionMethod(
        'simple tool',
        'basic function',
        { targetComplexity: 'simple' }
      );
      
      expect(method.complexity).toBe('simple');
    });
  });
  
  describe('generateCombinationPatterns', () => {
    it('should generate patterns for each method', () => {
      for (const method of FUSION_METHODS) {
        const patterns = pollinator.generateCombinationPatterns(method);
        
        expect(patterns.length).toBeGreaterThan(0);
        expect(patterns.length).toBeLessThanOrEqual(5);
      }
    });
    
    it('should include method-specific patterns', () => {
      const structuralMethod = FUSION_METHODS.find(m => m.name === 'structural')!;
      const patterns = pollinator.generateCombinationPatterns(structuralMethod);
      
      const hasStructuralPattern = patterns.some(p => 
        p.toLowerCase().includes('architecture') || 
        p.toLowerCase().includes('structure')
      );
      
      expect(hasStructuralPattern).toBe(true);
    });
  });
  
  describe('createEmergentPropertyChecklist', () => {
    it('should create relevant emergent properties', () => {
      const checklist = pollinator.createEmergentPropertyChecklist(
        ['system', 'process'],
        'structural'
      );
      
      expect(checklist.length).toBeGreaterThan(0);
      
      const hasSystemProperty = checklist.some(item => 
        item.toLowerCase().includes('system')
      );
      expect(hasSystemProperty).toBe(true);
    });
    
    it('should limit checklist size', () => {
      const checklist = pollinator.createEmergentPropertyChecklist(
        ['system', 'process', 'tool', 'concept'],
        'functional'
      );
      
      expect(checklist.length).toBeLessThanOrEqual(6);
    });
  });
  
  describe('evaluateHybrid', () => {
    it('should evaluate hybrid concept', () => {
      const hybrid = {
        name: 'Test Hybrid',
        components: {
          fromA: ['element1', 'element2'],
          fromB: ['element3', 'element4']
        },
        synthesis: 'A comprehensive synthesis description that explains how elements combine',
        emergentProperties: [
          'New capability 1',
          'New capability 2',
          'New capability 3'
        ],
        uniqueValue: 'Revolutionary new approach'
      };
      
      const evaluation = pollinator.evaluateHybrid(hybrid);
      
      expect(evaluation.synergyScore).toBeGreaterThan(0);
      expect(evaluation.viabilityScore).toBeGreaterThan(0);
      expect(evaluation.innovationScore).toBeGreaterThan(0);
      expect(evaluation.overallScore).toBeGreaterThan(0);
      expect(evaluation.overallScore).toBeLessThanOrEqual(1);
    });
  });
});

describe('Fusion Methods', () => {
  it('should have all required fusion methods', () => {
    const methodNames = FUSION_METHODS.map(m => m.name);
    
    expect(methodNames).toContain('structural');
    expect(methodNames).toContain('functional');
    expect(methodNames).toContain('conceptual');
    expect(methodNames).toContain('dialectical');
    expect(methodNames).toContain('quantum');
    expect(methodNames).toContain('biomimetic');
    expect(methodNames).toContain('temporal');
  });
  
  it('should have complete method definitions', () => {
    for (const method of FUSION_METHODS) {
      expect(method.name).toBeTruthy();
      expect(method.description).toBeTruthy();
      expect(method.bestFor.length).toBeGreaterThan(0);
      expect(method.process.length).toBeGreaterThanOrEqual(4);
      expect(method.example).toBeTruthy();
      expect(method.complexity).toBeTruthy();
      expect(method.emergenceLevel).toBeTruthy();
    }
  });
});

describe('Method Selection Helpers', () => {
  it('getMethodsByComplexity should filter correctly', () => {
    const simple = getMethodsByComplexity('simple');
    const complex = getMethodsByComplexity('complex');
    
    expect(simple.every(m => m.complexity === 'simple')).toBe(true);
    expect(complex.every(m => m.complexity === 'complex')).toBe(true);
  });
  
  it('getMethodsByEmergence should filter correctly', () => {
    const high = getMethodsByEmergence('high');
    
    expect(high.every(m => m.emergenceLevel === 'high')).toBe(true);
    expect(high.length).toBeGreaterThan(0);
  });
  
  it('findBestMethodForTypes should match appropriate methods', () => {
    const systemMethod = findBestMethodForTypes('system', 'process');
    expect(systemMethod).toBeDefined();
    expect(systemMethod?.bestFor.some(b => 
      b === 'systems' || b === 'processes'
    )).toBe(true);
  });
});

describe('SynergyDetector', () => {
  let detector: SynergyDetector;
  
  beforeEach(() => {
    detector = new SynergyDetector();
  });
  
  it('should detect potential synergies', () => {
    const synergies = detector.detectPotentialSynergies(
      'data visualization platform',
      'machine learning system'
    );
    
    expect(Array.isArray(synergies)).toBe(true);
    
    if (synergies.length > 0) {
      const synergy = synergies[0]!;
      expect(synergy.elementA).toBeTruthy();
      expect(synergy.elementB).toBeTruthy();
      expect(synergy.interactionType).toBeTruthy();
      expect(synergy.potentialEmergence).toBeTruthy();
      expect(synergy.strength).toBeGreaterThan(0);
      expect(synergy.strength).toBeLessThanOrEqual(1);
    }
  });
  
  it('should calculate synergy score', () => {
    const hybrid = {
      name: 'Test',
      components: {
        fromA: ['component1', 'component2'],
        fromB: ['component3', 'component4']
      },
      synthesis: 'test synthesis',
      emergentProperties: ['property1', 'property2'],
      uniqueValue: 'unique test value'
    };
    
    const score = detector.calculateSynergyScore(hybrid);
    
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
  
  it('should identify emergent properties', () => {
    const properties = detector.identifyEmergentProperties(
      ['real-time data', 'predictive analytics'],
      'real-time predictive system with self-learning capabilities'
    );
    
    expect(Array.isArray(properties)).toBe(true);
    expect(properties.length).toBeGreaterThan(0);
  });
  
  it('should find unexpected interactions', () => {
    const interactions = detector.findUnexpectedInteractions(
      'centralized control',
      'decentralized network'
    );
    
    expect(Array.isArray(interactions)).toBe(true);
    
    // Should detect opposites
    if (interactions.length > 0) {
      expect(interactions[0]).toContain('opposing');
    }
  });
});

describe('Hybrid Examples', () => {
  it('should have examples for all methods', () => {
    for (const method of FUSION_METHODS) {
      const examples = HYBRID_EXAMPLES[method.name];
      
      expect(examples).toBeDefined();
      expect(examples.length).toBeGreaterThanOrEqual(5);
    }
  });
  
  it('should have complete example structure', () => {
    for (const [method, examples] of Object.entries(HYBRID_EXAMPLES)) {
      for (const example of examples) {
        expect(example.sourceA).toBeTruthy();
        expect(example.sourceB).toBeTruthy();
        expect(example.result).toBeTruthy();
        expect(example.emergentProperty).toBeTruthy();
      }
    }
  });
  
  it('getExamplesForMethod should return relevant examples', () => {
    const quantumExamples = getExamplesForMethod('quantum');
    
    expect(quantumExamples.length).toBeGreaterThan(0);
    expect(quantumExamples[0]?.result).toContain('multiple states simultaneously');
  });
  
  it('findSimilarExamples should find relevant matches', () => {
    const similar = findSimilarExamples(
      'blockchain technology',
      'voting system',
      'structural'
    );
    
    expect(similar.length).toBeGreaterThan(0);
    
    // Should find blockchain + democracy example
    const hasBlockchainExample = similar.some(ex => 
      ex.sourceA.includes('Blockchain') || ex.sourceB.includes('Blockchain')
    );
    expect(hasBlockchainExample).toBe(true);
  });
});