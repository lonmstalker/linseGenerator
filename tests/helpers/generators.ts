/**
 * Test data generators
 */

export function generateTestSessionId(): string {
  return `test-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

export function generateTestProblem(category?: string): string {
  const problems = {
    business: [
      'How to increase customer retention in SaaS',
      'Improve team productivity in remote work',
      'Reduce operational costs without quality loss',
      'Scale startup operations efficiently',
      'Build sustainable competitive advantage'
    ],
    technology: [
      'Optimize database query performance',
      'Enhance mobile app user experience', 
      'Implement zero-downtime deployment',
      'Reduce technical debt in legacy system',
      'Improve API response times'
    ],
    social: [
      'Build community engagement online',
      'Increase volunteer participation',
      'Foster inclusive workplace culture',
      'Reduce social isolation in cities',
      'Improve education accessibility'
    ],
    creative: [
      'Design more engaging user interfaces',
      'Create memorable brand experiences',
      'Develop innovative product features',
      'Generate fresh content ideas',
      'Reimagine customer journey'
    ]
  };
  
  const categoryProblems = problems[category as keyof typeof problems] || 
    Object.values(problems).flat();
  
  return categoryProblems[Math.floor(Math.random() * categoryProblems.length)];
}

export function generateTestIdea(stage: number = 1): string {
  const ideas = [
    'Gamification with virtual rewards',
    'AI-powered personalization engine',
    'Blockchain-based trust system',
    'Quantum-inspired optimization',
    'Biomimetic design patterns',
    'Crowd-sourced innovation platform',
    'Neural network decision trees',
    'Augmented reality interfaces'
  ];
  
  const idea = ideas[Math.floor(Math.random() * ideas.length)];
  
  // Add stage-specific modifiers
  if (stage > 1) {
    const modifiers = [
      'enhanced with emotional AI',
      'integrated with IoT sensors',
      'powered by edge computing',
      'using swarm intelligence',
      'with self-healing capabilities'
    ];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];
    return `${idea} ${modifier}`;
  }
  
  return idea;
}

export function generateTestDomains(count: number = 5): string[] {
  const allDomains = [
    'quantum_physics', 'jazz_improvisation', 'mycology', 'origami',
    'beekeeping', 'archaeology', 'neuroscience', 'poetry',
    'martial_arts', 'astronomy', 'cooking', 'architecture',
    'music_theory', 'biology', 'psychology', 'philosophy',
    'mathematics', 'dance', 'engineering', 'medicine'
  ];
  
  const selected: string[] = [];
  const available = [...allDomains];
  
  for (let i = 0; i < count && available.length > 0; i++) {
    const index = Math.floor(Math.random() * available.length);
    selected.push(available[index]);
    available.splice(index, 1);
  }
  
  return selected;
}

export function generateTestMetaphor(domain: string): string {
  const metaphors = {
    quantum_physics: 'like quantum entanglement connecting distant particles',
    jazz_improvisation: 'like musicians jamming to create emergent harmony',
    mycology: 'like mycelial networks sharing resources underground',
    origami: 'like folding paper to reveal hidden dimensions',
    beekeeping: 'like a hive mind optimizing collective behavior',
    default: 'like discovering patterns in seemingly random events'
  };
  
  return metaphors[domain as keyof typeof metaphors] || metaphors.default;
}

export function generateTestSession(): any {
  return {
    id: `test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    problem: generateTestProblem(),
    domains: generateTestDomains(5),
    startTime: Date.now(),
    context: {
      generatedLenses: [],
      evolutionChains: [],
      hybridAttempts: [],
      evaluationResults: [],
      usedDomains: new Set<string>(),
      currentProblem: ''
    }
  };
}

export function generateMockLensResponse(problem: string): any {
  const domains = generateTestDomains(5);
  
  return {
    problem,
    prompts: {
      mainPrompt: `Generate 5 creative lenses for: "${problem}"`,
      guidingQuestions: [
        'What unexpected connections can you find?',
        'How would nature solve this?',
        'What if constraints were inverted?'
      ],
      constraints: [
        'Avoid obvious solutions',
        'Think cross-domain',
        'Challenge assumptions'
      ],
      exampleFormat: 'Domain: Metaphor | Question | Assumption'
    },
    metadata: {
      suggestedDomains: domains,
      avoidPatterns: ['simple reversal', 'just scale up', 'basic automation'],
      timestamp: Date.now()
    }
  };
}

export function generateMockEvolutionResponse(idea: string, stage: number): any {
  return {
    currentIdea: idea,
    evolutionStage: stage,
    framework: {
      techniques: [
        'Dimensional expansion',
        'Constraint inversion', 
        'Metaphorical bridging'
      ],
      questions: [
        `What if ${idea} had no physical limits?`,
        `How would aliens implement ${idea}?`,
        `What's the opposite that still achieves the goal?`
      ],
      wildCards: [
        'Add time travel',
        'Make it sentient',
        'Reverse all assumptions'
      ]
    },
    suggestedEvolutions: [
      `${idea} with quantum properties`,
      `${idea} as a living ecosystem`,
      `${idea} in reverse chronology`
    ]
  };
}