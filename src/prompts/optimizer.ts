import {
  ClarityScore,
  Ambiguity,
  ComplexityMetrics,
  PriorityMap,
  KeyPoints
} from './types';

export class PromptOptimizer {
  // Analysis methods
  analyzeClarity(prompt: string): ClarityScore {
    const sentences = this.extractSentences(prompt);
    const readability = this.calculateReadability(sentences);
    const structure = this.analyzeStructure(prompt);
    const ambiguities = this.detectAmbiguities(prompt);
    
    const overall = (readability + structure + (1 - ambiguities.length * 0.1)) / 3;
    
    return {
      overall: Math.max(0, Math.min(1, overall)),
      readability,
      structure,
      ambiguityLevel: ambiguities.length,
      suggestions: this.generateClaritySuggestions(prompt, ambiguities)
    };
  }
  
  detectAmbiguities(prompt: string): Ambiguity[] {
    const ambiguities: Ambiguity[] = [];
    
    // Check for vague pronouns
    const pronouns = /\b(it|this|that|they|them|these|those)\b/gi;
    let match;
    while ((match = pronouns.exec(prompt)) !== null) {
      const context = prompt.substring(Math.max(0, match.index - 50), match.index);
      if (!this.hasRecentNoun(context)) {
        ambiguities.push({
          text: match[0],
          type: 'pronoun',
          suggestion: 'Specify what this pronoun refers to',
          severity: 'medium'
        });
      }
    }
    
    // Check for vague terms
    const vagueTerms = [
      'things', 'stuff', 'something', 'somehow', 'various', 'several',
      'many', 'few', 'some', 'often', 'sometimes', 'usually'
    ];
    
    vagueTerms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      while ((match = regex.exec(prompt)) !== null) {
        ambiguities.push({
          text: term,
          type: 'vague-term',
          suggestion: `Replace "${term}" with specific details`,
          severity: 'low'
        });
      }
    });
    
    return ambiguities;
  }
  
  measureComplexity(prompt: string): ComplexityMetrics {
    const sentences = this.extractSentences(prompt);
    const words = prompt.split(/\s+/);
    
    // Average sentence length
    const avgSentenceLength = words.length / sentences.length;
    const sentenceComplexity = Math.min(1, avgSentenceLength / 30);
    
    // Vocabulary complexity (based on word length)
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const vocabularyLevel = Math.min(1, avgWordLength / 8);
    
    // Structural depth (nesting level)
    const structuralDepth = this.calculateNestingDepth(prompt);
    
    // Cognitive load (combination of factors)
    const cognitiveLoad = (sentenceComplexity + vocabularyLevel + structuralDepth) / 3;
    
    return {
      sentenceComplexity,
      vocabularyLevel,
      structuralDepth,
      cognitiveLoad
    };
  }
  
  // Improvement methods
  simplifyLanguage(prompt: string): string {
    let simplified = prompt;
    
    // Replace complex words with simpler alternatives
    const replacements = new Map([
      ['utilize', 'use'],
      ['implement', 'do'],
      ['demonstrate', 'show'],
      ['facilitate', 'help'],
      ['comprehend', 'understand'],
      ['subsequent', 'next'],
      ['preceding', 'previous'],
      ['commence', 'start'],
      ['terminate', 'end'],
      ['aforementioned', 'mentioned'],
      ['heretofore', 'before'],
      ['henceforth', 'from now on']
    ]);
    
    replacements.forEach((simple, complex) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplified = simplified.replace(regex, simple);
    });
    
    // Break long sentences
    simplified = this.breakLongSentences(simplified);
    
    return simplified;
  }
  
  clarifyInstructions(prompt: string): string {
    let clarified = prompt;
    
    // Add explicit step numbers if not present
    const lines = clarified.split('\n');
    let stepCount = 1;
    
    clarified = lines.map(line => {
      if (this.isInstruction(line) && !this.hasStepNumber(line)) {
        return `${stepCount++}. ${line}`;
      }
      return line;
    }).join('\n');
    
    // Add clear action verbs
    clarified = this.ensureActionVerbs(clarified);
    
    // Add explicit outcomes
    clarified = this.addExpectedOutcomes(clarified);
    
    return clarified;
  }
  
  removeRedundancy(prompt: string): string {
    const sentences = this.extractSentences(prompt);
    const uniqueSentences: string[] = [];
    const seenConcepts = new Set<string>();
    
    sentences.forEach(sentence => {
      const concept = this.extractConcept(sentence);
      if (!seenConcepts.has(concept)) {
        uniqueSentences.push(sentence);
        seenConcepts.add(concept);
      }
    });
    
    return uniqueSentences.join(' ');
  }
  
  // Structural optimization
  reorderSections(prompt: string, priorityMap: PriorityMap): string {
    const sections = this.extractSections(prompt);
    
    // Sort sections by priority
    sections.sort((a, b) => {
      const priorityA = priorityMap[a.id] || 999;
      const priorityB = priorityMap[b.id] || 999;
      return priorityA - priorityB;
    });
    
    // Rebuild prompt with reordered sections
    return sections.map(section => section.content).join('\n\n');
  }
  
  consolidateSimilarInstructions(prompt: string): string {
    const instructions = this.extractInstructions(prompt);
    const grouped = this.groupSimilarInstructions(instructions);
    
    // Rebuild with consolidated instructions
    let consolidated = prompt;
    grouped.forEach(group => {
      if (group.length > 1) {
        const combined = this.combineInstructions(group);
        // Replace the first occurrence and remove others
        const firstInstruction = group[0];
        if (firstInstruction) {
          consolidated = consolidated.replace(firstInstruction, combined);
          group.slice(1).forEach(instruction => {
            consolidated = consolidated.replace(instruction, '');
          });
        }
      }
    });
    
    // Clean up extra whitespace
    return consolidated.replace(/\n{3,}/g, '\n\n').trim();
  }
  
  extractKeyPoints(prompt: string): KeyPoints {
    const sentences = this.extractSentences(prompt);
    const points: KeyPoints = {
      main: [],
      secondary: [],
      warnings: []
    };
    
    sentences.forEach(sentence => {
      if (this.isWarning(sentence)) {
        points.warnings.push(sentence);
      } else if (this.isMainPoint(sentence)) {
        points.main.push(sentence);
      } else {
        points.secondary.push(sentence);
      }
    });
    
    return points;
  }
  
  // Helper methods
  private extractSentences(text: string): string[] {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  }
  
  private calculateReadability(sentences: string[]): number {
    const avgLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    // Simple readability score based on average sentence length
    return Math.max(0, 1 - (avgLength - 15) / 30);
  }
  
  private analyzeStructure(prompt: string): number {
    const hasHeaders = /^#+\s/m.test(prompt) || /^[A-Z\s]+:$/m.test(prompt);
    const hasBullets = /^[-*•]\s/m.test(prompt);
    const hasNumbers = /^\d+[.)]\s/m.test(prompt);
    const hasSections = /\n\n/.test(prompt);
    
    const structureScore = [hasHeaders, hasBullets, hasNumbers, hasSections]
      .filter(Boolean).length / 4;
    
    return structureScore;
  }
  
  private hasRecentNoun(context: string): boolean {
    const nouns = context.match(/\b[A-Z][a-z]+\b|\b(problem|solution|idea|concept|method|approach)\b/g);
    return nouns !== null && nouns.length > 0;
  }
  
  private generateClaritySuggestions(prompt: string, ambiguities: Ambiguity[]): string[] {
    const suggestions: string[] = [];
    
    if (ambiguities.length > 3) {
      suggestions.push('Reduce ambiguous pronouns by using specific nouns');
    }
    
    const sentences = this.extractSentences(prompt);
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
    if (longSentences.length > 0) {
      suggestions.push(`Break down ${longSentences.length} long sentences`);
    }
    
    if (!prompt.includes('\n')) {
      suggestions.push('Add paragraph breaks for better readability');
    }
    
    return suggestions;
  }
  
  private calculateNestingDepth(prompt: string): number {
    const lines = prompt.split('\n');
    let maxDepth = 0;
    let currentDepth = 0;
    
    lines.forEach(line => {
      const leadingSpaces = line.match(/^ */)?.[0].length || 0;
      currentDepth = Math.floor(leadingSpaces / 2);
      maxDepth = Math.max(maxDepth, currentDepth);
    });
    
    return Math.min(1, maxDepth / 5);
  }
  
  private breakLongSentences(text: string): string {
    const sentences = this.extractSentences(text);
    
    return sentences.map(sentence => {
      const words = sentence.split(/\s+/);
      if (words.length > 25) {
        // Find natural breaking points
        const midPoint = Math.floor(words.length / 2);
        const breakWords = ['and', 'but', 'however', 'therefore', 'which', 'that'];
        
        for (let i = midPoint - 5; i < midPoint + 5; i++) {
          const word = words[i]?.toLowerCase();
          if (word && breakWords.includes(word)) {
            const firstPart = words.slice(0, i).join(' ');
            const secondPart = words.slice(i).join(' ');
            return `${firstPart}. ${secondPart.charAt(0).toUpperCase() + secondPart.slice(1)}`;
          }
        }
      }
      return sentence;
    }).join('. ') + '.';
  }
  
  private isInstruction(line: string): boolean {
    const instructionPatterns = [
      /^(create|make|generate|build|design|develop|write)/i,
      /^(analyze|evaluate|assess|review|check)/i,
      /^(ensure|verify|confirm|validate)/i,
      /^(add|include|insert|append)/i,
      /^(use|apply|implement|follow)/i
    ];
    
    return instructionPatterns.some(pattern => pattern.test(line.trim()));
  }
  
  private hasStepNumber(line: string): boolean {
    return /^\d+[.)]\s/.test(line.trim());
  }
  
  private ensureActionVerbs(text: string): string {
    const weakVerbs = new Map([
      ['should', 'must'],
      ['could', 'can'],
      ['might', 'will'],
      ['try to', ''],
      ['attempt to', '']
    ]);
    
    let improved = text;
    weakVerbs.forEach((strong, weak) => {
      const regex = new RegExp(`\\b${weak}\\b`, 'gi');
      improved = improved.replace(regex, strong);
    });
    
    return improved;
  }
  
  private addExpectedOutcomes(text: string): string {
    const sections = text.split('\n\n');
    
    return sections.map(section => {
      if (this.isInstructionSection(section) && !section.includes('result') && !section.includes('outcome')) {
        return section + '\n→ Expected outcome: Clear, actionable result';
      }
      return section;
    }).join('\n\n');
  }
  
  private extractConcept(sentence: string): string {
    // Simple concept extraction based on key words
    const words = sentence.toLowerCase().split(/\s+/);
    const keywords = words.filter(w => w.length > 4 && !this.isCommonWord(w));
    return keywords.sort().join(',');
  }
  
  private isCommonWord(word: string): boolean {
    const common = new Set([
      'that', 'this', 'with', 'from', 'have', 'will', 'would',
      'could', 'should', 'about', 'there', 'where', 'which', 'their'
    ]);
    return common.has(word);
  }
  
  private extractSections(prompt: string): Array<{ id: string; content: string }> {
    const sections = prompt.split(/\n\n+/);
    
    return sections.map((section, index) => {
      const firstLine = section.split('\n')[0] || '';
      const id = firstLine.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || `section_${index}`;
      return { id, content: section };
    });
  }
  
  private extractInstructions(prompt: string): string[] {
    const lines = prompt.split('\n');
    return lines.filter(line => this.isInstruction(line));
  }
  
  private groupSimilarInstructions(instructions: string[]): string[][] {
    const groups: string[][] = [];
    const used = new Set<number>();
    
    instructions.forEach((instruction, i) => {
      if (used.has(i)) return;
      
      const group = [instruction];
      used.add(i);
      
      instructions.forEach((other, j) => {
        if (i !== j && !used.has(j) && this.areSimilar(instruction, other)) {
          group.push(other);
          used.add(j);
        }
      });
      
      if (group.length > 1) {
        groups.push(group);
      }
    });
    
    return groups;
  }
  
  private areSimilar(a: string, b: string): boolean {
    const wordsA = new Set(a.toLowerCase().split(/\s+/));
    const wordsB = new Set(b.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
    const union = new Set([...wordsA, ...wordsB]);
    
    const similarity = intersection.size / union.size;
    return similarity > 0.5;
  }
  
  private combineInstructions(instructions: string[]): string {
    // Find common pattern and combine
    const commonWords = this.findCommonWords(instructions);
    const uniqueParts = instructions.map(inst => 
      inst.split(/\s+/).filter(word => !commonWords.has(word.toLowerCase())).join(' ')
    );
    
    const firstInstruction = instructions[0];
    if (!firstInstruction) {
      return uniqueParts.join(', ');
    }
    
    const base = firstInstruction.split(/\s+/)
      .filter(word => commonWords.has(word.toLowerCase()))
      .join(' ');
    
    if (!base) {
      return uniqueParts.join(', ');
    }
    return `${base} (${uniqueParts.join(', ')})`;
  }
  
  private findCommonWords(sentences: string[]): Set<string> {
    const wordSets = sentences.map(s => new Set(s.toLowerCase().split(/\s+/)));
    
    return wordSets.reduce((common, set) => {
      return new Set([...common].filter(word => set.has(word)));
    });
  }
  
  private isWarning(sentence: string): boolean {
    const warningPatterns = [
      /\b(warning|caution|important|critical|note|attention|beware|avoid)\b/i,
      /^⚠️|^❗|^🚨/,
      /\b(do not|don't|never|must not)\b/i
    ];
    
    return warningPatterns.some(pattern => pattern.test(sentence));
  }
  
  private isMainPoint(sentence: string): boolean {
    const mainPatterns = [
      /^(first|second|third|finally|most importantly)/i,
      /\b(key|main|primary|essential|crucial|critical)\b/i,
      /^\d+[.)]/,
      /^[A-Z]{2,}/
    ];
    
    return mainPatterns.some(pattern => pattern.test(sentence));
  }
  
  private isInstructionSection(section: string): boolean {
    const lines = section.split('\n');
    const instructionCount = lines.filter(line => this.isInstruction(line)).length;
    return instructionCount / lines.length > 0.5;
  }
}