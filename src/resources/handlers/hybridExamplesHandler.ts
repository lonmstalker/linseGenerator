import { ResourceContent } from '../index.js';

const hybridExamples = [
  {
    id: 'bio-architecture',
    name: 'Biomimetic Architecture',
    domains: ['Biology', 'Architecture'],
    description: 'Buildings that mimic natural systems for efficiency',
    examples: [
      'Termite-inspired ventilation systems',
      'Lotus effect self-cleaning surfaces',
      'Tree-like structural support systems'
    ]
  },
  {
    id: 'game-education',
    name: 'Gamified Learning',
    domains: ['Gaming', 'Education'],
    description: 'Educational systems using game mechanics',
    examples: [
      'Point-based progress tracking',
      'Achievement badges for milestones',
      'Competitive leaderboards for motivation'
    ]
  },
  {
    id: 'quantum-finance',
    name: 'Quantum Finance',
    domains: ['Quantum Physics', 'Finance'],
    description: 'Financial models using quantum principles',
    examples: [
      'Superposition in portfolio optimization',
      'Entanglement in market correlations',
      'Uncertainty principles in risk assessment'
    ]
  }
];

export async function handleHybridExamplesResource(): Promise<ResourceContent> {
  return {
    uri: 'creative-lens://hybrid-examples',
    mimeType: 'application/json',
    data: {
      total: hybridExamples.length,
      examples: hybridExamples
    }
  };
}