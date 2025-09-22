import { ExperimentalInBrowserAgent } from "@/common/lib/runnable-agent";
import { IAgent } from "@agent-labs/agent-chat";
import { channelToolsManager } from "./channel-tools-manager";
import { channelContextManager } from "./channel-context-manager";
import { ModelConfig, getDefaultModel } from "../config/model-config";

export interface AIAgentConfig {
  apiKey?: string;
  baseURL?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIAgentFactory {
  private agent: ExperimentalInBrowserAgent | null = null;

  /**
   * Get or create agent instance with default configuration
   */
  getAgent(): IAgent {
    if (!this.agent) {
      const defaultModel = getDefaultModel();
      this.agent = new ExperimentalInBrowserAgent({
        apiKey: defaultModel.apiKey,
        model: defaultModel.model,
        temperature: defaultModel.temperature,
        maxTokens: defaultModel.maxTokens,
        baseURL: defaultModel.apiUrl,
      });
    }
    return this.agent;
  }

  updateAgentConfig(modelConfig: ModelConfig): void {
    if (!this.agent) {
      this.agent = new ExperimentalInBrowserAgent();
    }
    
    this.agent.setConfig({
      apiKey: modelConfig.apiKey,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      baseURL: modelConfig.apiUrl,
    });
  }

  /**
   * Create HttpAgent instance with custom model configuration
   */
  createAgentWithModel(modelConfig: ModelConfig): IAgent {
    return new ExperimentalInBrowserAgent({
      apiKey: modelConfig.apiKey,
      model: modelConfig.model,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
      baseURL: modelConfig.apiUrl,
    })
  }

  /**
   * Create HttpAgent instance with custom configuration
   */
  createAgentWithConfig(config: AIAgentConfig): IAgent {
    const defaultModel = getDefaultModel();
    return new ExperimentalInBrowserAgent({
      apiKey: config.apiKey || defaultModel.apiKey,
      model: config.model || defaultModel.model,
      temperature: config.temperature ?? defaultModel.temperature,
      maxTokens: config.maxTokens ?? defaultModel.maxTokens,
      baseURL: config.baseURL || defaultModel.apiUrl,
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
