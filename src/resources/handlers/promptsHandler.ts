import { ResourceContent } from '../index';

export async function handlePromptsResource(category: string): Promise<ResourceContent> {
  // For now, return a mock response
  const mockPrompts = [
    {
      id: 'lens-1',
      name: 'Creative Lens Generation',
      description: 'Generate creative lenses for problem solving',
      version: '1.0.0',
      tags: ['creativity', 'lens', 'generation']
    },
    {
      id: 'evolution-1',
      name: 'Idea Evolution',
      description: 'Evolve ideas through stages',
      version: '1.0.0',
      tags: ['evolution', 'ideas', 'stages']
    }
  ];
  
  const prompts = category === 'all' ? mockPrompts : 
    mockPrompts.filter(p => p.tags.includes(category));

  return {
    uri: `creative-lens://prompts/${category}`,
    mimeType: 'application/json',
    data: {
      category,
      count: prompts.length,
      prompts
    }
  };
}