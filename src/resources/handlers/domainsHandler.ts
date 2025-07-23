import { ResourceContent } from '../index';
import { DOMAIN_LIBRARY, DomainCategory } from '../../modules/lensGenerator/index.js';

export async function handleDomainsResource(): Promise<ResourceContent> {
  const domainsByCategory: Record<string, any[]> = {};
  
  // Group domains by category
  Object.entries(DOMAIN_LIBRARY).forEach(([id, domain]) => {
    const category = domain.category;
    if (!domainsByCategory[category]) {
      domainsByCategory[category] = [];
    }
    domainsByCategory[category].push({
      id,
      name: domain.name,
      description: domain.perspective,
      metaphors: domain.metaphors.length,
      questions: domain.questions.length,
      principles: domain.principles.length
    });
  });
  
  const domainList = Object.entries(domainsByCategory).map(([category, domains]) => ({
    category,
    count: domains.length,
    domains
  }));

  return {
    uri: 'creative-lens://domains',
    mimeType: 'application/json',
    data: {
      totalCategories: domainList.length,
      totalDomains: Object.keys(DOMAIN_LIBRARY).length,
      categories: domainList
    }
  };
}