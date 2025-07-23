/**
 * Evolution patterns library for idea transformation
 * Contains 20+ patterns for progressively evolving ideas
 */

import { EvolutionPattern } from './types';

export const EVOLUTION_PATTERNS: EvolutionPattern[] = [
  // FUNDAMENTAL TRANSFORMATIONS
  {
    name: 'Reality Inversion',
    description: 'Flip fundamental property of problem',
    application: 'If X always Y, imagine world where X always not-Y',
    exampleTransformation: 'Gravity attracts → Gravity repels selectively based on consciousness',
    bestForStage: 2,
    madnessMultiplier: 1.5
  },
  
  {
    name: 'Scale Jump',
    description: 'Change scale 1000x either direction',
    application: 'Make micro-problem global or vice versa',
    exampleTransformation: 'Personal productivity → Civilization-wide productivity synchronization',
    bestForStage: 1,
    madnessMultiplier: 1.3
  },
  
  {
    name: 'Temporal Paradox',
    description: 'Swap cause and effect',
    application: 'What if result creates initial problem?',
    exampleTransformation: 'Learning gives knowledge → Knowledge retroactively creates need for learning',
    bestForStage: 3,
    madnessMultiplier: 1.8
  },
  
  // MATERIAL TRANSFORMATIONS
  {
    name: 'Metaphor Materialization',
    description: 'Make abstract concepts physically real',
    application: 'Turn metaphorical descriptions into literal reality',
    exampleTransformation: 'Time is money → Time literally becomes tradeable currency',
    bestForStage: 2,
    madnessMultiplier: 1.6
  },
  
  {
    name: 'Phase Transition',
    description: 'Change state of matter/being',
    application: 'Solid becomes liquid, digital becomes organic',
    exampleTransformation: 'Software bugs → Living organisms that evolve',
    bestForStage: 2,
    madnessMultiplier: 1.4
  },
  
  {
    name: 'Dimensional Shift',
    description: 'Add or remove dimensions',
    application: 'Make 2D into 4D, or collapse 3D to 1D',
    exampleTransformation: 'Linear process → Multidimensional probability cloud',
    bestForStage: 3,
    madnessMultiplier: 1.7
  },
  
  // BIOLOGICAL TRANSFORMATIONS
  {
    name: 'Biological Mimicry',
    description: 'Apply biological processes to non-biological systems',
    application: 'Make it grow, evolve, reproduce like living things',
    exampleTransformation: 'Database → Self-healing, evolving information organism',
    bestForStage: 1,
    madnessMultiplier: 1.2
  },
  
  {
    name: 'Symbiotic Fusion',
    description: 'Merge separate entities into codependent organism',
    application: 'Create mutual dependency where none existed',
    exampleTransformation: 'User and app → Symbiotic consciousness hybrid',
    bestForStage: 2,
    madnessMultiplier: 1.5
  },
  
  {
    name: 'Viral Propagation',
    description: 'Add self-replicating properties',
    application: 'Make solution spread and mutate autonomously',
    exampleTransformation: 'Design pattern → Contagious meme that evolves',
    bestForStage: 1,
    madnessMultiplier: 1.3
  },
  
  // QUANTUM/PHYSICS TRANSFORMATIONS
  {
    name: 'Quantum Superposition',
    description: 'Exist in multiple states simultaneously',
    application: 'All possibilities true until observed',
    exampleTransformation: 'Decision tree → All branches execute simultaneously',
    bestForStage: 3,
    madnessMultiplier: 1.9
  },
  
  {
    name: 'Entropy Reversal',
    description: 'Make disorder create order',
    application: 'Chaos becomes organizing principle',
    exampleTransformation: 'Random errors → Pattern-generating force',
    bestForStage: 2,
    madnessMultiplier: 1.6
  },
  
  {
    name: 'Wave-Particle Duality',
    description: 'Be two contradictory things at once',
    application: 'Discrete and continuous simultaneously',
    exampleTransformation: 'Individual task → Wave of collective action',
    bestForStage: 3,
    madnessMultiplier: 1.7
  },
  
  // SOCIAL/PSYCHOLOGICAL TRANSFORMATIONS
  {
    name: 'Social Inversion',
    description: 'Reverse social dynamics',
    application: 'Leaders follow, teachers learn, etc.',
    exampleTransformation: 'Management hierarchy → Inverted pyramid of wisdom flow',
    bestForStage: 1,
    madnessMultiplier: 1.2
  },
  
  {
    name: 'Collective Consciousness',
    description: 'Individual becomes hive mind',
    application: 'Merge separate minds into unified entity',
    exampleTransformation: 'Team collaboration → Telepathic group organism',
    bestForStage: 2,
    madnessMultiplier: 1.5
  },
  
  {
    name: 'Emotional Alchemy',
    description: 'Transform emotions into physical resources',
    application: 'Convert feelings into tangible outputs',
    exampleTransformation: 'User frustration → Literal energy source',
    bestForStage: 2,
    madnessMultiplier: 1.6
  },
  
  // TECHNOLOGICAL TRANSFORMATIONS
  {
    name: 'Tech Regression as Progress',
    description: 'Advanced technology through primitive means',
    application: 'Solve future problems with past tools',
    exampleTransformation: 'AI problem → Solved by abacus consciousness',
    bestForStage: 2,
    madnessMultiplier: 1.4
  },
  
  {
    name: 'Analog-Digital Hybrid',
    description: 'Merge physical and digital impossibly',
    application: 'Digital concepts have mass, physical has code',
    exampleTransformation: 'Code comments → Physical sticky notes in cyberspace',
    bestForStage: 1,
    madnessMultiplier: 1.3
  },
  
  {
    name: 'Recursive Self-Improvement',
    description: 'Solution improves itself infinitely',
    application: 'Each iteration enhances the enhancement process',
    exampleTransformation: 'Bug fix → Self-evolving code doctor',
    bestForStage: 3,
    madnessMultiplier: 1.8
  },
  
  // CONCEPTUAL TRANSFORMATIONS
  {
    name: 'Paradoxical Simplification',
    description: 'Make it simpler by adding complexity',
    application: 'Solve by making MORE complicated in specific way',
    exampleTransformation: 'Streamline process → Add 17 dimensions that cancel out',
    bestForStage: 3,
    madnessMultiplier: 1.7
  },
  
  {
    name: 'Negative Space Solution',
    description: 'Answer is in what\'s NOT there',
    application: 'Define by absence rather than presence',
    exampleTransformation: 'Feature list → Intentional voids that create functionality',
    bestForStage: 2,
    madnessMultiplier: 1.5
  },
  
  {
    name: 'Time Loop Architecture',
    description: 'Effect precedes cause in closed loop',
    application: 'Future state creates past conditions',
    exampleTransformation: 'Project planning → Future success plans its own past',
    bestForStage: 3,
    madnessMultiplier: 1.9
  },
  
  {
    name: 'Fractal Recursion',
    description: 'Pattern repeats at every scale infinitely',
    application: 'Whole system in every component',
    exampleTransformation: 'Organization chart → Each person contains entire company',
    bestForStage: 2,
    madnessMultiplier: 1.6
  },
  
  // EXTREME TRANSFORMATIONS
  {
    name: 'Consciousness Injection',
    description: 'Give awareness to inanimate concepts',
    application: 'Problems become self-aware and solve themselves',
    exampleTransformation: 'Error messages → Sentient beings seeking purpose',
    bestForStage: 3,
    madnessMultiplier: 2.0
  },
  
  {
    name: 'Reality Compilation',
    description: 'Treat physical world as code',
    application: 'Debug reality, refactor physics',
    exampleTransformation: 'Traffic jam → Syntax error in spacetime',
    bestForStage: 3,
    madnessMultiplier: 2.1
  },
  
  {
    name: 'Narrative Causality',
    description: 'Story logic overrides physical laws',
    application: 'Things happen because story demands it',
    exampleTransformation: 'Project deadline → Dramatic tension that bends time',
    bestForStage: 3,
    madnessMultiplier: 1.8
  }
];

/**
 * Get patterns suitable for a specific stage
 */
export function getPatternsByStage(stage: number): EvolutionPattern[] {
  return EVOLUTION_PATTERNS.filter(pattern => 
    !pattern.bestForStage || pattern.bestForStage === stage
  );
}

/**
 * Get patterns by madness multiplier range
 */
export function getPatternsByMadnessRange(min: number, max: number): EvolutionPattern[] {
  return EVOLUTION_PATTERNS.filter(pattern => {
    const multiplier = pattern.madnessMultiplier || 1.0;
    return multiplier >= min && multiplier <= max;
  });
}

/**
 * Get a random pattern for a stage
 */
export function getRandomPatternForStage(stage: number): EvolutionPattern {
  const stagePatterns = getPatternsByStage(stage);
  const randomIndex = Math.floor(Math.random() * stagePatterns.length);
  return stagePatterns[randomIndex] || EVOLUTION_PATTERNS[0]!;
}

/**
 * Calculate pattern compatibility with target madness
 */
export function calculatePatternFitness(
  pattern: EvolutionPattern, 
  currentMadness: number, 
  targetMadness: number
): number {
  const multiplier = pattern.madnessMultiplier || 1.0;
  const projectedMadness = Math.min(10, currentMadness * multiplier);
  const distance = Math.abs(projectedMadness - targetMadness);
  
  // Fitness is inverse of distance (0-1 scale)
  return 1 - (distance / 10);
}