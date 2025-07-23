import {
  PromptTemplate,
  PromptRenderContext,
  RenderedPrompt,
  ValidationResult,
  UserPreferences,
  Feedback,
  TemplateMetrics,
  Improvement,
  TemplateChanges
} from './types';
import { PromptOptimizer } from './optimizer';
import { PromptComposer } from './composer';
import * as yaml from 'js-yaml';
import * as fs from 'fs/promises';
import * as path from 'path';

export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();
  private optimizer: PromptOptimizer;
  private composer: PromptComposer;
  private templatesPath: string;
  private analytics: Map<string, TemplateMetrics> = new Map();
  
  constructor(templatesPath: string = './templates') {
    this.optimizer = new PromptOptimizer();
    this.composer = new PromptComposer();
    this.templatesPath = templatesPath;
  }
  
  // Template loading and management
  async loadTemplates(): Promise<void> {
    try {
      const files = await fs.readdir(this.templatesPath);
      const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
      
      for (const file of yamlFiles) {
        const filePath = path.join(this.templatesPath, file);
        const content = await fs.readFile(filePath, 'utf8');
        const template = yaml.load(content) as PromptTemplate;
        
        // Validate template structure
        if (this.validateTemplate(template)) {
          this.templates.set(template.id, template);
          // Initialize analytics if not exists
          if (!this.analytics.has(template.id)) {
            this.analytics.set(template.id, {
              usageCount: 0,
              averageQualityScore: 0,
              successRate: 0,
              commonIssues: [],
              lastUsed: 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }
  
  getTemplate(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }
  
  getTemplatesByCategory(category: string): PromptTemplate[] {
    return Array.from(this.templates.values())
      .filter(t => t.category === category);
  }
  
  // Rendering
  async renderPrompt(
    templateId: string,
    context: PromptRenderContext
  ): Promise<RenderedPrompt> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Validate variables
    const validation = this.validateVariables(template, context.variables);
    if (!validation.valid) {
      throw new Error(`Invalid variables: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    // Render the prompt
    let prompt = template.template;
    
    // Simple variable substitution
    Object.entries(context.variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      prompt = prompt.replace(regex, String(value));
    });
    
    // Apply user preferences
    if (context.userPreferences) {
      prompt = this.applyUserPreferences(prompt, context.userPreferences);
    }
    
    // Optimize if enabled
    if (context.userPreferences?.preferredStyle === 'concise') {
      prompt = this.optimizer.simplifyLanguage(prompt);
    }
    
    // Update analytics
    this.trackUsage(templateId);
    
    return {
      prompt,
      templateId,
      timestamp: Date.now(),
      variables: context.variables
    };
  }
  
  // Validation
  validateVariables(
    template: PromptTemplate,
    variables: Record<string, unknown>
  ): ValidationResult {
    const errors: Array<{ variable: string; message: string }> = [];
    const warnings: Array<{ variable: string; message: string }> = [];
    
    // Check required variables
    template.variables.forEach(varDef => {
      const value = variables[varDef.name];
      
      if (varDef.required && value === undefined) {
        errors.push({
          variable: varDef.name,
          message: `Required variable '${varDef.name}' is missing`
        });
        return;
      }
      
      if (value !== undefined) {
        // Type validation
        if (!this.validateType(value, varDef.type)) {
          errors.push({
            variable: varDef.name,
            message: `Variable '${varDef.name}' should be of type ${varDef.type}`
          });
        }
        
        // Additional validation
        if (varDef.validation) {
          const validationResult = this.validateConstraints(value, varDef.validation);
          if (!validationResult.valid) {
            errors.push({
              variable: varDef.name,
              message: validationResult.message
            });
          }
        }
      }
    });
    
    // Check for extra variables
    Object.keys(variables).forEach(key => {
      if (!template.variables.find(v => v.name === key)) {
        warnings.push({
          variable: key,
          message: `Unknown variable '${key}'`
        });
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // Feedback and improvement
  async recordFeedback(
    templateId: string,
    _renderedPrompt: RenderedPrompt,
    feedback: Feedback
  ): Promise<void> {
    const metrics = this.analytics.get(templateId);
    if (!metrics) return;
    
    // Update metrics
    const totalRatings = metrics.usageCount * metrics.averageQualityScore;
    metrics.averageQualityScore = (totalRatings + feedback.quality) / (metrics.usageCount + 1);
    
    if (feedback.effectiveness) {
      const successCount = metrics.successRate * metrics.usageCount;
      metrics.successRate = (successCount + 1) / (metrics.usageCount + 1);
    } else {
      const successCount = metrics.successRate * metrics.usageCount;
      metrics.successRate = successCount / (metrics.usageCount + 1);
    }
    
    // Track common issues
    if (feedback.issues) {
      feedback.issues.forEach(issue => {
        if (!metrics.commonIssues.includes(issue)) {
          metrics.commonIssues.push(issue);
        }
      });
    }
  }
  
  suggestImprovements(templateId: string): Improvement[] {
    const template = this.templates.get(templateId);
    const metrics = this.analytics.get(templateId);
    if (!template || !metrics) return [];
    
    const improvements: Improvement[] = [];
    
    // Analyze clarity
    const clarity = this.optimizer.analyzeClarity(template.template);
    if (clarity.overall < 0.7) {
      improvements.push({
        type: 'clarity',
        description: 'Template has clarity issues',
        priority: 'high',
        suggestedChange: clarity.suggestions.join('\n')
      });
    }
    
    // Check for missing examples
    if (template.examples.length < 2) {
      improvements.push({
        type: 'examples',
        description: 'Template needs more examples',
        priority: 'medium',
        suggestedChange: 'Add at least 2 more examples to demonstrate usage'
      });
    }
    
    // Check effectiveness
    if (metrics.averageQualityScore < 3) {
      improvements.push({
        type: 'structure',
        description: 'Template has low quality ratings',
        priority: 'high',
        suggestedChange: 'Review template structure and instructions based on user feedback'
      });
    }
    
    // Check for common issues
    if (metrics.commonIssues.length > 3) {
      improvements.push({
        type: 'instructions',
        description: 'Users frequently report issues',
        priority: 'high',
        suggestedChange: `Address these common issues: ${metrics.commonIssues.join(', ')}`
      });
    }
    
    return improvements;
  }
  
  async updateTemplate(
    templateId: string,
    changes: TemplateChanges
  ): Promise<void> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Apply changes
    if (changes.template !== undefined) {
      template.template = changes.template;
    }
    if (changes.variables !== undefined) {
      template.variables = changes.variables;
    }
    if (changes.examples !== undefined) {
      template.examples = changes.examples;
    }
    if (changes.metadata !== undefined) {
      Object.assign(template.metadata, changes.metadata);
    }
    
    // Update version and timestamp
    const version = template.version.split('.');
    const patchVersion = version[2];
    if (patchVersion !== undefined) {
      version[2] = String(parseInt(patchVersion) + 1);
      template.version = version.join('.');
    }
    template.metadata.lastModified = Date.now();
    
    // Save to disk
    await this.saveTemplate(template);
  }
  
  // Template optimization
  async optimizeTemplate(templateId: string): Promise<TemplateChanges> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    const changes: TemplateChanges = {};
    
    // Optimize the template text
    const optimized = this.optimizer.simplifyLanguage(template.template);
    const clarified = this.optimizer.clarifyInstructions(optimized);
    const final = this.optimizer.removeRedundancy(clarified);
    
    if (final !== template.template) {
      changes.template = final;
    }
    
    // Suggest variable improvements
    const improvedVariables = template.variables.map(v => {
      if (!v.description || v.description.length < 10) {
        return {
          ...v,
          description: `Please provide ${v.type} value for ${v.name}`
        };
      }
      return v;
    });
    
    if (JSON.stringify(improvedVariables) !== JSON.stringify(template.variables)) {
      changes.variables = improvedVariables;
    }
    
    return changes;
  }
  
  // Helper methods
  private validateTemplate(template: unknown): boolean {
    if (!template || typeof template !== 'object') return false;
    const t = template as Record<string, unknown>;
    return Boolean(
      t.id &&
      t.name &&
      t.category &&
      t.version &&
      t.template &&
      Array.isArray(t.variables) &&
      Array.isArray(t.examples) &&
      t.metadata
    );
  }
  
  private validateType(value: unknown, type: string): boolean {
    switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number';
    case 'array':
      return Array.isArray(value);
    case 'object':
      return typeof value === 'object' && !Array.isArray(value);
    default:
      return true;
    }
  }
  
  private validateConstraints(
    value: unknown,
    validation: PromptTemplate['variables'][0]['validation']
  ): { valid: boolean; message: string } {
    if (!validation) return { valid: true, message: '' };
    
    if (typeof value === 'string') {
      if (validation.minLength && value.length < validation.minLength) {
        return {
          valid: false,
          message: `Minimum length is ${validation.minLength}`
        };
      }
      if (validation.maxLength && value.length > validation.maxLength) {
        return {
          valid: false,
          message: `Maximum length is ${validation.maxLength}`
        };
      }
      if (validation.pattern) {
        const regex = new RegExp(validation.pattern);
        if (!regex.test(value)) {
          return {
            valid: false,
            message: `Does not match pattern ${validation.pattern}`
          };
        }
      }
    }
    
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) {
        return {
          valid: false,
          message: `Minimum value is ${validation.min}`
        };
      }
      if (validation.max !== undefined && value > validation.max) {
        return {
          valid: false,
          message: `Maximum value is ${validation.max}`
        };
      }
    }
    
    if (validation.enum && !validation.enum.includes(value)) {
      return {
        valid: false,
        message: `Must be one of: ${validation.enum.join(', ')}`
      };
    }
    
    return { valid: true, message: '' };
  }
  
  private applyUserPreferences(
    prompt: string,
    preferences: UserPreferences
  ): string {
    let result = prompt;
    
    // Apply structure preference
    if (preferences.preferredStructure === 'bullet-points') {
      result = this.convertToBulletPoints(result);
    } else if (preferences.preferredStructure === 'paragraphs') {
      result = this.convertToParagraphs(result);
    }
    
    // Apply emoji preference
    if (!preferences.includeEmojis) {
      result = this.removeEmojis(result);
    }
    
    // Apply example emphasis
    if (preferences.emphasizeExamples) {
      result = this.composer.highlightKeyInstructions(result, ['example', 'for instance', 'such as']);
    }
    
    return result;
  }
  
  private convertToBulletPoints(text: string): string {
    const lines = text.split('\n');
    return lines.map(line => {
      if (line.trim() && !line.startsWith('-') && !line.startsWith('*') && !line.startsWith('•')) {
        return `• ${line}`;
      }
      return line;
    }).join('\n');
  }
  
  private convertToParagraphs(text: string): string {
    return text.replace(/^[-*•]\s+/gm, '');
  }
  
  private removeEmojis(text: string): string {
    return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  }
  
  private trackUsage(templateId: string): void {
    const metrics = this.analytics.get(templateId);
    if (metrics) {
      metrics.usageCount++;
      metrics.lastUsed = Date.now();
    }
    
    const template = this.templates.get(templateId);
    if (template) {
      template.metadata.usageCount++;
    }
  }
  
  private async saveTemplate(template: PromptTemplate): Promise<void> {
    const filePath = path.join(this.templatesPath, `${template.id}.yaml`);
    const content = yaml.dump(template);
    await fs.writeFile(filePath, content, 'utf8');
  }
}