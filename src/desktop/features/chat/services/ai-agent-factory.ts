import { ExperimentalInBrowserAgent } from "@/common/lib/runnable-agent";
import { createAnalyzeChannelTool } from "@/desktop/features/chat/components/tools/analyze-channel.tool";
import { createCreateTagTool } from "@/desktop/features/chat/components/tools/create-tag.tool";
import { createSearchMessagesTool } from "@/desktop/features/chat/components/tools/search-messages.tool";
import { createSummarizeContentTool } from "@/desktop/features/chat/components/tools/summarize-content.tool";
import { IAgent, Tool } from "@agent-labs/agent-chat";
import { useChatDataStore } from "@/core/stores/chat-data-store";
import { Message } from "@/core/stores/chat-data-store";

export interface AIAgentConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
}

export class AIAgentFactory {
  private static instance: AIAgentFactory;

  private constructor() { }

  static getInstance(): AIAgentFactory {
    if (!AIAgentFactory.instance) {
      AIAgentFactory.instance = new AIAgentFactory();
    }
    return AIAgentFactory.instance;
  }

  /**
   * Create HttpAgent instance
   */
  createAgent(): IAgent {
    // return new HttpAgent({
    //   url: "http://localhost:8000/openai-agent",
    // });
    return new ExperimentalInBrowserAgent({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      model: import.meta.env.VITE_OPENAI_MODEL,
      temperature: 0.7,
      maxTokens: 1000,
      baseURL: import.meta.env.VITE_OPENAI_API_URL,
    })
  }

  /**
   * Get channel-specific tools
   */
  getChannelTools(channelId: string): Tool[] {
    return [
      createAnalyzeChannelTool(channelId),
      createCreateTagTool(),
      createSummarizeContentTool(channelId),
      createSearchMessagesTool(channelId)
    ];
  }

  /**
   * Get channel context for AI - provides comprehensive channel data
   */
  getChannelContext(channelId: string) {
    
    // Get channel and message data
    const state = useChatDataStore.getState();
    const channel = state.channels.find(ch => ch.id === channelId);
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    if (!channel) {
      return {
        description: 'Channel Context',
        value: JSON.stringify({
          error: 'Channel not found',
          channelId,
          timestamp: new Date().toISOString()
        })
      };
    }

    // Build comprehensive channel context
    const channelContext = {
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description || '',
        createdAt: channel.createdAt,
        messageCount: channel.messageCount
      },
      messages: {
        total: messages.length,
        recent: messages.slice(-20).map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          sender: msg.sender,
          channelId: msg.channelId
        })),
        summary: {
          firstMessage: messages.length > 0 ? messages[0].timestamp : null,
          lastMessage: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
          timeSpan: messages.length > 0 ? {
            start: messages[0].timestamp,
            end: messages[messages.length - 1].timestamp,
            duration: new Date(messages[messages.length - 1].timestamp).getTime() - new Date(messages[0].timestamp).getTime()
          } : null
        }
      },
      analysis: {
        messageTypes: messages.reduce((acc, msg) => {
          acc[msg.sender] = (acc[msg.sender] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        contentKeywords: this.extractKeywords(messages.map(msg => msg.content).join(' ')),
        activityPattern: this.analyzeActivityPattern(messages)
      },
      timestamp: new Date().toISOString()
    };

    return {
      description: `Channel Context for "${channel.name}" - ${messages.length} messages`,
      value: JSON.stringify(channelContext)
    };
  }

  /**
   * Extract keywords from content (simple implementation)
   */
  private extractKeywords(content: string): string[] {
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);
  }

  /**
   * Analyze message activity pattern
   */
  private analyzeActivityPattern(messages: Message[]): {
    hourlyActivity: number[];
    dailyActivity: number[];
    peakHour: number;
    peakDay: number;
    averageMessagesPerDay: number;
  } | null {
    if (messages.length === 0) return null;
    
    const hourlyActivity = new Array(24).fill(0);
    const dailyActivity = new Array(7).fill(0);
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      hourlyActivity[date.getHours()]++;
      dailyActivity[date.getDay()]++;
    });
    
    return {
      hourlyActivity,
      dailyActivity,
      peakHour: hourlyActivity.indexOf(Math.max(...hourlyActivity)),
      peakDay: dailyActivity.indexOf(Math.max(...dailyActivity)),
      averageMessagesPerDay: messages.length / Math.max(1, Math.ceil((new Date(messages[messages.length - 1].timestamp).getTime() - new Date(messages[0].timestamp).getTime()) / (1000 * 60 * 60 * 24)))
    };
  }
}

export const aiAgentFactory = AIAgentFactory.getInstance();
