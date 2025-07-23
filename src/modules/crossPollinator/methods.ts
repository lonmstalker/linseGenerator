/**
 * Fusion methods library for cross-pollination
 * Contains various methods for synthesizing ideas
 */

import { FusionMethod } from './types';

export const FUSION_METHODS: FusionMethod[] = [
  // ARCHITECTURAL METHODS
  {
    name: 'structural',
    description: 'Combine architectural elements of both ideas',
    bestFor: ['systems', 'processes', 'organizations', 'frameworks'],
    process: [
      'Extract structural components of each idea',
      'Identify load-bearing elements',
      'Find compatibility points and interfaces',
      'Create hybrid architecture with bridges',
      'Reinforce connection points'
    ],
    example: 'Company hierarchy + Neural network = Adaptive organizational structure with learning pathways',
    complexity: 'moderate',
    emergenceLevel: 'medium'
  },
  
  {
    name: 'functional',
    description: 'Merge functional capabilities into unified solution',
    bestFor: ['products', 'services', 'tools', 'applications'],
    process: [
      'Map core functions of each idea',
      'Identify complementary capabilities',
      'Find synergistic combinations',
      'Create integrated feature set',
      'Resolve functional conflicts'
    ],
    example: 'Camera + AI therapist = Emotional mirror analyzing facial expressions for self-therapy',
    complexity: 'simple',
    emergenceLevel: 'medium'
  },
  
  // CONCEPTUAL METHODS
  {
    name: 'conceptual',
    description: 'Blend abstract concepts at philosophical level',
    bestFor: ['theories', 'philosophies', 'abstract ideas', 'principles'],
    process: [
      'Distill core concepts from each idea',
      'Find conceptual bridges',
      'Create unified theory',
      'Develop new vocabulary',
      'Test conceptual coherence'
    ],
    example: 'Minimalism + Abundance = Selective abundance focusing on quality over quantity',
    complexity: 'complex',
    emergenceLevel: 'high'
  },
  
  {
    name: 'dialectical',
    description: 'Synthesize through resolving contradictions',
    bestFor: ['conflicts', 'paradoxes', 'dilemmas', 'opposing views'],
    process: [
      'Identify core contradictions',
      'Find the thesis and antithesis',
      'Seek higher abstraction level',
      'Create synthesis resolving conflict',
      'Verify dialectical integrity'
    ],
    example: 'Privacy + Transparency = Selective transparency with granular user control',
    complexity: 'complex',
    emergenceLevel: 'high'
  },
  
  // QUANTUM METHODS
  {
    name: 'quantum',
    description: 'Create superposition where both exist simultaneously',
    bestFor: ['paradoxes', 'multidimensional solutions', 'adaptive systems'],
    process: [
      'Define quantum states for each idea',
      'Create superposition conditions',
      'Design observation/collapse mechanism',
      'Build state transition logic',
      'Add entanglement effects'
    ],
    example: 'Centralization + Decentralization = Quantum governance collapsing based on context',
    complexity: 'complex',
    emergenceLevel: 'high'
  },
  
  // BIOLOGICAL METHODS
  {
    name: 'biomimetic',
    description: 'Fuse ideas using biological symbiosis patterns',
    bestFor: ['ecosystems', 'organic systems', 'living solutions'],
    process: [
      'Identify symbiotic potential',
      'Define mutual benefits',
      'Create co-evolution mechanism',
      'Build nutrient exchange',
      'Enable adaptive growth'
    ],
    example: 'Social media + Mental health = Symbiotic platform that grows healthier with use',
    complexity: 'moderate',
    emergenceLevel: 'high'
  },
  
  // TEMPORAL METHODS
  {
    name: 'temporal',
    description: 'Merge ideas across time dimensions',
    bestFor: ['processes', 'lifecycles', 'evolutionary systems'],
    process: [
      'Map temporal aspects of each idea',
      'Find time-based intersections',
      'Create temporal fusion points',
      'Design phase transitions',
      'Build time-aware synthesis'
    ],
    example: 'Past traditions + Future tech = Time-bridging solutions honoring heritage while innovating',
    complexity: 'moderate',
    emergenceLevel: 'medium'
  }
];

/**
 * Get methods by complexity level
 */
export function getMethodsByComplexity(complexity: 'simple' | 'moderate' | 'complex'): FusionMethod[] {
  return FUSION_METHODS.filter(method => method.complexity === complexity);
}

/**
 * Get methods by emergence level
 */
export function getMethodsByEmergence(level: 'low' | 'medium' | 'high'): FusionMethod[] {
  return FUSION_METHODS.filter(method => method.emergenceLevel === level);
}

/**
 * Find best method for idea types
 */
export function findBestMethodForTypes(typeA: string, typeB: string): FusionMethod | null {
  // Simple heuristic matching
  const types = [typeA.toLowerCase(), typeB.toLowerCase()];
  
  for (const method of FUSION_METHODS) {
    const matches = method.bestFor.filter(best => {
      const bestLower = best.toLowerCase();
      return types.some(type => {
        // Handle singular/plural forms
        const typeSingular = type.replace(/s$/, '');
        const bestSingular = bestLower.replace(/s$/, '');
        return type.includes(bestSingular) || bestLower.includes(typeSingular) ||
               typeSingular === bestSingular;
      });
    });
    
    if (matches.length >= 1) {
      return method;
    }
  }
  
  // Default to structural if no match
  return FUSION_METHODS[0] || null;
}

/**
 * Combination patterns by method
 */
export const COMBINATION_PATTERNS: Record<string, string[]> = {
  structural: [
    'Nested architecture: A contains B\'s structure',
    'Parallel architecture: A and B side by side',
    'Interwoven architecture: A and B threads alternate',
    'Hierarchical fusion: A at macro, B at micro level',
    'Fractal architecture: Pattern repeats at all scales'
  ],
  functional: [
    'Sequential functions: A then B in workflow',
    'Parallel functions: A and B simultaneously',
    'Conditional functions: A or B based on context',
    'Amplified functions: A enhances B\'s output',
    'Reciprocal functions: A and B enhance each other'
  ],
  conceptual: [
    'Conceptual blending: New concept from both',
    'Conceptual nesting: One concept contains other',
    'Conceptual bridging: Third concept connects both',
    'Conceptual synthesis: Higher order emergence',
    'Conceptual metamorphosis: A transforms into B'
  ],
  dialectical: [
    'Thesis-antithesis resolution',
    'Dynamic balance maintenance',
    'Oscillating equilibrium',
    'Transcendent synthesis',
    'Paradox embracement'
  ],
  quantum: [
    'State superposition until observed',
    'Entangled properties affecting both',
    'Probability collapse on interaction',
    'Wave-particle duality expression',
    'Quantum tunneling between states'
  ],
  biomimetic: [
    'Mutualistic symbiosis pattern',
    'Parasitic integration (positive)',
    'Commensalistic coexistence',
    'Co-evolutionary adaptation',
    'Ecosystem emergence'
  ],
  temporal: [
    'Past-future bridge creation',
    'Cyclical time fusion',
    'Parallel timeline merge',
    'Temporal phase shifting',
    'Chronological synthesis'
  ]
};

/**
 * Warning flags by method
 */
export const METHOD_WARNINGS: Record<string, string[]> = {
  structural: [
    'Avoid forcing incompatible structures',
    'Maintain structural integrity of both',
    'Don\'t create unnecessary complexity'
  ],
  functional: [
    'Prevent feature creep',
    'Avoid functional conflicts',
    'Maintain clear purpose'
  ],
  conceptual: [
    'Don\'t lose concrete applicability',
    'Avoid over-abstraction',
    'Keep conceptual clarity'
  ],
  dialectical: [
    'Ensure genuine synthesis, not compromise',
    'Avoid false dichotomies',
    'Maintain logical coherence'
  ],
  quantum: [
    'Don\'t abuse quantum metaphors',
    'Ensure practical collapse conditions',
    'Avoid unnecessary complexity'
  ],
  biomimetic: [
    'Respect natural patterns',
    'Avoid forced biological analogies',
    'Ensure sustainable growth'
  ],
  temporal: [
    'Maintain temporal coherence',
    'Avoid anachronistic combinations',
    'Respect causality where needed'
  ]
};

/**
 * Get emergent property suggestions
 */
export function getEmergentPropertySuggestions(method: string): string[] {
  const suggestions: Record<string, string[]> = {
    structural: [
      'New organizational capabilities',
      'Emergent information flows',
      'Self-organizing properties',
      'Adaptive resilience'
    ],
    functional: [
      'Unexpected use cases',
      'Synergistic capabilities',
      'Amplified effectiveness',
      'Novel interaction modes'
    ],
    conceptual: [
      'New theoretical frameworks',
      'Paradigm shifts',
      'Philosophical breakthroughs',
      'Conceptual innovations'
    ],
    dialectical: [
      'Resolution of long-standing conflicts',
      'New equilibrium states',
      'Transcendent properties',
      'Paradox resolution'
    ],
    quantum: [
      'Context-aware adaptation',
      'Superposition benefits',
      'Entanglement effects',
      'Observer-dependent features'
    ],
    biomimetic: [
      'Self-healing properties',
      'Evolutionary adaptation',
      'Ecosystem benefits',
      'Regenerative capabilities'
    ],
    temporal: [
      'Time-transcendent features',
      'Historical-future synthesis',
      'Temporal adaptability',
      'Chronological harmony'
    ]
  };
  
  return suggestions[method] || ['Unexpected emergent properties', 'Novel capabilities', 'Synergistic effects'];
}