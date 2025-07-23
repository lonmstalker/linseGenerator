import {
  PromptStage,
  PromptSection,
  Example
} from './types';

export class PromptComposer {
  // Building complex prompts
  composeMultiStagePrompt(stages: PromptStage[]): string {
    // Sort stages by order
    const sortedStages = stages.sort((a, b) => a.order - b.order);
    
    const parts: string[] = [];
    
    sortedStages.forEach((stage, index) => {
      // Check condition if exists
      if (stage.condition && !this.evaluateCondition(stage.condition, stage.variables)) {
        return;
      }
      
      // Add stage separator
      if (index > 0) {
        parts.push('\n---\n');
      }
      
      // Add stage header
      parts.push(`### Stage ${index + 1}: ${stage.id}`);
      parts.push('');
      
      // Render stage template with variables
      const rendered = this.renderTemplate(stage.template, stage.variables);
      parts.push(rendered);
    });
    
    return parts.join('\n');
  }
  
  chainPrompts(prompts: string[], transitions: string[]): string {
    const parts: string[] = [];
    
    prompts.forEach((prompt, index) => {
      parts.push(prompt);
      
      if (index < prompts.length - 1 && transitions[index]) {
        parts.push('\n');
        parts.push(`➡️ ${transitions[index]}`);
        parts.push('\n');
      }
    });
    
    return parts.join('\n');
  }
  
  // Structuring
  addSection(prompt: string, section: PromptSection): string {
    const sectionText = this.formatSection(section);
    
    // Find the right place to insert based on priority
    const existingSections = this.parseSections(prompt);
    
    // Find insertion point
    const insertIndex = existingSections.findIndex(s => s.priority > section.priority);
    if (insertIndex === -1) {
      // Add at the end
      return prompt + '\n\n' + sectionText;
    }
    
    // Insert at the right position
    const before = existingSections.slice(0, insertIndex).map(s => s.text).join('\n\n');
    const after = existingSections.slice(insertIndex).map(s => s.text).join('\n\n');
    
    return [before, sectionText, after].filter(Boolean).join('\n\n');
  }
  
  formatWithMarkdown(prompt: string): string {
    let formatted = prompt;
    
    // Convert headers
    formatted = formatted.replace(/^([A-Z][A-Z\s]+):$/gm, '### $1');
    
    // Convert bullet points
    formatted = formatted.replace(/^[-•]\s+/gm, '- ');
    
    // Add emphasis to key words
    const keyWords = ['IMPORTANT', 'NOTE', 'WARNING', 'CRITICAL', 'REQUIRED'];
    keyWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      formatted = formatted.replace(regex, `**${word}**`);
    });
    
    // Format code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (_match, lang, code) => {
      return `\`\`\`${lang || ''}\n${code.trim()}\n\`\`\``;
    });
    
    return formatted;
  }
  
  addVisualSeparators(prompt: string): string {
    const sections = prompt.split(/\n\n+/);
    
    return sections.map((section, index) => {
      if (index === 0) return section;
      
      // Add appropriate separator based on content
      if (this.isMainSection(section)) {
        return `\n${'═'.repeat(50)}\n\n${section}`;
      } else if (this.isSubSection(section)) {
        return `\n${'─'.repeat(30)}\n\n${section}`;
      } else {
        return `\n\n${section}`;
      }
    }).join('');
  }
  
  // Context and examples
  injectExamples(prompt: string, examples: Example[], placement: 'inline' | 'end'): string {
    const formattedExamples = this.formatExamples(examples);
    
    if (placement === 'end') {
      return prompt + '\n\n' + formattedExamples;
    }
    
    // For inline placement, find relevant sections
    const sections = prompt.split(/\n\n+/);
    const enhancedSections = sections.map(section => {
      const relevantExamples = examples.filter(ex => 
        this.isExampleRelevant(ex, section)
      );
      
      if (relevantExamples.length > 0) {
        const exampleText = this.formatExamples(relevantExamples, true);
        return section + '\n' + exampleText;
      }
      
      return section;
    });
    
    return enhancedSections.join('\n\n');
  }
  
  addConstraints(prompt: string, constraints: string[]): string {
    if (constraints.length === 0) return prompt;
    
    const constraintSection = `
⚠️ CONSTRAINTS:
${constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}
`;
    
    // Find the best place to add constraints
    if (prompt.includes('IMPORTANT') || prompt.includes('WARNING')) {
      // Add after existing warnings
      const warningIndex = Math.max(
        prompt.lastIndexOf('IMPORTANT'),
        prompt.lastIndexOf('WARNING')
      );
      const nextNewline = prompt.indexOf('\n\n', warningIndex);
      
      if (nextNewline !== -1) {
        return prompt.slice(0, nextNewline) + constraintSection + prompt.slice(nextNewline);
      }
    }
    
    // Otherwise add before the last section
    const lastSection = prompt.lastIndexOf('\n\n');
    if (lastSection !== -1) {
      return prompt.slice(0, lastSection) + constraintSection + prompt.slice(lastSection);
    }
    
    return prompt + constraintSection;
  }
  
  includeWarnings(prompt: string, warnings: string[]): string {
    if (warnings.length === 0) return prompt;
    
    const warningSection = `
🚨 WARNINGS:
${warnings.map(w => `• ${w}`).join('\n')}
`;
    
    // Add at the beginning for visibility
    return warningSection + '\n' + prompt;
  }
  
  // Readability optimization
  breakIntoChunks(prompt: string, maxChunkSize: number): string[] {
    const chunks: string[] = [];
    const sections = prompt.split(/\n\n+/);
    
    let currentChunk = '';
    
    sections.forEach(section => {
      if (currentChunk.length + section.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = section;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + section;
      }
    });
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }
  
  highlightKeyInstructions(prompt: string, keywords: string[]): string {
    let highlighted = prompt;
    
    keywords.forEach(keyword => {
      // Create regex for whole word matching
      const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
      
      // Highlight with arrows and caps
      highlighted = highlighted.replace(regex, '👉 $1 👈');
    });
    
    return highlighted;
  }
  
  addProgressIndicators(prompt: string, totalSteps: number): string {
    const lines = prompt.split('\n');
    let stepCount = 0;
    
    const enhanced = lines.map(line => {
      if (this.isStepLine(line)) {
        stepCount++;
        const progress = `[${stepCount}/${totalSteps}]`;
        return `${progress} ${line}`;
      }
      return line;
    });
    
    // Add overall progress at the top
    const header = `📊 Total Steps: ${totalSteps}\n${'─'.repeat(30)}\n`;
    
    return header + enhanced.join('\n');
  }
  
  // Helper methods
  private evaluateCondition(condition: string, variables: Record<string, unknown>): boolean {
    // Simple condition evaluation
    try {
      // Replace variable references
      let evaluableCondition = condition;
      Object.entries(variables).forEach(([key, value]) => {
        evaluableCondition = evaluableCondition.replace(
          new RegExp(`\\$\\{${key}\\}`, 'g'),
          JSON.stringify(value)
        );
      });
      
      // Safely evaluate (in production, use a proper expression evaluator)
      return evaluableCondition.includes('true');
    } catch {
      return true; // Default to including the stage
    }
  }
  
  private renderTemplate(template: string, variables: Record<string, unknown>): string {
    let rendered = template;
    
    // Simple variable substitution
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    });
    
    // Handle conditionals (simple implementation)
    rendered = rendered.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (_match, varName, content) => {
      return variables[varName] ? content : '';
    });
    
    // Handle loops (simple implementation)
    rendered = rendered.replace(/{{#each (\w+)}}([\s\S]*?){{\/each}}/g, (_match, varName, content) => {
      const items = variables[varName];
      if (!Array.isArray(items)) return '';
      
      return items.map((item, index) => {
        let itemContent = content;
        itemContent = itemContent.replace(/{{@index}}/g, String(index + 1));
        itemContent = itemContent.replace(/{{this}}/g, String(item));
        
        // Handle object properties
        if (typeof item === 'object') {
          Object.entries(item).forEach(([key, value]) => {
            itemContent = itemContent.replace(new RegExp(`{{this.${key}}}`, 'g'), String(value));
          });
        }
        
        return itemContent.trim();
      }).join('\n');
    });
    
    return rendered;
  }
  
  private formatSection(section: PromptSection): string {
    const parts: string[] = [];
    
    if (section.icon) {
      parts.push(`${section.icon} ${section.title.toUpperCase()}`);
    } else {
      parts.push(`### ${section.title}`);
    }
    
    parts.push('');
    parts.push(section.content);
    
    return parts.join('\n');
  }
  
  private parseSections(prompt: string): Array<{ text: string; priority: number }> {
    const sections = prompt.split(/\n\n+/);
    
    return sections.map((text, index) => ({
      text,
      priority: this.guessPriority(text, index)
    }));
  }
  
  private guessPriority(text: string, position: number): number {
    // Lower priority number = higher priority
    if (text.includes('IMPORTANT') || text.includes('CRITICAL')) return 1;
    if (text.includes('WARNING') || text.includes('CAUTION')) return 2;
    if (/^#{1,3}\s/.test(text)) return 3; // Headers
    if (/^\d+\./.test(text)) return 4; // Numbered lists
    return 5 + position; // Default based on position
  }
  
  private isMainSection(section: string): boolean {
    const firstLine = section.split('\n')[0];
    return /^#{1,2}\s/.test(section) || (firstLine ? /^[A-Z\s]{10,}$/.test(firstLine) : false);
  }
  
  private isSubSection(section: string): boolean {
    return /^#{3,4}\s/.test(section) || /^\d+\./.test(section);
  }
  
  private formatExamples(examples: Example[], compact: boolean = false): string {
    const header = compact ? '💡 Example:' : '## EXAMPLES';
    
    const formatted = examples.map((ex, i) => {
      const parts: string[] = [];
      
      if (!compact) {
        parts.push(`### Example ${i + 1}`);
      }
      
      parts.push(`**Input:** ${ex.input}`);
      parts.push(`**Output:** ${ex.output}`);
      
      if (ex.explanation) {
        parts.push(`**Explanation:** ${ex.explanation}`);
      }
      
      return parts.join('\n');
    });
    
    return [header, ...formatted].join('\n\n');
  }
  
  private isExampleRelevant(example: Example, section: string): boolean {
    // Simple relevance check based on keyword matching
    const sectionWords = new Set(
      section.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );
    
    const exampleWords = new Set(
      (example.input + ' ' + example.output).toLowerCase().split(/\s+/).filter(w => w.length > 3)
    );
    
    const intersection = new Set([...sectionWords].filter(x => exampleWords.has(x)));
    
    return intersection.size > 2;
  }
  
  private isStepLine(line: string): boolean {
    return /^\d+[.)]/.test(line.trim()) || 
           /^(step|phase|stage)\s+\d+/i.test(line.trim()) ||
           /^(first|second|third|then|next|finally)/i.test(line.trim());
  }
}