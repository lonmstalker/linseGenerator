import { 
  SessionContext, 
  ArchivedData, 
  PriorityCriteria 
} from './types';
import { CONTEXT_LIMITS } from './config';

export class ContextManager {
  trimContext(context: SessionContext, maxSize: number): SessionContext {
    if (!context) {
      return {
        currentProblem: '',
        generatedLenses: [],
        evolutionChains: [],
        hybridAttempts: []
      };
    }
    
    const serialized = JSON.stringify(context);
    if (serialized.length <= maxSize) {
      return context;
    }

    // Calculate sizes of different parts
    const sizes = {
      lenses: JSON.stringify(context.generatedLenses || []).length,
      chains: JSON.stringify(context.evolutionChains || []).length,
      hybrids: JSON.stringify(context.hybridAttempts || []).length,
    };

    // Proportionally trim each section
    const totalSize = Object.values(sizes).reduce((a, b) => a + b, 0);
    const reductionFactor = maxSize / totalSize;

    return {
      currentProblem: context.currentProblem,
      generatedLenses: this.trimArray(
        context.generatedLenses,
        Math.floor(context.generatedLenses.length * reductionFactor)
      ),
      evolutionChains: this.trimArray(
        context.evolutionChains,
        Math.floor(context.evolutionChains.length * reductionFactor)
      ),
      hybridAttempts: this.trimArray(
        context.hybridAttempts,
        Math.floor(context.hybridAttempts.length * reductionFactor)
      ),
    };
  }

  prioritizeElements<T extends { timestamp?: number }>(
    elements: T[], 
    criteria: PriorityCriteria
  ): T[] {
    const now = Date.now();
    const scored = elements.map(element => {
      let score = 1.0;

      // Recency score
      if (criteria.maxAge && element.timestamp) {
        const age = now - element.timestamp;
        score *= Math.max(0, 1 - (age / criteria.maxAge));
      }

      // Preserve recent items
      if (criteria.preserveRecent && element.timestamp) {
        const index = elements.indexOf(element);
        if (index >= elements.length - criteria.preserveRecent) {
          score *= 2; // Double score for recent items
        }
      }

      return { element, score };
    });

    // Sort by score and filter by minimum importance
    return scored
      .sort((a, b) => b.score - a.score)
      .filter(item => !criteria.minImportance || item.score >= criteria.minImportance)
      .map(item => item.element);
  }

  archiveOldEntries<T extends { timestamp?: number }>(
    entries: T[], 
    ageThreshold: number
  ): ArchivedData {
    const now = Date.now();
    const oldEntries = entries.filter(
      entry => entry.timestamp && (now - entry.timestamp) > ageThreshold
    );

    if (oldEntries.length === 0) {
      return {
        archiveId: `archive_${now}`,
        timestamp: now,
        compressedData: '',
        summary: {
          itemCount: 0,
          dateRange: [now, now],
          keyHighlights: [],
        },
      };
    }

    const timestamps = oldEntries
      .map(e => e.timestamp || 0)
      .filter(t => t !== undefined);

    return {
      archiveId: `archive_${now}`,
      timestamp: now,
      compressedData: JSON.stringify(oldEntries),
      summary: {
        itemCount: oldEntries.length,
        dateRange: [
          Math.min(...timestamps),
          Math.max(...timestamps),
        ],
        keyHighlights: this.extractHighlights(oldEntries),
      },
    };
  }

  reconstructContext(
    archived: ArchivedData, 
    recent: Partial<SessionContext>
  ): SessionContext {
    let archivedContext: Partial<SessionContext> = {};
    
    if (archived.compressedData) {
      try {
        const parsed = JSON.parse(archived.compressedData);
        if (Array.isArray(parsed)) {
          archivedContext = {
            generatedLenses: [],
            evolutionChains: [],
            hybridAttempts: [],
          };
        } else {
          archivedContext = parsed;
        }
      } catch {
        // If parsing fails, use empty context
      }
    }

    return {
      currentProblem: recent.currentProblem || archivedContext.currentProblem || '',
      generatedLenses: [
        ...(archivedContext.generatedLenses || []),
        ...(recent.generatedLenses || []),
      ].slice(-CONTEXT_LIMITS.maxLensesPerSession),
      evolutionChains: [
        ...(archivedContext.evolutionChains || []),
        ...(recent.evolutionChains || []),
      ].slice(-CONTEXT_LIMITS.maxEvolutionChains),
      hybridAttempts: [
        ...(archivedContext.hybridAttempts || []),
        ...(recent.hybridAttempts || []),
      ].slice(-CONTEXT_LIMITS.maxHybridAttempts),
    };
  }

  mergeContexts(contexts: SessionContext[]): SessionContext {
    if (contexts.length === 0) {
      return {
        currentProblem: '',
        generatedLenses: [],
        evolutionChains: [],
        hybridAttempts: [],
      };
    }

    return {
      currentProblem: contexts[contexts.length - 1]?.currentProblem || '',
      generatedLenses: contexts
        .flatMap(c => c.generatedLenses)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-CONTEXT_LIMITS.maxLensesPerSession),
      evolutionChains: contexts
        .flatMap(c => c.evolutionChains)
        .slice(-CONTEXT_LIMITS.maxEvolutionChains),
      hybridAttempts: contexts
        .flatMap(c => c.hybridAttempts)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-CONTEXT_LIMITS.maxHybridAttempts),
    };
  }

  // Private helpers
  private trimArray<T>(array: T[], maxLength: number): T[] {
    if (array.length <= maxLength) {
      return array;
    }
    // Keep most recent items
    return array.slice(-maxLength);
  }

  private extractHighlights(entries: any[]): string[] {
    const highlights: string[] = [];
    
    // Extract unique domains from lenses
    const domains = new Set<string>();
    entries.forEach(entry => {
      if (entry.domains) {
        entry.domains?.forEach((d: string) => domains.add(d));
      }
    });
    
    if (domains.size > 0) {
      highlights.push(`Used ${domains.size} unique domains`);
    }

    // Extract evolution patterns
    const evolutionStages = entries.filter(e => e.stages).length;
    if (evolutionStages > 0) {
      highlights.push(`${evolutionStages} evolution chains`);
    }

    // Extract hybrid attempts
    const hybrids = entries.filter(e => e.method).length;
    if (hybrids > 0) {
      highlights.push(`${hybrids} hybrid attempts`);
    }

    return highlights;
  }
}