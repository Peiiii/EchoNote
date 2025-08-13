import { useState, useCallback } from 'react';
import { channelAIService } from '@/common/services/ai/channel-ai-service';

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useAIChat = (channelId: string) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Generate AI response
      const aiResponse = await channelAIService.generateResponse(content.trim(), channelId);
      
      const aiMessage: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      
      const errorMessage: AIChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const analyzeChannel = useCallback(async (analysisType: 'summary' | 'keywords' | 'topics') => {
    setIsLoading(true);
    
    try {
      const analysis = await channelAIService.analyzeChannel(channelId, analysisType);
      
      const analysisMessage: AIChatMessage = {
        id: `analysis-${Date.now()}`,
        role: 'assistant',
        content: `**${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)} Analysis:**\n\n${analysis}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, analysisMessage]);
    } catch (error) {
      console.error('Channel analysis failed:', error);
      
      const errorMessage: AIChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Analysis failed. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [channelId]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    analyzeChannel
  };
};
