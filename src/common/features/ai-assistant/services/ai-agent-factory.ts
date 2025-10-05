import { ExperimentalInBrowserAgent } from "@/common/lib/runnable-agent";
import { IAgent } from "@agent-labs/agent-chat";
import { channelToolsManager } from "./channel-tools-manager";
import { channelContextManager, sessionContextManager } from "@/common/features/ai-assistant/features/context";
import { ModelConfig, getDefaultModel } from "../config/model-config";
import { useModelSelectionStore } from "../stores/model-selection.store";

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
      const { getSelectedModel } = useModelSelectionStore.getState();
      const selectedModel = getSelectedModel();
      this.agent = new ExperimentalInBrowserAgent({
        apiKey: selectedModel.apiKey,
        model: selectedModel.model,
        temperature: selectedModel.temperature,
        maxTokens: selectedModel.maxTokens,
        baseURL: selectedModel.apiUrl,
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
  getChannelTools() {
    console.log("🔔 [AIAgentFactory][getChannelTools] requesting tools");
    const tools = channelToolsManager.getChannelTools();
    console.log("🔔 [AIAgentFactory][getChannelTools] returning tools:", tools.map(t => ({ name: t.name, description: t.description })));
    return tools;
  }

  /**
   * Get channel context for AI - provides comprehensive channel data
   */
  getChannelContext(channelId: string) {
    return channelContextManager.getChannelContext(channelId);
  }

  /**
   * Get conversation-scoped contexts with dynamic binding (MVP v2 ready)
   */
  getSessionContexts(conversationId: string, fallbackChannelId: string) {
    return sessionContextManager.getSessionContexts(conversationId, fallbackChannelId);
  }
}

export const aiAgentFactory = new AIAgentFactory();
