import { generateText } from './generate-text';
import { useChatStore } from '@/core/stores/chat-store';

export interface ChannelAIContext {
  channelId: string;
  channelName: string;
  channelDescription: string;
  messageCount: number;
  recentMessages: string[];
}

export class ChannelAIService {
  private static instance: ChannelAIService;
  
  private constructor() {}
  
  static getInstance(): ChannelAIService {
    if (!ChannelAIService.instance) {
      ChannelAIService.instance = new ChannelAIService();
    }
    return ChannelAIService.instance;
  }

  /**
   * Get channel context for AI
   */
  getChannelContext(channelId: string): ChannelAIContext {
    const state = useChatStore.getState();
    const channel = state.channels.find(ch => ch.id === channelId);
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    return {
      channelId,
      channelName: channel?.name || 'Unknown',
      channelDescription: channel?.description || '',
      messageCount: messages.length,
      recentMessages: messages.slice(-10).map(msg => msg.content)
    };
  }

  /**
   * Generate AI response based on channel context
   */
  async generateResponse(userMessage: string, channelId: string): Promise<string> {
    const context = this.getChannelContext(channelId);
    
    const systemPrompt = `You are an AI assistant for the channel "${context.channelName}". 
This channel has ${context.messageCount} messages and focuses on: ${context.channelDescription}.

Recent context from the channel:
${context.recentMessages.join('\n')}

Please provide helpful, contextual responses. Be concise but informative.`;

    try {
      const response = await generateText({
        prompt: userMessage,
        system: systemPrompt,
        temperature: 0.7
      });
      
      return response;
    } catch (error) {
      console.error('AI response generation failed:', error);
      return 'Sorry, I encountered an error while processing your request. Please try again.';
    }
  }

  /**
   * Analyze channel content
   */
  async analyzeChannel(channelId: string, analysisType: 'summary' | 'keywords' | 'topics'): Promise<string> {
    const context = this.getChannelContext(channelId);
    
    let prompt = '';
    switch (analysisType) {
      case 'summary':
        prompt = `Please provide a concise summary of the channel "${context.channelName}". 
Focus on main themes, key insights, and overall content structure.`;
        break;
      case 'keywords':
        prompt = `Extract the most important keywords and themes from the channel "${context.channelName}". 
Provide 5-8 key terms that best represent the channel's content.`;
        break;
      case 'topics':
        prompt = `Identify the main discussion topics in the channel "${context.channelName}". 
Group related content and provide 3-5 main topic areas.`;
        break;
    }

    try {
      const response = await generateText({
        prompt,
        system: `You are analyzing the channel: ${context.channelName}\n\nRecent messages:\n${context.recentMessages.join('\n')}`,
        temperature: 0.5
      });
      
      return response;
    } catch (error) {
      console.error('Channel analysis failed:', error);
      return 'Analysis failed. Please try again.';
    }
  }
}

export const channelAIService = ChannelAIService.getInstance();
