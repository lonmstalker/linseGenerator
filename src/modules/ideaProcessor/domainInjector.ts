/**
 * Domain Injector for idea evolution
 * Injects random domain elements into evolving ideas
 */

import { DomainInjection } from './types';
import { DOMAIN_LIBRARY, getAllDomainIds, Domain } from '../lensGenerator/index.js';

export class DomainInjector {
  private domainIds: string[];
  private recentlyUsed: string[] = [];
  private maxRecentHistory = 5;
  
  constructor() {
    this.domainIds = getAllDomainIds();
  }
  
  /**
   * Inject a random domain element into an idea
   */
  injectRandomDomain(idea: string): DomainInjection {
    // Select a random domain (avoiding recent ones)
    const availableDomains = this.domainIds.filter(id => 
      !this.recentlyUsed.includes(id)
    );
    
    const randomIndex = Math.floor(Math.random() * availableDomains.length);
    const domainId = availableDomains[randomIndex] || this.domainIds[0]!;
    const domain = DOMAIN_LIBRARY[domainId]!;
    
    // Update recently used
    this.recentlyUsed.push(domainId);
    if (this.recentlyUsed.length > this.maxRecentHistory) {
      this.recentlyUsed.shift();
    }
    
    // Select injection point based on idea content
    const injectionPoint = this.findInjectionPoint(idea);
    
    // Select random element from domain
    const element = this.selectDomainElement(domain);
    
    // Generate rationale
    const rationale = this.generateRationale(idea, domain, element);
    
    return {
      domain: domain.name,
      injectionPoint,
      element,
      rationale
    };
  }
  
  /**
   * Find appropriate injection point in idea
   */
  private findInjectionPoint(idea: string): string {
    const injectionStrategies = [
      'the core mechanism',
      'the user interaction',
      'the underlying process',
      'the output generation',
      'the feedback loop',
      'the constraint system',
      'the resource management',
      'the communication layer'
    ];
    
    // Simple heuristic: pick based on idea keywords
    if (idea.toLowerCase().includes('system')) {
      return 'the system architecture';
    } else if (idea.toLowerCase().includes('user')) {
      return 'the user experience';
    } else if (idea.toLowerCase().includes('process')) {
      return 'the process flow';
    }
    
    // Default: random selection
    return injectionStrategies[Math.floor(Math.random() * injectionStrategies.length)]!;
  }
  
  /**
   * Select a domain element to inject
   */
  private selectDomainElement(domain: Domain): string {
    const elementTypes = [
      { 
        type: 'metaphor', 
        elements: domain.metaphors,
        prefix: 'the concept of'
      },
      { 
        type: 'principle', 
        elements: domain.principles,
        prefix: 'the principle of'
      },
      { 
        type: 'question', 
        elements: domain.questions,
        prefix: 'the perspective from'
      }
    ];
    
    // Random element type
    const selectedType = elementTypes[Math.floor(Math.random() * elementTypes.length)]!;
    const randomElement = selectedType.elements[
      Math.floor(Math.random() * selectedType.elements.length)
    ];
    
    return `${selectedType.prefix} "${randomElement}"`;
  }
  
  /**
   * Generate rationale for injection
   */
  private generateRationale(_idea: string, domain: Domain, element: string): string {
    const rationales = [
      `By incorporating ${element} from ${domain.name}, we can ${domain.perspective}`,
      `The ${domain.expertRole} would see this through ${element}, revealing hidden patterns`,
      `Applying ${element} transforms the problem into ${domain.metaphors[0]} dynamics`,
      `This injection creates unexpected synergy between the original concept and ${domain.principles[0]}`
    ];
    
    return rationales[Math.floor(Math.random() * rationales.length)]!;
  }
  
  /**
   * Get injection suggestions for specific madness level
   */
  getInjectionSuggestions(currentMadness: number): string[] {
    const suggestions: string[] = [];
    
    if (currentMadness < 4) {
      suggestions.push(
        'Inject practical domain elements (engineering, design)',
        'Use concrete metaphors from physical sciences',
        'Apply systematic thinking from established fields'
      );
    } else if (currentMadness < 7) {
      suggestions.push(
        'Inject artistic or philosophical concepts',
        'Use biological or quantum metaphors',
        'Apply paradoxical thinking patterns'
      );
    } else {
      suggestions.push(
        'Inject consciousness or mystical concepts',
        'Use reality-bending metaphors',
        'Apply recursive or self-referential patterns'
      );
    }
    
    return suggestions;
  }
  
  /**
   * Create madness amplifiers based on injected domain
   */
  createMadnessAmplifiers(domain: string, targetLevel: number): string[] {
    const amplifiers: string[] = [];
    
    // Base amplifiers
    if (targetLevel >= 3) {
      amplifiers.push(`Make the ${domain} element self-aware`);
    }
    if (targetLevel >= 5) {
      amplifiers.push(`Let the ${domain} concept reproduce and evolve`);
    }
    if (targetLevel >= 7) {
      amplifiers.push(`The ${domain} principle rewrites its own rules`);
    }
    if (targetLevel >= 9) {
      amplifiers.push(`Reality bends to accommodate the ${domain} logic`);
    }
    
    // Domain-specific amplifiers
    if (domain.includes('Quantum')) {
      amplifiers.push('Add observer-dependent reality shifts');
    }
    if (domain.includes('Biological')) {
      amplifiers.push('Introduce parasitic idea mutations');
    }
    if (domain.includes('Philosophy')) {
      amplifiers.push('Question the existence of the solution itself');
    }
    
    return amplifiers;
  }
}