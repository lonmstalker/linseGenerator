/**
 * Custom assertions for testing
 */

export function expectValidLensStructure(lens: any): void {
  expect(lens).toBeDefined();
  expect(lens).toHaveProperty('metaphor');
  expect(lens).toHaveProperty('question');
  expect(lens).toHaveProperty('assumption');
  expect(lens).toHaveProperty('domain');
  
  // Validate content
  expect(typeof lens.metaphor).toBe('string');
  expect(lens.metaphor.length).toBeGreaterThan(20);
  expect(lens.metaphor).toMatch(/like|as if|similar to/i);
  
  expect(typeof lens.question).toBe('string');
  expect(lens.question.length).toBeGreaterThan(10);
  expect(lens.question).toMatch(/what if|how might|could we/i);
  
  expect(typeof lens.assumption).toBe('string');
  expect(lens.assumption.length).toBeGreaterThan(10);
  
  expect(typeof lens.domain).toBe('string');
  expect(lens.domain.length).toBeGreaterThan(3);
}

export function expectValidPromptStructure(result: any): void {
  expect(result).toBeDefined();
  expect(result).toHaveProperty('problem');
  expect(result).toHaveProperty('prompts');
  expect(result).toHaveProperty('metadata');
  
  // Validate prompts section
  expect(result.prompts).toHaveProperty('mainPrompt');
  expect(result.prompts).toHaveProperty('guidingQuestions');
  expect(result.prompts).toHaveProperty('constraints');
  expect(result.prompts).toHaveProperty('exampleFormat');
  
  expect(typeof result.prompts.mainPrompt).toBe('string');
  expect(result.prompts.mainPrompt.length).toBeGreaterThan(50);
  
  expect(Array.isArray(result.prompts.guidingQuestions)).toBe(true);
  expect(result.prompts.guidingQuestions.length).toBeGreaterThanOrEqual(3);
  
  expect(Array.isArray(result.prompts.constraints)).toBe(true);
  expect(result.prompts.constraints.length).toBeGreaterThanOrEqual(2);
  
  // Validate metadata
  expect(result.metadata).toHaveProperty('suggestedDomains');
  expect(result.metadata).toHaveProperty('avoidPatterns');
  expect(result.metadata).toHaveProperty('timestamp');
  
  expect(Array.isArray(result.metadata.suggestedDomains)).toBe(true);
  expect(result.metadata.suggestedDomains.length).toBe(5);
  
  expect(Array.isArray(result.metadata.avoidPatterns)).toBe(true);
  expect(typeof result.metadata.timestamp).toBe('number');
}

export function expectValidEvolutionStructure(result: any): void {
  expect(result).toBeDefined();
  expect(result).toHaveProperty('currentIdea');
  expect(result).toHaveProperty('evolutionStage');
  expect(result).toHaveProperty('framework');
  
  // Validate framework
  expect(result.framework).toHaveProperty('techniques');
  expect(result.framework).toHaveProperty('questions');
  expect(result.framework).toHaveProperty('wildCards');
  
  expect(Array.isArray(result.framework.techniques)).toBe(true);
  expect(result.framework.techniques.length).toBeGreaterThanOrEqual(3);
  
  expect(Array.isArray(result.framework.questions)).toBe(true);
  expect(result.framework.questions.length).toBeGreaterThanOrEqual(3);
  
  expect(Array.isArray(result.framework.wildCards)).toBe(true);
  expect(result.framework.wildCards.length).toBeGreaterThanOrEqual(2);
}

export function expectValidHybridStructure(result: any): void {
  expect(result).toBeDefined();
  expect(result).toHaveProperty('ideaA');
  expect(result).toHaveProperty('ideaB');
  expect(result).toHaveProperty('synthesisGuide');
  expect(result).toHaveProperty('hybridExamples');
  
  // Validate synthesis guide
  expect(result.synthesisGuide).toHaveProperty('method');
  expect(result.synthesisGuide).toHaveProperty('steps');
  expect(result.synthesisGuide).toHaveProperty('principles');
  
  expect(Array.isArray(result.synthesisGuide.steps)).toBe(true);
  expect(result.synthesisGuide.steps.length).toBeGreaterThanOrEqual(3);
  
  expect(Array.isArray(result.synthesisGuide.principles)).toBe(true);
  
  // Validate examples
  expect(Array.isArray(result.hybridExamples)).toBe(true);
  expect(result.hybridExamples.length).toBeGreaterThanOrEqual(3);
  
  result.hybridExamples.forEach((example: any) => {
    expect(example).toHaveProperty('name');
    expect(example).toHaveProperty('description');
    expect(example).toHaveProperty('synergy');
  });
}

export function expectValidSessionStructure(session: any): void {
  expect(session).toBeDefined();
  expect(session).toHaveProperty('id');
  expect(session).toHaveProperty('startTime');
  expect(session).toHaveProperty('lastActivity');
  expect(session).toHaveProperty('context');
  expect(session).toHaveProperty('metadata');
  
  // Validate context
  expect(session.context).toHaveProperty('generatedLenses');
  expect(session.context).toHaveProperty('evolutionChains');
  expect(session.context).toHaveProperty('hybridAttempts');
  expect(session.context).toHaveProperty('evaluationResults');
  expect(session.context).toHaveProperty('usedDomains');
  expect(session.context).toHaveProperty('currentProblem');
  
  expect(Array.isArray(session.context.generatedLenses)).toBe(true);
  expect(Array.isArray(session.context.evolutionChains)).toBe(true);
  expect(Array.isArray(session.context.hybridAttempts)).toBe(true);
  expect(Array.isArray(session.context.evaluationResults)).toBe(true);
  
  // Validate metadata
  expect(session.metadata).toHaveProperty('toolsUsed');
  expect(session.metadata).toHaveProperty('totalGenerations');
  expect(session.metadata).toHaveProperty('averageCreativityScore');
  
  expect(Array.isArray(session.metadata.toolsUsed)).toBe(true);
  expect(typeof session.metadata.totalGenerations).toBe('number');
  expect(typeof session.metadata.averageCreativityScore).toBe('number');
}

export function expectUniqueElements<T>(array: T[], minUnique: number): void {
  const unique = new Set(array);
  expect(unique.size).toBeGreaterThanOrEqual(minUnique);
}

export function expectCreativityScore(score: number, minimum: number = 0.7): void {
  expect(typeof score).toBe('number');
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(1);
  expect(score).toBeGreaterThanOrEqual(minimum);
}

export function expectNoCommonElements<T>(array1: T[], array2: T[]): void {
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  
  for (const item of set1) {
    expect(set2.has(item)).toBe(false);
  }
}

export function expectValidDomain(domain: string): void {
  expect(typeof domain).toBe('string');
  expect(domain.length).toBeGreaterThan(3);
  expect(domain).toMatch(/^[a-z_]+$/); // lowercase with underscores
}

export function expectReasonableExecutionTime(startTime: number, maxMs: number = 1000): void {
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(maxMs);
}