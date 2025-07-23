import { ResourceContent } from '../index';
import { EVOLUTION_PATTERNS } from '../../modules/ideaProcessor/index.js';

export async function handleEvolutionPatternsResource(): Promise<ResourceContent> {
  const patterns = EVOLUTION_PATTERNS || [];
  
  const patternList = patterns.map((pattern: any) => ({
    name: pattern.name || 'Unknown',
    description: pattern.description || '',
    techniques: pattern.techniques || [],
    stage: pattern.stage || 1,
    madnessLevel: pattern.madnessLevel || 5
  }));

  return {
    uri: 'creative-lens://evolution-patterns',
    mimeType: 'application/json',
    data: {
      totalPatterns: patternList.length,
      patterns: patternList
    }
  };
}