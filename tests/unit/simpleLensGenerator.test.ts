/**
 * Simple unit tests for Lens Generator without server dependencies
 */

import { 
  LensPromptGenerator, 
  DomainCategory,
  getAllDomainIds,
  getDomainsByCategory,
  getRandomDomainsWithDiversity,
  DOMAIN_LIBRARY
} from '@modules/lensGenerator';

describe('LensPromptGenerator Basic Tests', () => {
  let generator: LensPromptGenerator;
  
  beforeEach(() => {
    generator = new LensPromptGenerator();
  });
  
  describe('generateLensPrompts', () => {
    it('should generate prompts with 5 domains', () => {
      const result = generator.generateLensPrompts('How to improve team productivity');
      
      expect(result).toBeDefined();
      expect(result.metadata.suggestedDomains).toHaveLength(5);
    });
    
    it('should include problem in result', () => {
      const problem = 'How to reduce customer churn';
      const result = generator.generateLensPrompts(problem);
      
      expect(result.problem).toBe(problem);
    });
    
    it('should generate all required components', () => {
      const result = generator.generateLensPrompts('test problem');
      
      expect(result.prompts).toBeDefined();
      expect(result.prompts.mainPrompt).toBeTruthy();
      expect(result.prompts.guidingQuestions).toBeDefined();
      expect(result.prompts.constraints).toBeDefined();
      expect(result.prompts.exampleFormat).toBeTruthy();
    });
  });
  
  describe('Domain Library', () => {
    it('should have at least 48 domains', () => {
      const allDomains = getAllDomainIds();
      expect(allDomains.length).toBeGreaterThanOrEqual(48);
    });
    
    it('should have valid domain structure', () => {
      const domainIds = getAllDomainIds();
      const firstDomain = DOMAIN_LIBRARY[domainIds[0]];
      
      expect(firstDomain).toBeDefined();
      expect(firstDomain.name).toBeTruthy();
      expect(firstDomain.category).toBeTruthy();
      expect(firstDomain.metaphors).toBeDefined();
      expect(firstDomain.questions).toBeDefined();
      expect(firstDomain.principles).toBeDefined();
    });
  });
});