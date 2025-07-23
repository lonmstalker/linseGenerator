/**
 * Lens Prompt Generator
 * Generates structured prompts for creative lens analysis
 */

import { 
  LensGenerationResult, 
  GenerationOptions, 
  DomainLibrary,
  Domain
} from './types';
import { DOMAIN_LIBRARY, getRandomDomainsWithDiversity, getAllDomainIds } from './domains';
import { UsageTracker } from './usageTracker';

export class LensPromptGenerator {
  private domainLibrary: DomainLibrary;
  private usageTracker: UsageTracker;
  
  constructor(customDomains?: DomainLibrary) {
    this.domainLibrary = customDomains || DOMAIN_LIBRARY;
    this.usageTracker = new UsageTracker();
  }
  
  /**
   * Generate lens prompts for a given problem
   */
  generateLensPrompts(problem: string, options?: GenerationOptions): LensGenerationResult {
    const opts = this.normalizeOptions(options);
    
    // Select diverse domains
    const selectedDomains = this.selectDiverseDomains(5, opts.avoidDomains !== undefined);
    
    // Filter out avoided domains if specified
    const finalDomains = opts.avoidDomains 
      ? selectedDomains.filter(id => !opts.avoidDomains!.includes(id))
      : selectedDomains;
    
    // Ensure we have exactly 5 domains
    while (finalDomains.length < 5) {
      const additionalDomains = this.selectDiverseDomains(1, true);
      for (const domain of additionalDomains) {
        if (!finalDomains.includes(domain) && !opts.avoidDomains?.includes(domain)) {
          finalDomains.push(domain);
          break;
        }
      }
    }
    
    // Build the structured prompt
    const mainPrompt = this.buildStructuredPrompt(problem, finalDomains.slice(0, 5));
    
    // Create guiding questions
    const guidingQuestions = this.createMetaGuidingQuestions(problem, opts.complexity);
    
    // Generate constraints based on complexity
    const constraints = this.generateConstraints(opts.complexity);
    
    // Create example format
    const exampleFormat = this.formatExampleOutput();
    
    // Record usage
    for (const domainId of finalDomains) {
      this.usageTracker.recordUsage(domainId);
    }
    
    return {
      problem,
      prompts: {
        mainPrompt,
        guidingQuestions,
        constraints,
        exampleFormat
      },
      metadata: {
        suggestedDomains: finalDomains,
        avoidPatterns: this.getCommonPatterns(),
        timestamp: Date.now()
      }
    };
  }
  
  /**
   * Select diverse domains for lens generation
   */
  selectDiverseDomains(count: number, excludeRecent: boolean = false): string[] {
    const recentlyUsed = excludeRecent ? this.usageTracker.getRecentlyUsed(10) : [];
    
    // Prefer least recently used domains with good effectiveness
    const allDomainIds = getAllDomainIds();
    const leastRecent = this.usageTracker.getLeastRecentlyUsed(allDomainIds, count * 2);
    
    // Get domains with diversity
    const selected = getRandomDomainsWithDiversity(count, recentlyUsed);
    
    // Mix in some least recently used
    const mixed: string[] = [];
    for (let i = 0; i < count; i++) {
      const leastRecentIndex = Math.floor(i / 2);
      if (i % 2 === 0 && leastRecent[leastRecentIndex]) {
        mixed.push(leastRecent[leastRecentIndex]!);
      } else if (selected[i]) {
        mixed.push(selected[i]!);
      }
    }
    
    // Validate diversity
    if (!this.validateDomainDiversity(mixed)) {
      // If not diverse enough, get new random set
      return getRandomDomainsWithDiversity(count, recentlyUsed);
    }
    
    return mixed.slice(0, count);
  }
  
  /**
   * Build the main structured prompt
   */
  buildStructuredPrompt(problem: string, domainIds: string[]): string {
    const domains = domainIds.map(id => this.domainLibrary[id]).filter(Boolean) as Domain[];
    
    const domainSections = domains.map((domain, index) => {
      const num = index + 1;
      return `${num}. ${domain.name} - think like a ${domain.expertRole}, applying principles of ${domain.principles.slice(0, 2).join(' and ')}`;
    }).join('\n   ');
    
    const avoidPatterns = this.getCommonPatterns().map(p => `   • ${p}`).join('\n');
    
    return `=== CREATIVE LENS GENERATION PROMPT ===

Problem: "${problem}"

Create 5 unique creative lenses to analyze this problem using metaphors from these domains:

   ${domainSections}

For each lens create:

   📍 Metaphor: "This problem is like [specific metaphor from domain]"
   ❓ Provocative question: "What if we [unexpected action based on domain principles]?"
   💡 Challenged assumption: "Everyone assumes X, but what if Y?"

Response format:

LENS 1: [Domain name]
Metaphor: ...
Question: ...
Assumption: ...

LENS 2: [Domain name]
Metaphor: ...
Question: ...
Assumption: ...

[Continue for all 5 lenses]

⚠️ IMPORTANT: Avoid these clichés:
${avoidPatterns}

Strive for maximum originality and unexpected connections!`;
  }
  
  /**
   * Create guiding questions for a problem and domain
   */
  createGuidingQuestions(_problem: string, domain: string): string[] {
    const domainData = this.domainLibrary[domain];
    if (!domainData) return [];
    
    return [
      `From a ${domainData.expertRole}'s perspective, what patterns do you see?`,
      `How would ${domainData.principles[0]} apply to this situation?`,
      `What ${domainData.metaphors[0]} exists in this problem?`,
      ...domainData.questions.slice(0, 2)
    ];
  }
  
  /**
   * Create meta-level guiding questions
   */
  private createMetaGuidingQuestions(_problem: string, complexity?: string): string[] {
    const baseQuestions = [
      'What assumptions are we making about this problem?',
      'How might this look from a completely different cultural perspective?',
      'What would happen if we inverted the problem?',
      'Where are the hidden connections between domains?'
    ];
    
    if (complexity === 'complex') {
      baseQuestions.push(
        'What second-order effects might emerge?',
        'How do these lenses interact with each other?',
        'What paradoxes arise from these perspectives?'
      );
    }
    
    return baseQuestions;
  }
  
  /**
   * Generate constraints based on complexity
   */
  private generateConstraints(complexity?: string): string[] {
    const base = [
      'Each lens must use specific metaphors from its domain',
      'Avoid generic business or tech jargon',
      'Make connections that surprise and delight'
    ];
    
    switch (complexity) {
      case 'simple':
        return [...base, 'Keep metaphors concrete and visual'];
      case 'complex':
        return [...base, 
          'Explore philosophical implications',
          'Consider systemic and emergent properties',
          'Draw from deep domain expertise'
        ];
      default: // moderate
        return [...base, 'Balance accessibility with depth'];
    }
  }
  
  /**
   * Format example output template
   */
  formatExampleOutput(): string {
    return `Example of excellent output:

LENS 1: Mycorrhizal Networks
Metaphor: "This problem is like an underground fungal network where invisible connections share resources between seemingly separate entities"
Question: "What if the solution requires creating hidden channels for mutual support rather than direct connections?"
Assumption: "Everyone assumes entities must communicate directly, but what if the most effective communication happens through intermediaries?"`;
  }
  
  /**
   * Validate that selected domains are diverse
   */
  validateDomainDiversity(domainIds: string[]): boolean {
    if (domainIds.length < 2) return true;
    
    const categories = new Set<string>();
    
    for (const id of domainIds) {
      const domain = this.domainLibrary[id];
      if (domain) {
        categories.add(domain.category);
      }
    }
    
    // Ensure at least 3 different categories for 5 domains
    return categories.size >= Math.min(3, domainIds.length - 1);
  }
  
  /**
   * Get common patterns to avoid
   */
  private getCommonPatterns(): string[] {
    return [
      'Simple "it\'s like a machine" comparisons',
      'Overused "ecosystem" metaphors without specificity',
      'Generic "building/foundation" analogies',
      'Vague "journey" or "path" metaphors',
      'Clichéd "war" or "battle" comparisons'
    ];
  }
  
  /**
   * Normalize generation options
   */
  private normalizeOptions(options?: GenerationOptions): Required<GenerationOptions> {
    return {
      complexity: options?.complexity || 'moderate',
      preferredDomains: options?.preferredDomains || [],
      avoidDomains: options?.avoidDomains || [],
      ensureDiversity: options?.ensureDiversity !== false
    };
  }
  
  /**
   * Get usage tracker instance
   */
  getUsageTracker(): UsageTracker {
    return this.usageTracker;
  }
  
  /**
   * Get domain library
   */
  getDomainLibrary(): DomainLibrary {
    return this.domainLibrary;
  }
  
  /**
   * Calculate diversity score for a set of domains
   */
  calculateDiversityScore(domainIds: string[]): number {
    return this.usageTracker.getDiversityScore(domainIds);
  }
}