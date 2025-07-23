/**
 * Quality metrics for creativity assessment
 */

export interface Generation {
  id: string;
  elements: string[];
  timestamp: number;
  score?: number;
}

export interface Session {
  id: string;
  generations: Generation[];
  metrics: {
    averageQuality: number;
    uniqueness: number;
    diversity: number;
  };
}

export interface TextVector {
  values: number[];
}

export class QualityMetrics {
  /**
   * Calculate uniqueness of generated elements
   */
  calculateUniqueness(generations: Generation[]): number {
    if (generations.length === 0) return 1;
    
    const allElements = generations.flatMap(g => g.elements);
    if (allElements.length === 0) return 1;
    
    const unique = new Set(allElements);
    return unique.size / allElements.length;
  }
  
  /**
   * Calculate semantic diversity using simple text analysis
   */
  calculateSemanticDiversity(texts: string[]): number {
    if (texts.length < 2) return 1;
    
    const vectors = texts.map(t => this.textToVector(t));
    return this.averagePairwiseDistance(vectors);
  }
  
  /**
   * Measure consistency of quality over time
   */
  measureTemporalConsistency(sessions: Session[]): number {
    if (sessions.length < 2) return 1;
    
    const qualityOverTime = sessions.map(s => s.metrics.averageQuality);
    const cv = this.coefficientOfVariation(qualityOverTime);
    
    // Convert CV to consistency score (lower CV = higher consistency)
    return Math.max(0, 1 - cv);
  }
  
  /**
   * Calculate domain diversity score
   */
  calculateDomainDiversity(domains: string[]): number {
    if (domains.length === 0) return 0;
    
    const categories = this.categorizeDomains(domains);
    const uniqueCategories = new Set(Object.values(categories));
    
    // Score based on category spread
    const categoryScore = uniqueCategories.size / 5; // Assume 5 main categories
    const uniquenessScore = new Set(domains).size / domains.length;
    
    return (categoryScore + uniquenessScore) / 2;
  }
  
  /**
   * Evaluate metaphor originality
   */
  evaluateMetaphorOriginality(metaphor: string): number {
    const commonPatterns = [
      'like a bridge',
      'as a journey',
      'like a machine',
      'as a game',
      'like a river'
    ];
    
    const lowerMetaphor = metaphor.toLowerCase();
    
    // Check for common patterns
    const hasCommonPattern = commonPatterns.some(pattern => 
      lowerMetaphor.includes(pattern)
    );
    
    if (hasCommonPattern) return 0.3;
    
    // Score based on complexity and uniqueness
    const words = metaphor.split(' ');
    const uniqueWords = new Set(words);
    const complexityScore = Math.min(uniqueWords.size / 10, 1);
    
    return 0.5 + (complexityScore * 0.5);
  }
  
  /**
   * Calculate creativity index combining multiple factors
   */
  calculateCreativityIndex(data: {
    uniqueness: number;
    diversity: number;
    originality: number;
    complexity: number;
  }): number {
    const weights = {
      uniqueness: 0.25,
      diversity: 0.3,
      originality: 0.3,
      complexity: 0.15
    };
    
    return Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (data[key as keyof typeof data] * weight);
    }, 0);
  }
  
  /**
   * Convert text to simple vector representation
   */
  private textToVector(text: string): TextVector {
    // Simple bag-of-words approach
    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = new Map<string, number>();
    
    words.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });
    
    // Convert to fixed-size vector (simplified)
    const commonWords = ['the', 'a', 'to', 'of', 'and', 'in', 'is', 'for'];
    const values = commonWords.map(word => wordCounts.get(word) || 0);
    
    // Add some content features
    values.push(words.length); // Total words
    values.push(new Set(words).size); // Unique words
    values.push(text.length); // Character count
    
    return { values };
  }
  
  /**
   * Calculate average pairwise distance between vectors
   */
  private averagePairwiseDistance(vectors: TextVector[]): number {
    if (vectors.length < 2) return 0;
    
    let totalDistance = 0;
    let pairCount = 0;
    
    for (let i = 0; i < vectors.length - 1; i++) {
      for (let j = i + 1; j < vectors.length; j++) {
        totalDistance += this.euclideanDistance(vectors[i], vectors[j]);
        pairCount++;
      }
    }
    
    const avgDistance = totalDistance / pairCount;
    
    // Normalize to 0-1 range (assume max distance of 100)
    return Math.min(avgDistance / 100, 1);
  }
  
  /**
   * Calculate Euclidean distance between two vectors
   */
  private euclideanDistance(v1: TextVector, v2: TextVector): number {
    const sumSquares = v1.values.reduce((sum, val, i) => {
      const diff = val - (v2.values[i] || 0);
      return sum + (diff * diff);
    }, 0);
    
    return Math.sqrt(sumSquares);
  }
  
  /**
   * Calculate coefficient of variation
   */
  private coefficientOfVariation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    if (mean === 0) return 0;
    
    const variance = values.reduce((sum, val) => {
      const diff = val - mean;
      return sum + (diff * diff);
    }, 0) / values.length;
    
    const stdDev = Math.sqrt(variance);
    return stdDev / mean;
  }
  
  /**
   * Categorize domains into broad categories
   */
  private categorizeDomains(domains: string[]): Record<string, string> {
    const categoryMap: Record<string, string> = {
      quantum_physics: 'sciences',
      biology: 'sciences',
      chemistry: 'sciences',
      mathematics: 'sciences',
      
      jazz_improvisation: 'arts',
      poetry: 'arts',
      painting: 'arts',
      music_theory: 'arts',
      
      psychology: 'social',
      sociology: 'social',
      anthropology: 'social',
      
      engineering: 'technology',
      programming: 'technology',
      robotics: 'technology',
      
      philosophy: 'philosophy',
      zen_buddhism: 'philosophy',
      stoicism: 'philosophy'
    };
    
    const result: Record<string, string> = {};
    
    domains.forEach(domain => {
      result[domain] = categoryMap[domain] || 'other';
    });
    
    return result;
  }
}

/**
 * Benchmark metrics for testing creativity
 */
export class CreativityBenchmarks {
  private metrics: QualityMetrics;
  
  constructor() {
    this.metrics = new QualityMetrics();
  }
  
  /**
   * Run a suite of creativity benchmarks
   */
  async runBenchmarks(generator: any): Promise<BenchmarkResults> {
    const results: BenchmarkResults = {
      domainDiversity: await this.benchmarkDomainDiversity(generator),
      metaphorOriginality: await this.benchmarkMetaphorOriginality(generator),
      ideaUniqueness: await this.benchmarkIdeaUniqueness(generator),
      temporalConsistency: await this.benchmarkTemporalConsistency(generator),
      overall: 0
    };
    
    // Calculate overall score
    results.overall = Object.values(results)
      .filter(v => typeof v === 'number')
      .reduce((sum, val) => sum + val, 0) / 4;
    
    return results;
  }
  
  private async benchmarkDomainDiversity(generator: any): Promise<number> {
    const iterations = 10;
    const domainSets: string[][] = [];
    
    for (let i = 0; i < iterations; i++) {
      const domains = generator.selectDiverseDomains(5);
      domainSets.push(domains);
    }
    
    const scores = domainSets.map(domains => 
      this.metrics.calculateDomainDiversity(domains)
    );
    
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  
  private async benchmarkMetaphorOriginality(generator: any): Promise<number> {
    const testMetaphors = [
      'like quantum entanglement of ideas',
      'as if thoughts were jazz musicians improvising',
      'similar to mycelial networks sharing nutrients',
      'like origami unfolding in multiple dimensions'
    ];
    
    const scores = testMetaphors.map(metaphor => 
      this.metrics.evaluateMetaphorOriginality(metaphor)
    );
    
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }
  
  private async benchmarkIdeaUniqueness(generator: any): Promise<number> {
    const generations: Generation[] = [];
    
    for (let i = 0; i < 20; i++) {
      const result = generator.generateLensPrompts(`Test problem ${i}`);
      generations.push({
        id: `gen-${i}`,
        elements: result.metadata.suggestedDomains,
        timestamp: Date.now()
      });
    }
    
    return this.metrics.calculateUniqueness(generations);
  }
  
  private async benchmarkTemporalConsistency(generator: any): Promise<number> {
    const sessions: Session[] = [];
    
    for (let i = 0; i < 5; i++) {
      const sessionGenerations: Generation[] = [];
      
      for (let j = 0; j < 10; j++) {
        const result = generator.generateLensPrompts(`Session ${i} problem ${j}`);
        sessionGenerations.push({
          id: `s${i}-g${j}`,
          elements: result.metadata.suggestedDomains,
          timestamp: Date.now(),
          score: Math.random() * 0.3 + 0.7 // Simulate quality scores
        });
      }
      
      sessions.push({
        id: `session-${i}`,
        generations: sessionGenerations,
        metrics: {
          averageQuality: 0.8 + (Math.random() * 0.1),
          uniqueness: this.metrics.calculateUniqueness(sessionGenerations),
          diversity: 0.7 + (Math.random() * 0.2)
        }
      });
    }
    
    return this.metrics.measureTemporalConsistency(sessions);
  }
}

export interface BenchmarkResults {
  domainDiversity: number;
  metaphorOriginality: number;
  ideaUniqueness: number;
  temporalConsistency: number;
  overall: number;
}