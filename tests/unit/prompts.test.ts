import { 
  PromptManager,
  PromptOptimizer,
  PromptComposer,
  PromptTemplate,
  PromptRenderContext,
  Feedback
} from '@prompts';
import * as fs from 'fs/promises';
import * as path from 'path';

// Mock fs module
jest.mock('fs/promises');

describe('Prompt Management System', () => {
  describe('PromptOptimizer', () => {
    let optimizer: PromptOptimizer;

    beforeEach(() => {
      optimizer = new PromptOptimizer();
    });

    describe('analyzeClarity', () => {
      it('should analyze clarity of simple prompt', () => {
        const prompt = 'Generate creative ideas for improving team communication.';
        const clarity = optimizer.analyzeClarity(prompt);
        
        expect(clarity.overall).toBeGreaterThan(0.5);
        expect(clarity.readability).toBeDefined();
        expect(clarity.structure).toBeDefined();
        expect(clarity.ambiguityLevel).toBeDefined();
        expect(Array.isArray(clarity.suggestions)).toBe(true);
      });

      it('should detect ambiguous pronouns', () => {
        const prompt = 'It is unclear what this refers to.';
        const ambiguities = optimizer.detectAmbiguities(prompt);
        
        expect(ambiguities.length).toBeGreaterThan(0);
        expect(ambiguities.some(a => a.type === 'pronoun')).toBe(true);
      });

      it('should detect vague terms', () => {
        const prompt = 'Create something that does various things for many users.';
        const ambiguities = optimizer.detectAmbiguities(prompt);
        
        expect(ambiguities.some(a => a.text === 'something')).toBe(true);
        expect(ambiguities.some(a => a.text === 'various')).toBe(true);
        expect(ambiguities.some(a => a.text === 'many')).toBe(true);
      });
    });

    describe('simplifyLanguage', () => {
      it('should replace complex words with simpler alternatives', () => {
        const prompt = 'Utilize this approach to facilitate better comprehension.';
        const simplified = optimizer.simplifyLanguage(prompt);
        
        expect(simplified).toContain('use');
        expect(simplified).toContain('help');
        expect(simplified).not.toContain('utilize');
        expect(simplified).not.toContain('facilitate');
      });
    });

    describe('clarifyInstructions', () => {
      it('should add step numbers to instructions', () => {
        const prompt = `Create a plan.
Analyze the results.
Generate recommendations.`;
        const clarified = optimizer.clarifyInstructions(prompt);
        
        expect(clarified).toContain('1.');
        expect(clarified).toContain('2.');
        expect(clarified).toContain('3.');
      });
    });

    describe('removeRedundancy', () => {
      it('should remove redundant sentences', () => {
        const prompt = 'Create innovative solutions. Generate innovative solutions. Build new ideas.';
        const cleaned = optimizer.removeRedundancy(prompt);
        
        const sentences = cleaned.split('. ');
        expect(sentences.length).toBeLessThan(3);
      });
    });
  });

  describe('PromptComposer', () => {
    let composer: PromptComposer;

    beforeEach(() => {
      composer = new PromptComposer();
    });

    describe('composeMultiStagePrompt', () => {
      it('should compose multi-stage prompt', () => {
        const stages = [
          {
            id: 'analysis',
            template: 'Analyze {{target}}',
            variables: { target: 'the problem' },
            order: 1
          },
          {
            id: 'generation',
            template: 'Generate {{count}} solutions',
            variables: { count: 5 },
            order: 2
          }
        ];
        
        const result = composer.composeMultiStagePrompt(stages);
        
        expect(result).toContain('Stage 1: analysis');
        expect(result).toContain('Analyze the problem');
        expect(result).toContain('Stage 2: generation');
        expect(result).toContain('Generate 5 solutions');
      });
    });

    describe('formatWithMarkdown', () => {
      it('should convert headers to markdown', () => {
        const prompt = 'INTRODUCTION:\nThis is the content.';
        const formatted = composer.formatWithMarkdown(prompt);
        
        expect(formatted).toContain('### INTRODUCTION');
      });

      it('should emphasize key words', () => {
        const prompt = 'IMPORTANT: This is critical. NOTE: Pay attention.';
        const formatted = composer.formatWithMarkdown(prompt);
        
        expect(formatted).toContain('**IMPORTANT**');
        expect(formatted).toContain('**NOTE**');
      });
    });

    describe('injectExamples', () => {
      it('should inject examples at the end', () => {
        const prompt = 'Generate creative solutions.';
        const examples = [
          {
            input: 'Team communication',
            output: 'Virtual reality meeting rooms',
            explanation: 'Immersive collaboration'
          }
        ];
        
        const result = composer.injectExamples(prompt, examples, 'end');
        
        expect(result).toContain('## EXAMPLES');
        expect(result).toContain('Team communication');
        expect(result).toContain('Virtual reality meeting rooms');
      });
    });

    describe('addConstraints', () => {
      it('should add constraints section', () => {
        const prompt = 'Generate ideas.';
        const constraints = [
          'Must be cost-effective',
          'Should work remotely'
        ];
        
        const result = composer.addConstraints(prompt, constraints);
        
        expect(result).toContain('⚠️ CONSTRAINTS:');
        expect(result).toContain('1. Must be cost-effective');
        expect(result).toContain('2. Should work remotely');
      });
    });
  });

  describe('PromptManager', () => {
    let manager: PromptManager;
    const mockTemplates: PromptTemplate[] = [
      {
        id: 'test-template',
        name: 'Test Template',
        category: 'lens',
        version: '1.0.0',
        template: 'Generate {{count}} ideas for {{topic}}',
        variables: [
          {
            name: 'count',
            type: 'number',
            description: 'Number of ideas',
            required: true,
            validation: { min: 1, max: 10 }
          },
          {
            name: 'topic',
            type: 'string',
            description: 'Topic to explore',
            required: true,
            validation: { minLength: 5 }
          }
        ],
        examples: [
          {
            input: { count: 3, topic: 'team building' },
            expectedOutput: 'Three creative team building ideas',
            quality: 'excellent'
          }
        ],
        metadata: {
          author: 'Test',
          created: Date.now(),
          lastModified: Date.now(),
          usageCount: 0,
          effectivenessScore: 0,
          tags: ['test']
        }
      }
    ];

    beforeEach(() => {
      manager = new PromptManager('./test-templates');
      
      // Mock file system operations
      (fs.readdir as jest.Mock).mockResolvedValue(['test-template.yaml']);
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockTemplates[0]));
    });

    describe('loadTemplates', () => {
      it('should load templates from directory', async () => {
        await manager.loadTemplates();
        
        const template = manager.getTemplate('test-template');
        expect(template).toBeDefined();
        expect(template?.name).toBe('Test Template');
      });
    });

    describe('renderPrompt', () => {
      it('should render prompt with variables', async () => {
        await manager.loadTemplates();
        
        const context: PromptRenderContext = {
          variables: {
            count: 5,
            topic: 'remote work'
          }
        };
        
        const rendered = await manager.renderPrompt('test-template', context);
        
        expect(rendered.prompt).toBe('Generate 5 ideas for remote work');
        expect(rendered.templateId).toBe('test-template');
        expect(rendered.variables).toEqual(context.variables);
      });

      it('should validate required variables', async () => {
        await manager.loadTemplates();
        
        const context: PromptRenderContext = {
          variables: {
            count: 5
            // missing 'topic'
          }
        };
        
        await expect(manager.renderPrompt('test-template', context))
          .rejects.toThrow('Invalid variables');
      });

      it('should validate variable constraints', async () => {
        await manager.loadTemplates();
        
        const context: PromptRenderContext = {
          variables: {
            count: 20, // exceeds max
            topic: 'test'
          }
        };
        
        await expect(manager.renderPrompt('test-template', context))
          .rejects.toThrow('Invalid variables');
      });
    });

    describe('validateVariables', () => {
      it('should validate variable types', async () => {
        await manager.loadTemplates();
        const template = manager.getTemplate('test-template')!;
        
        const result = manager.validateVariables(template, {
          count: 'five', // wrong type
          topic: 'remote work'
        });
        
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]?.message).toContain('should be of type number');
      });

      it('should warn about unknown variables', async () => {
        await manager.loadTemplates();
        const template = manager.getTemplate('test-template')!;
        
        const result = manager.validateVariables(template, {
          count: 5,
          topic: 'remote work',
          extra: 'unknown'
        });
        
        expect(result.valid).toBe(true);
        expect(result.warnings).toHaveLength(1);
        expect(result.warnings[0]?.message).toContain('Unknown variable');
      });
    });

    describe('recordFeedback', () => {
      it('should update metrics based on feedback', async () => {
        await manager.loadTemplates();
        
        const renderedPrompt = {
          prompt: 'Test prompt',
          templateId: 'test-template',
          timestamp: Date.now(),
          variables: {}
        };
        
        const feedback: Feedback = {
          quality: 4,
          effectiveness: true,
          issues: ['clarity']
        };
        
        await manager.recordFeedback('test-template', renderedPrompt, feedback);
        
        // Verify metrics were updated (would need to expose analytics for testing)
      });
    });

    describe('suggestImprovements', () => {
      it('should suggest improvements for templates', async () => {
        await manager.loadTemplates();
        
        const improvements = manager.suggestImprovements('test-template');
        
        expect(Array.isArray(improvements)).toBe(true);
        // Should suggest adding more examples
        expect(improvements.some(i => i.type === 'examples')).toBe(true);
      });
    });

    describe('optimizeTemplate', () => {
      it('should optimize template text', async () => {
        await manager.loadTemplates();
        
        const changes = await manager.optimizeTemplate('test-template');
        
        expect(changes).toBeDefined();
        // May or may not have changes depending on template quality
      });
    });
  });
});