export interface PromptTemplate {
  id: string;
  name: string;
  category: 'lens' | 'evolution' | 'hybrid' | 'evaluation';
  version: string;
  template: string;
  variables: PromptVariable[];
  examples: PromptExample[];
  metadata: {
    author: string;
    created: number;
    lastModified: number;
    usageCount: number;
    effectivenessScore: number;
    tags: string[];
  };
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: unknown;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: unknown[];
  };
}

export interface PromptExample {
  input: Record<string, unknown>;
  expectedOutput: string;
  quality: 'excellent' | 'good' | 'acceptable';
}

export interface PromptRenderContext {
  variables: Record<string, unknown>;
  sessionContext?: unknown;
  userPreferences?: UserPreferences;
  locale?: string;
}

export interface RenderedPrompt {
  prompt: string;
  templateId: string;
  timestamp: number;
  variables: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    variable: string;
    message: string;
  }>;
  warnings: Array<{
    variable: string;
    message: string;
  }>;
}

export interface UserPreferences {
  preferredStyle?: 'concise' | 'detailed' | 'balanced';
  preferredStructure?: 'bullet-points' | 'paragraphs' | 'mixed';
  includeEmojis?: boolean;
  emphasizeExamples?: boolean;
}

export interface Feedback {
  quality: 1 | 2 | 3 | 4 | 5;
  effectiveness: boolean;
  issues?: string[];
  suggestions?: string[];
}

export interface TemplateMetrics {
  usageCount: number;
  averageQualityScore: number;
  successRate: number;
  commonIssues: string[];
  lastUsed: number;
}

export interface Improvement {
  type: 'clarity' | 'structure' | 'examples' | 'instructions';
  description: string;
  priority: 'high' | 'medium' | 'low';
  suggestedChange: string;
}

export interface TemplateChanges {
  template?: string;
  variables?: PromptVariable[];
  examples?: PromptExample[];
  metadata?: Partial<PromptTemplate['metadata']>;
}

export interface PromptStage {
  id: string;
  template: string;
  variables: Record<string, unknown>;
  order: number;
  condition?: string;
}

export interface PromptSection {
  title: string;
  content: string;
  icon?: string;
  priority: number;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface ClarityScore {
  overall: number;
  readability: number;
  structure: number;
  ambiguityLevel: number;
  suggestions: string[];
}

export interface Ambiguity {
  text: string;
  type: 'pronoun' | 'vague-term' | 'unclear-reference' | 'missing-context';
  suggestion: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ComplexityMetrics {
  sentenceComplexity: number;
  vocabularyLevel: number;
  structuralDepth: number;
  cognitiveLoad: number;
}

export interface PriorityMap {
  [sectionId: string]: number;
}

export interface KeyPoints {
  main: string[];
  secondary: string[];
  warnings: string[];
}