import { ExperimentalInBrowserAgent } from "@/common/lib/runnable-agent";
import { IAgent } from "@agent-labs/agent-chat";
import { channelToolsManager } from "@/common/features/notes/services/channel-tools-manager";
import { channelContextManager } from "@/common/features/notes/services/channel-context-manager";

export interface AIAgentConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
}

export class AIAgentFactory {
  /**
   * Create HttpAgent instance
   */
  createAgent(): IAgent {
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
  getChannelTools(channelId: string) {
    return channelToolsManager.getChannelTools(channelId);
  }

  /**
   * Get channel context for AI - provides comprehensive channel data
   */
  getChannelContext(channelId: string) {
    return channelContextManager.getChannelContext(channelId);
  }
}

export const aiAgentFactory = new AIAgentFactory();
