import { tools } from '@tools/creativeLensTools';
import { ToolRegistry } from '@tools/toolRegistry';
import { 
  handleGenerateLensPrompt,
  handleEvolveIdea,
  handleCreateHybrid,
  handleEvaluateCreativity,
  handleGetSessionInsights,
  handleListSessions,
  handleGetSessionHistory
} from '@tools/handlers';
import { StateManager } from '@modules/stateManager';
import { LensPromptGenerator } from '@modules/lensGenerator';
import { IdeaEvolutionAssistant } from '@modules/ideaProcessor';
import { CrossPollinator } from '@modules/crossPollinator';
import { ToolContext } from '@tools/types';

describe('Tool System', () => {
  let toolContext: ToolContext;
  let stateManager: StateManager;
  let lensGenerator: LensPromptGenerator;
  let ideaEvolution: IdeaEvolutionAssistant;
  let crossPollinator: CrossPollinator;

  beforeEach(() => {
    stateManager = new StateManager({
      persistence: { type: 'memory' }
    });
    lensGenerator = new LensPromptGenerator();
    ideaEvolution = new IdeaEvolutionAssistant();
    crossPollinator = new CrossPollinator();

    toolContext = {
      stateManager,
      lensGenerator,
      ideaEvolution,
      crossPollinator
    };
  });

  describe('Tool Definitions', () => {
    it('should export all required tools', () => {
      expect(tools).toHaveLength(7);
      
      const toolNames = tools.map(t => t.name);
      expect(toolNames).toContain('generate_creative_lens_prompt');
      expect(toolNames).toContain('evolve_idea_with_structure');
      expect(toolNames).toContain('create_hybrid_framework');
      expect(toolNames).toContain('evaluate_creativity');
      expect(toolNames).toContain('get_session_insights');
      expect(toolNames).toContain('list_sessions');
      expect(toolNames).toContain('get_session_history');
    });

    it('should have valid input schemas for all tools', () => {
      tools.forEach(tool => {
        expect(tool.inputSchema).toBeDefined();
        expect(tool.inputSchema.type).toBe('object');
        expect(tool.inputSchema.properties).toBeDefined();
        
        if (tool.inputSchema['required']) {
          expect(Array.isArray(tool.inputSchema['required'])).toBe(true);
        }
      });
    });
  });

  describe('Tool Registry', () => {
    let registry: ToolRegistry;

    beforeEach(() => {
      registry = new ToolRegistry();
    });

    it('should register all tool handlers', () => {
      expect(registry.hasHandler('generate_creative_lens_prompt')).toBe(true);
      expect(registry.hasHandler('evolve_idea_with_structure')).toBe(true);
      expect(registry.hasHandler('create_hybrid_framework')).toBe(true);
      expect(registry.hasHandler('evaluate_creativity')).toBe(true);
      expect(registry.hasHandler('get_session_insights')).toBe(true);
      expect(registry.hasHandler('list_sessions')).toBe(true);
      expect(registry.hasHandler('get_session_history')).toBe(true);
    });

    it('should return error for unknown tool', async () => {
      const result = await registry.executeTool('unknown_tool', {}, toolContext);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown tool');
    });

    it('should execute tool successfully', async () => {
      const result = await registry.executeTool(
        'generate_creative_lens_prompt',
        { problem: 'How to improve team collaboration' },
        toolContext
      );
      
      expect(result.success).toBe(true);
      expect(result.content).toBeDefined();
      expect(result.content?.[0]?.type).toBe('text');
    });
  });

  describe('Tool Handlers', () => {
    describe('handleGenerateLensPrompt', () => {
      it('should generate lens prompt successfully', async () => {
        const args = {
          problem: 'How to improve team collaboration',
          complexity: 'moderate',
          domains_to_explore: ['music', 'sports']
        };
        
        const result = await handleGenerateLensPrompt(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content).toHaveLength(1);
        expect(result.content?.[0]?.text).toContain('CREATIVE LENS');
        const metadata = result.metadata as Record<string, unknown>;
        expect(metadata?.sessionId).toBeDefined();
        expect(metadata?.domains).toBeDefined();
      });

    });

    describe('handleEvolveIdea', () => {
      it('should evolve idea successfully', async () => {
        const args = {
          current_idea: 'Use regular video meetings for team sync',
          evolution_stage: 2,
          desired_madness: 5
        };
        
        const result = await handleEvolveIdea(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('EVOLUTION');
        const metadata = result.metadata as Record<string, unknown>;
        expect(metadata?.evaluationCriteria).toBeDefined();
      });

      it('should validate evolution stage', async () => {
        const args = {
          current_idea: 'Test idea',
          evolution_stage: 5, // Invalid
          desired_madness: 5
        };
        
        const result = await handleEvolveIdea(args, toolContext);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Evolution stage must be between 1 and 3');
      });
    });

    describe('handleCreateHybrid', () => {
      it('should create hybrid framework successfully', async () => {
        const args = {
          idea_a: 'Virtual reality meetings',
          idea_b: 'AI-powered agenda generation',
          fusion_method: 'conceptual'
        };
        
        const result = await handleCreateHybrid(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('CROSS-POLLINATION');
        const metadata = result.metadata as Record<string, unknown>;
        expect(metadata?.method).toBe('conceptual');
        expect(metadata?.exampleCount).toBeGreaterThan(0);
      });
    });

    describe('handleEvaluateCreativity', () => {
      it('should evaluate creativity successfully', async () => {
        const args = {
          ideas: ['Idea 1', 'Idea 2'],
          evaluation_criteria: ['novelty', 'usefulness'],
          comparison_mode: true
        };
        
        const result = await handleEvaluateCreativity(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('CREATIVITY EVALUATION');
        expect(result.content?.[0]?.text).toContain('COMPARATIVE ANALYSIS');
      });

      it('should require at least one idea', async () => {
        const args = {
          ideas: []
        };
        
        const result = await handleEvaluateCreativity(args, toolContext);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('At least one idea must be provided');
      });
    });

    describe('Session Management Tools', () => {
      let sessionId: string;

      beforeEach(() => {
        const session = stateManager.createSession('testUser', 'test problem');
        sessionId = session.id;
        
        // Add some data to session
        stateManager.updateMetrics(sessionId, 'totalGenerations', 1);
        stateManager.updateMetrics(sessionId, 'totalGenerations', 1);
        stateManager.updateMetrics(sessionId, 'domain', 'physics');
        stateManager.updateMetrics(sessionId, 'domain', 'music');
      });

      it('should get session insights', async () => {
        const args = {
          session_id: sessionId,
          insight_type: 'summary'
        };
        
        const result = await handleGetSessionInsights(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('SESSION SUMMARY');
        expect(result.content?.[0]?.text).toContain('Total Ideas Generated: 2');
      });

      it('should list all sessions', async () => {
        const result = await handleListSessions({}, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('ACTIVE SESSIONS');
        expect(result.content?.[0]?.text).toContain('Total sessions: 1');
      });

      it('should get session history', async () => {
        const args = {
          session_id: sessionId
        };
        
        const result = await handleGetSessionHistory(args, toolContext);
        
        expect(result.success).toBe(true);
        expect(result.content?.[0]?.text).toContain('SESSION HISTORY');
        expect(result.content?.[0]?.text).toContain('2 ideas generated');
      });

      it('should handle non-existent session', async () => {
        const args = {
          session_id: 'non-existent'
        };
        
        const result = await handleGetSessionInsights(args, toolContext);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Session not found');
      });
    });
  });
});