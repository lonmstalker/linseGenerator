import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  {
    name: 'generate_creative_lens_prompt',
    description: 'Creates structured prompt for generating 5 creative lenses',
    inputSchema: {
      type: 'object',
      properties: {
        problem: { 
          type: 'string', 
          description: 'Problem to analyze',
          minLength: 10,
          maxLength: 500
        },
        complexity: {
          type: 'string',
          enum: ['simple', 'moderate', 'complex'],
          description: 'Desired solution complexity',
          default: 'moderate'
        },
        domains_to_explore: {
          type: 'array',
          items: { type: 'string' },
          description: 'Preferred domains for metaphors (optional)',
          maxItems: 3
        },
        avoid_domains: {
          type: 'array',
          items: { type: 'string' },
          description: 'Domains to avoid',
          maxItems: 5
        },
        session_id: {
          type: 'string',
          description: 'Session ID for context'
        }
      },
      required: ['problem']
    }
  },
  {
    name: 'evolve_idea_with_structure',
    description: 'Provides structured framework for idea evolution',
    inputSchema: {
      type: 'object',
      properties: {
        current_idea: {
          type: 'string',
          description: 'Current idea to evolve',
          minLength: 10
        },
        evolution_stage: {
          type: 'number',
          minimum: 1,
          maximum: 3,
          description: 'Current evolution stage'
        },
        desired_madness: {
          type: 'number',
          minimum: 1,
          maximum: 10,
          description: 'Desired radicality level'
        },
        preferred_patterns: {
          type: 'array',
          items: { type: 'string' },
          description: 'Preferred evolution patterns'
        },
        session_id: { type: 'string' }
      },
      required: ['current_idea', 'evolution_stage', 'desired_madness']
    }
  },
  {
    name: 'create_hybrid_framework',
    description: 'Creates framework for cross-pollinating two ideas',
    inputSchema: {
      type: 'object',
      properties: {
        idea_a: { 
          type: 'string',
          description: 'First idea for hybridization'
        },
        idea_b: { 
          type: 'string',
          description: 'Second idea for hybridization'
        },
        fusion_method: {
          type: 'string',
          enum: ['structural', 'functional', 'conceptual', 'dialectical', 'quantum', 'auto'],
          description: 'Fusion method',
          default: 'auto'
        },
        emphasis: {
          type: 'string',
          enum: ['synergy', 'novelty', 'practicality'],
          description: 'What to emphasize',
          default: 'synergy'
        },
        session_id: { type: 'string' }
      },
      required: ['idea_a', 'idea_b']
    }
  },
  {
    name: 'evaluate_creativity',
    description: 'Creates framework for evaluating idea creativity',
    inputSchema: {
      type: 'object',
      properties: {
        ideas: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 10,
          description: 'Ideas to evaluate'
        },
        evaluation_criteria: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['novelty', 'usefulness', 'surprise', 'elegance', 'feasibility']
          },
          description: 'Evaluation criteria',
          default: ['novelty', 'usefulness']
        },
        comparison_mode: {
          type: 'boolean',
          description: 'Compare ideas against each other',
          default: false
        },
        session_id: { type: 'string' }
      },
      required: ['ideas']
    }
  },
  {
    name: 'get_session_insights',
    description: 'Gets analytics and insights for current session',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Session ID'
        },
        insight_type: {
          type: 'string',
          enum: ['summary', 'trends', 'recommendations', 'full_report'],
          default: 'summary'
        }
      },
      required: ['session_id']
    }
  },
  {
    name: 'list_sessions',
    description: 'Lists all active sessions',
    inputSchema: {
      type: 'object',
      properties: {
        include_expired: {
          type: 'boolean',
          description: 'Include expired sessions',
          default: false
        }
      }
    }
  },
  {
    name: 'get_session_history',
    description: 'Returns detailed session history',
    inputSchema: {
      type: 'object',
      properties: {
        session_id: {
          type: 'string',
          description: 'Session ID to retrieve'
        }
      },
      required: ['session_id']
    }
  }
];