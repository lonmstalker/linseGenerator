import { parseResourceUri, ResourceContent } from '../index.js';
import { handleDomainsResource } from './domainsHandler.js';
import { handleEvolutionPatternsResource } from './evolutionPatternsHandler.js';
import { handleHybridExamplesResource } from './hybridExamplesHandler.js';
import { handlePromptsResource } from './promptsHandler.js';
import { getMockSessionData } from '../../mocks/sessionData.js';

export async function handleResourceRequest(uri: string): Promise<ResourceContent> {
  const { type, param } = parseResourceUri(uri);

  switch (type) {
    case 'domains':
      return handleDomainsResource();
    
    case 'evolution-patterns':
      return handleEvolutionPatternsResource();
    
    case 'hybrid-examples':
      return handleHybridExamplesResource();
    
    case 'prompts':
      if (!param) {
        throw new Error('Category parameter required for prompts resource');
      }
      return handlePromptsResource(param);
    
    case 'session':
      if (!param) {
        throw new Error('Session ID parameter required for session resource');
      }
      // Use mock data for now - in production this would fetch real session data
      return {
        uri: `creative-lens://session/${param}`,
        mimeType: 'application/json',
        data: getMockSessionData(param)
      };
    
    default:
      throw new Error(`Unknown resource type: ${type}`);
  }
}