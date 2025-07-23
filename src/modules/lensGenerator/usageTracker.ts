/**
 * Usage tracker for domain selection
 * Tracks which domains have been used recently and their effectiveness
 */

import { IUsageTracker, UsageData } from './types';

export class UsageTracker implements IUsageTracker {
  private usageData: Map<string, UsageData> = new Map();
  private maxHistorySize: number;
  
  constructor(maxHistorySize: number = 1000) {
    this.maxHistorySize = maxHistorySize;
  }
  
  /**
   * Record usage of a domain
   */
  recordUsage(domainId: string): void {
    const existing = this.usageData.get(domainId);
    
    if (existing) {
      existing.lastUsed = Date.now();
      existing.useCount++;
    } else {
      this.usageData.set(domainId, {
        domainId,
        lastUsed: Date.now(),
        useCount: 1,
        effectiveness: 0.5 // Start with neutral effectiveness
      });
    }
    
    // Cleanup old entries if exceeding max size
    if (this.usageData.size > this.maxHistorySize) {
      this.cleanupOldEntries();
    }
  }
  
  /**
   * Get recently used domain IDs
   */
  getRecentlyUsed(limit: number): string[] {
    const entries = Array.from(this.usageData.entries());
    
    // Sort by last used timestamp (most recent first)
    entries.sort((a, b) => b[1].lastUsed - a[1].lastUsed);
    
    return entries.slice(0, limit).map(([id]) => id);
  }
  
  /**
   * Get usage statistics for a domain
   */
  getDomainStats(domainId: string): UsageData | null {
    return this.usageData.get(domainId) || null;
  }
  
  /**
   * Get domains with high effectiveness scores
   */
  getEffectiveDomains(minEffectiveness: number = 0.7): string[] {
    const effectiveDomains: string[] = [];
    
    for (const [id, data] of this.usageData.entries()) {
      if (data.effectiveness >= minEffectiveness) {
        effectiveDomains.push(id);
      }
    }
    
    // Sort by effectiveness (highest first)
    effectiveDomains.sort((a, b) => {
      const aData = this.usageData.get(a)!;
      const bData = this.usageData.get(b)!;
      return bData.effectiveness - aData.effectiveness;
    });
    
    return effectiveDomains;
  }
  
  /**
   * Update effectiveness score for a domain
   * @param score - Value between 0 and 1
   */
  updateEffectiveness(domainId: string, score: number): void {
    const data = this.usageData.get(domainId);
    
    if (data) {
      // Use weighted average to update effectiveness
      const weight = 0.3; // Weight for new score
      data.effectiveness = data.effectiveness * (1 - weight) + score * weight;
    }
  }
  
  /**
   * Get least recently used domains
   */
  getLeastRecentlyUsed(availableDomains: string[], limit: number): string[] {
    const domainScores = new Map<string, number>();
    
    // Calculate recency scores for all available domains
    for (const domainId of availableDomains) {
      const data = this.usageData.get(domainId);
      
      if (!data) {
        // Never used - highest priority
        domainScores.set(domainId, Infinity);
      } else {
        // Score based on time since last use
        const timeSinceUse = Date.now() - data.lastUsed;
        domainScores.set(domainId, timeSinceUse);
      }
    }
    
    // Sort by score (highest first - least recently used)
    const sorted = Array.from(domainScores.entries())
      .sort((a, b) => b[1] - a[1]);
    
    return sorted.slice(0, limit).map(([id]) => id);
  }
  
  /**
   * Get diversity score for a set of domains
   * Returns value between 0 and 1 (1 being most diverse)
   */
  getDiversityScore(domainIds: string[]): number {
    if (domainIds.length <= 1) return 1;
    
    const recentlyUsed = this.getRecentlyUsed(20);
    let overlapCount = 0;
    
    for (const domainId of domainIds) {
      if (recentlyUsed.includes(domainId)) {
        overlapCount++;
      }
    }
    
    // Calculate diversity score (less overlap = higher diversity)
    return 1 - (overlapCount / domainIds.length);
  }
  
  /**
   * Clean up old entries when exceeding max size
   */
  private cleanupOldEntries(): void {
    const entries = Array.from(this.usageData.entries());
    
    // Sort by last used (oldest first)
    entries.sort((a, b) => a[1].lastUsed - b[1].lastUsed);
    
    // Remove oldest 10%
    const removeCount = Math.floor(this.maxHistorySize * 0.1);
    for (let i = 0; i < removeCount; i++) {
      const entry = entries[i];
      if (entry) {
        this.usageData.delete(entry[0]);
      }
    }
  }
  
  /**
   * Export usage data for persistence
   */
  exportData(): Record<string, UsageData> {
    const data: Record<string, UsageData> = {};
    
    for (const [id, usage] of this.usageData.entries()) {
      data[id] = { ...usage };
    }
    
    return data;
  }
  
  /**
   * Import usage data from persistence
   */
  importData(data: Record<string, UsageData>): void {
    this.usageData.clear();
    
    for (const [id, usage] of Object.entries(data)) {
      this.usageData.set(id, usage);
    }
  }
  
  /**
   * Get usage statistics
   */
  getUsageStats(): Map<string, number> {
    const stats = new Map<string, number>();
    
    for (const [domainId, data] of this.usageData.entries()) {
      stats.set(domainId, data.useCount);
    }
    
    return stats;
  }
}