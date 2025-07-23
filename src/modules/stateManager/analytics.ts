import {
  Session,
  SessionReport,
  TrendData,
  DomainStats,
  PatternAnalysis,
} from './types';
import { METRICS_CONFIG } from './config';

export class SessionAnalytics {
  calculateCreativityTrend(session: Session): TrendData {
    const recentLenses = session.context.generatedLenses
      .slice(-METRICS_CONFIG.sampleWindowSize)
      .map((lens, index) => {
        // Simple creativity score based on domain diversity and recency
        const uniqueDomains = new Set(lens.domains).size;
        const recencyBonus = index / METRICS_CONFIG.sampleWindowSize;
        return (uniqueDomains * 20 + recencyBonus * 10);
      });

    if (recentLenses.length < 2) {
      return {
        direction: 'stable',
        rate: 0,
        confidence: 0,
        recentValues: recentLenses,
      };
    }

    // Calculate trend using linear regression
    const n = recentLenses.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = recentLenses.reduce((a, b) => a + b, 0);
    const sumXY = recentLenses.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const confidence = Math.min(1, Math.abs(slope) / 10);

    return {
      direction: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable',
      rate: slope,
      confidence,
      recentValues: recentLenses,
    };
  }

  findMostEffectiveDomains(session: Session): DomainStats[] {
    const domainMap = new Map<string, {
      count: number;
      scores: number[];
      lastUsed: number;
    }>();

    // Analyze lenses
    session.context.generatedLenses.forEach(lens => {
      lens.domains.forEach(domain => {
        const existing = domainMap.get(domain) || {
          count: 0,
          scores: [],
          lastUsed: 0,
        };
        
        existing.count++;
        existing.lastUsed = Math.max(existing.lastUsed, lens.timestamp);
        // Simple effectiveness score
        existing.scores.push(50 + Math.random() * 50);
        
        domainMap.set(domain, existing);
      });
    });

    // Convert to stats array
    return Array.from(domainMap.entries())
      .map(([domain, data]) => ({
        domain,
        usageCount: data.count,
        averageCreativityScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        successRate: 0.7 + Math.random() * 0.3, // Placeholder
        lastUsed: data.lastUsed,
      }))
      .sort((a, b) => b.averageCreativityScore - a.averageCreativityScore);
  }

  analyzeEvolutionPatterns(session: Session): PatternAnalysis {
    const patternCounts = new Map<string, number>();
    const combinations = new Map<string, { count: number; outcomes: string[] }>();

    // Analyze evolution chains
    session.context.evolutionChains.forEach(chain => {
      // Track stage progression patterns
      const pattern = chain.stages
        .map(s => s?.madnessLevel || 0)
        .join('-');
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
    });

    // Analyze hybrid combinations
    session.context.hybridAttempts.forEach(hybrid => {
      const combo = [hybrid.method].sort().join('+');
      const existing = combinations.get(combo) || { count: 0, outcomes: [] };
      existing.count++;
      if (hybrid.result) {
        existing.outcomes.push(hybrid.result);
      }
      combinations.set(combo, existing);
    });

    // Convert to analysis format
    const commonPatterns = Array.from(patternCounts.entries())
      .map(([pattern, frequency]) => ({
        pattern,
        frequency,
        effectiveness: 0.5 + Math.random() * 0.5, // Placeholder
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);

    const unusualCombinations = Array.from(combinations.entries())
      .filter(([_, data]) => data.count === 1)
      .map(([combination, data]) => ({
        combination: combination.split('+'),
        uniqueness: 0.8 + Math.random() * 0.2,
        outcome: data.outcomes[0] || 'Unknown',
      }))
      .slice(0, 5);

    return {
      commonPatterns,
      unusualCombinations,
    };
  }

  generateSessionReport(session: Session): SessionReport {
    const duration = session.lastActivity - session.startTime;
    const domains = this.findMostEffectiveDomains(session);
    const trend = this.calculateCreativityTrend(session);

    const peakMadness = Math.max(
      ...session.context.evolutionChains.flatMap(chain =>
        chain.stages.map(s => s?.madnessLevel || 0)
      ),
      0
    );

    const highlights: string[] = [];
    
    if (session.metrics.totalGenerations > 20) {
      highlights.push(`Generated ${session.metrics.totalGenerations} creative solutions`);
    }
    
    if (domains.length > 0) {
      highlights.push(`Most effective domain: ${domains[0]?.domain || 'Unknown'}`);
    }
    
    if (trend.direction === 'increasing') {
      highlights.push('Creativity trending upward');
    }
    
    if (peakMadness >= 8) {
      highlights.push(`Reached extreme creativity level: ${peakMadness}/10`);
    }

    const recommendations: string[] = [];
    
    if (session.metrics.uniqueDomainsUsed.size < 10) {
      recommendations.push('Try exploring more diverse domains');
    }
    
    if (session.metrics.successfulHybrids < 5) {
      recommendations.push('Experiment more with hybrid combinations');
    }
    
    if (trend.direction === 'decreasing') {
      recommendations.push('Consider increasing madness levels');
    }

    return {
      sessionId: session.id,
      duration,
      summary: {
        totalIdeasGenerated: session.metrics.totalGenerations,
        averageCreativity: session.metrics.averageMadnessIndex,
        mostUsedDomains: domains.slice(0, 3).map(d => d.domain),
        peakMadnessLevel: peakMadness,
      },
      highlights,
      recommendations,
    };
  }

  calculateSessionHealth(session: Session): {
    score: number;
    issues: string[];
  } {
    const issues: string[] = [];
    let score = 100;

    // Check context size
    const contextSize = JSON.stringify(session.context).length;
    if (contextSize > 50 * 1024) {
      issues.push('Context size is large, consider trimming');
      score -= 10;
    }

    // Check activity
    const inactiveDuration = Date.now() - session.lastActivity;
    if (inactiveDuration > 30 * 60 * 1000) {
      issues.push('Session has been inactive for over 30 minutes');
      score -= 20;
    }

    // Check diversity
    if (session.metrics.uniqueDomainsUsed.size < 5) {
      issues.push('Low domain diversity');
      score -= 15;
    }

    return { score: Math.max(0, score), issues };
  }
}