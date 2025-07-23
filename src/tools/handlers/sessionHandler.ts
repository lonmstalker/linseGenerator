import { ToolContext, ToolResult } from '../types';

export async function handleGetSessionInsights(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const { session_id, insight_type = 'summary' } = args;
    
    const session = context.stateManager.getSession(session_id);
    if (!session) {
      throw new Error(`Session not found: ${session_id}`);
    }
    
    let insightText = '';
    
    switch (insight_type) {
      case 'summary': {
        const report = context.stateManager.getSessionReport(session_id);
        insightText = `=== SESSION SUMMARY ===\n\n`;
        insightText += `Session ID: ${session_id}\n`;
        insightText += `Duration: ${Math.round(report.duration / 1000 / 60)} minutes\n`;
        insightText += `Total Ideas Generated: ${report.summary.totalIdeasGenerated}\n`;
        insightText += `Average Creativity: ${report.summary.averageCreativity.toFixed(1)}/10\n`;
        insightText += `Peak Madness Level: ${report.summary.peakMadnessLevel}/10\n\n`;
        
        if (report.highlights.length > 0) {
          insightText += `KEY HIGHLIGHTS:\n`;
          report.highlights.forEach(h => insightText += `- ${h}\n`);
        }
        break;
      }
      
      case 'trends': {
        const analytics = context.stateManager['analytics'];
        const trend = analytics.calculateCreativityTrend(session);
        const domains = analytics.findMostEffectiveDomains(session);
        
        insightText = `=== CREATIVITY TRENDS ===\n\n`;
        insightText += `Trend Direction: ${trend.direction}\n`;
        insightText += `Trend Rate: ${trend.rate.toFixed(2)}\n`;
        insightText += `Confidence: ${(trend.confidence * 100).toFixed(0)}%\n\n`;
        
        insightText += `TOP DOMAINS:\n`;
        domains.slice(0, 5).forEach((d, i) => {
          insightText += `${i + 1}. ${d.domain} (score: ${d.averageCreativityScore.toFixed(1)})\n`;
        });
        break;
      }
      
      case 'recommendations': {
        const report = context.stateManager.getSessionReport(session_id);
        const health = context.stateManager.getSessionHealth(session_id);
        
        insightText = `=== RECOMMENDATIONS ===\n\n`;
        insightText += `Session Health Score: ${health.score}/100\n\n`;
        
        if (health.issues.length > 0) {
          insightText += `ISSUES TO ADDRESS:\n`;
          health.issues.forEach(issue => insightText += `- ${issue}\n`);
          insightText += '\n';
        }
        
        if (report.recommendations.length > 0) {
          insightText += `SUGGESTIONS FOR IMPROVEMENT:\n`;
          report.recommendations.forEach(rec => insightText += `- ${rec}\n`);
        }
        break;
      }
      
      case 'full_report': {
        const report = context.stateManager.getSessionReport(session_id);
        const analytics = context.stateManager['analytics'];
        const patterns = analytics.analyzeEvolutionPatterns(session);
        
        insightText = `=== FULL SESSION REPORT ===\n\n`;
        insightText += `Session ID: ${session_id}\n`;
        insightText += `User: ${session.userId}\n`;
        insightText += `Started: ${new Date(session.startTime).toISOString()}\n`;
        insightText += `Last Activity: ${new Date(session.lastActivity).toISOString()}\n\n`;
        
        // Summary
        insightText += `SUMMARY:\n`;
        insightText += `- Total Ideas: ${report.summary.totalIdeasGenerated}\n`;
        insightText += `- Average Creativity: ${report.summary.averageCreativity.toFixed(1)}/10\n`;
        insightText += `- Unique Domains Used: ${session.metrics.uniqueDomainsUsed.size}\n`;
        insightText += `- Successful Hybrids: ${session.metrics.successfulHybrids}\n\n`;
        
        // Patterns
        insightText += `EVOLUTION PATTERNS:\n`;
        patterns.commonPatterns.slice(0, 3).forEach(p => {
          insightText += `- ${p.pattern} (freq: ${p.frequency}, effectiveness: ${(p.effectiveness * 100).toFixed(0)}%)\n`;
        });
        
        if (patterns.unusualCombinations.length > 0) {
          insightText += `\nUNUSUAL COMBINATIONS:\n`;
          patterns.unusualCombinations.forEach(c => {
            insightText += `- ${c.combination.join(' + ')} → ${c.outcome}\n`;
          });
        }
        break;
      }
    }
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: insightText
      }],
      metadata: {
        sessionId: session_id,
        insightType: insight_type
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get session insights: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function handleListSessions(_args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const allSessions = context.stateManager.getAllSessions();
    const now = Date.now();
    
    let response = `=== ACTIVE SESSIONS ===\n\n`;
    response += `Total sessions: ${allSessions.length}\n\n`;
    
    allSessions.forEach(session => {
      // const duration = now - session.startTime;
      const inactive = now - session.lastActivity;
      
      response += `Session: ${session.id}\n`;
      response += `User: ${session.userId}\n`;
      response += `Created: ${new Date(session.startTime).toISOString()}\n`;
      response += `Last activity: ${Math.round(inactive / 1000 / 60)} minutes ago\n`;
      response += `Total generations: ${session.metrics.totalGenerations}\n`;
      response += `Status: ${inactive > 60 * 60 * 1000 ? 'INACTIVE' : 'ACTIVE'}\n`;
      response += `---\n\n`;
    });
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: response
      }],
      metadata: {
        sessionCount: allSessions.length
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to list sessions: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function handleGetSessionHistory(args: any, context: ToolContext): Promise<ToolResult> {
  try {
    const { session_id } = args;
    
    const session = context.stateManager.getSession(session_id);
    if (!session) {
      throw new Error(`Session not found: ${session_id}`);
    }
    
    const report = context.stateManager.getSessionReport(session_id);
    
    let response = `=== SESSION HISTORY ===\n\n`;
    response += `Session ID: ${session_id}\n`;
    response += `Created: ${new Date(session.startTime).toISOString()}\n`;
    response += `Last activity: ${new Date(session.lastActivity).toISOString()}\n\n`;
    
    // Summary
    response += `${report.summary.totalIdeasGenerated} ideas generated\n`;
    response += `Average creativity: ${report.summary.averageCreativity.toFixed(1)}/10\n`;
    response += `Peak madness level: ${report.summary.peakMadnessLevel}/10\n\n`;
    
    // Timeline
    response += `TIMELINE:\n`;
    
    // Lenses
    if (session.context.generatedLenses.length > 0) {
      response += `\nGenerated Lenses (${session.context.generatedLenses.length}):\n`;
      session.context.generatedLenses.slice(-5).forEach(lens => {
        response += `- ${new Date(lens.timestamp).toISOString()}: ${lens.domains.join(', ')}\n`;
      });
    }
    
    // Evolution chains
    if (session.context.evolutionChains.length > 0) {
      response += `\nEvolution Chains (${session.context.evolutionChains.length}):\n`;
      session.context.evolutionChains.forEach(chain => {
        response += `- "${chain.originalIdea.substring(0, 50)}..." → ${chain.stages.length} stages\n`;
      });
    }
    
    // Hybrids
    if (session.context.hybridAttempts.length > 0) {
      response += `\nHybrid Attempts (${session.context.hybridAttempts.length}):\n`;
      session.context.hybridAttempts.slice(-5).forEach(hybrid => {
        response += `- ${hybrid.method}: "${hybrid.ideaA.substring(0, 20)}..." + "${hybrid.ideaB.substring(0, 20)}..."\n`;
      });
    }
    
    // Most used domains
    response += `\nMost used domains:\n`;
    report.summary.mostUsedDomains.forEach((d, i) => {
      response += `${i + 1}. ${d}\n`;
    });
    
    // Highlights and recommendations
    if (report.highlights.length > 0) {
      response += `\nHighlights:\n`;
      report.highlights.forEach(h => response += `- ${h}\n`);
    }
    
    if (report.recommendations.length > 0) {
      response += `\nRecommendations:\n`;
      report.recommendations.forEach(r => response += `- ${r}\n`);
    }
    
    return {
      success: true,
      content: [{
        type: 'text',
        text: response
      }],
      metadata: {
        sessionId: session_id,
        report: report
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to get session history: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}