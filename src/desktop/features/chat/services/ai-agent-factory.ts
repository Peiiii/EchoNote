import { createAnalyzeChannelTool } from "@/desktop/features/chat/components/tools/analyze-channel.tool";
import { createCreateTagTool } from "@/desktop/features/chat/components/tools/create-tag.tool";
import { createSearchMessagesTool } from "@/desktop/features/chat/components/tools/search-messages.tool";
import { createSummarizeContentTool } from "@/desktop/features/chat/components/tools/summarize-content.tool";
import { HttpAgent } from "@ag-ui/client";
import { Tool } from "@agent-labs/agent-chat";

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
  createAgent(): HttpAgent {
    return new HttpAgent({
      url: "http://localhost:8000/openai-agent",
    });
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
   * Get channel context for AI
   */
  getChannelContext(channelId: string) {
    console.log('[AIAgentFactory] getChannelContext', channelId);
    return {
      description: 'Channel Context',
      value: JSON.stringify({
        channelId,
        timestamp: new Date().toISOString()
      })
    };
  }
}

export const aiAgentFactory = AIAgentFactory.getInstance();
