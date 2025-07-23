import { Resource } from '@modelcontextprotocol/sdk/types.js';

export const RESOURCE_TYPES = {
  DOMAINS: 'creative-lens://domains',
  EVOLUTION_PATTERNS: 'creative-lens://evolution-patterns',
  HYBRID_EXAMPLES: 'creative-lens://hybrid-examples',
  PROMPTS: 'creative-lens://prompts',
  SESSION: 'creative-lens://session'
} as const;

export const resources: Resource[] = [
  {
    uri: RESOURCE_TYPES.DOMAINS,
    name: 'Creative Domains',
    description: 'List of all available creative domains for lens generation',
    mimeType: 'application/json'
  },
  {
    uri: RESOURCE_TYPES.EVOLUTION_PATTERNS,
    name: 'Evolution Patterns',
    description: 'Available patterns for idea evolution and transformation',
    mimeType: 'application/json'
  },
  {
    uri: RESOURCE_TYPES.HYBRID_EXAMPLES,
    name: 'Hybrid Examples',
    description: 'Examples of successful hybrid ideas from different domains',
    mimeType: 'application/json'
  },
  {
    uri: `${RESOURCE_TYPES.PROMPTS}/{category}`,
    name: 'Prompt Templates',
    description: 'Prompt templates by category',
    mimeType: 'application/json'
  },
  {
    uri: `${RESOURCE_TYPES.SESSION}/{sessionId}`,
    name: 'Session Data',
    description: 'Complete session data including history and metrics',
    mimeType: 'application/json'
  }
];

export interface ResourceContent {
  uri: string;
  mimeType: string;
  data: unknown;
}

export function parseResourceUri(uri: string): { type: string; param?: string } {
  const match = uri.match(/^creative-lens:\/\/([^/]+)(?:\/(.+))?$/);
  if (!match) {
    throw new Error(`Invalid resource URI: ${uri}`);
  }
  
  return {
    type: match[1],
    param: match[2]
  };
}