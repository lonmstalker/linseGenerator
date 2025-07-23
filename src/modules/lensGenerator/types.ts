/**
 * Type definitions for the Lens Generator module
 */

/**
 * Template for generating lens prompts from a specific domain
 */
export interface LensPromptTemplate {
  id: string;
  domain: string;
  metaphorTemplate: string;
  questionTemplates: string[];
  assumptionChallenges: string[];
  exampleApplication: string;
}

/**
 * Result of lens generation process
 */
export interface LensGenerationResult {
  problem: string;
  prompts: {
    mainPrompt: string;
    guidingQuestions: string[];
    constraints: string[];
    exampleFormat: string;
  };
  metadata: {
    suggestedDomains: string[];
    avoidPatterns: string[];
    timestamp: number;
  };
}

/**
 * Domain definition with creative thinking elements
 */
export interface Domain {
  name: string;
  category: DomainCategory;
  metaphors: string[];
  questions: string[];
  principles: string[];
  expertRole: string;
  perspective: string;
}

/**
 * Categories for organizing domains
 */
export enum DomainCategory {
  NATURAL_SYSTEMS = 'natural_systems',
  ARTS = 'arts',
  SCIENCES = 'sciences',
  CULINARY = 'culinary',
  SPORTS_GAMES = 'sports_games',
  ARCHITECTURE_DESIGN = 'architecture_design',
  MYTHOLOGY = 'mythology',
  TECHNOLOGY = 'technology',
  SOCIAL_SYSTEMS = 'social_systems',
  PHILOSOPHY = 'philosophy'
}

/**
 * Options for lens generation
 */
export interface GenerationOptions {
  complexity?: 'simple' | 'moderate' | 'complex';
  preferredDomains?: string[];
  avoidDomains?: string[];
  ensureDiversity?: boolean;
}

/**
 * Usage tracking data
 */
export interface UsageData {
  domainId: string;
  lastUsed: number;
  useCount: number;
  effectiveness: number; // 0-1 score
}

/**
 * Domain library type
 */
export interface DomainLibrary {
  [key: string]: Domain;
}

/**
 * Usage tracker interface
 */
export interface IUsageTracker {
  recordUsage(domainId: string): void;
  getRecentlyUsed(limit: number): string[];
  getDomainStats(domainId: string): UsageData | null;
  getEffectiveDomains(minEffectiveness: number): string[];
  updateEffectiveness(domainId: string, score: number): void;
}