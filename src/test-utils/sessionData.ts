/**
 * Mock session data for testing and development
 */

export function getMockSessionData(sessionId: string) {
  return {
    session: {
      id: sessionId,
      userId: 'user-123',
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now(),
      metadata: {
        toolsUsed: ['generate_creative_lens_prompt', 'evolve_idea_with_structure'],
        totalGenerations: 5
      }
    },
    history: [
      {
        timestamp: Date.now() - 3000000,
        action: 'lens_generated',
        tool: 'generate_creative_lens_prompt'
      },
      {
        timestamp: Date.now() - 1800000,
        action: 'idea_evolved',
        tool: 'evolve_idea_with_structure'
      }
    ],
    metrics: {
      totalActions: 10,
      toolUsage: {
        'generate_creative_lens_prompt': 5,
        'evolve_idea_with_structure': 3,
        'create_hybrid_framework': 2
      },
      domainDistribution: {
        'sciences': 0.3,
        'arts': 0.25,
        'technology': 0.2,
        'nature': 0.15,
        'philosophy': 0.1
      },
      averageCreativityScore: 0.82
    }
  };
}