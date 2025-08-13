import { AIChatMessage, SpaceContext } from '@/desktop/features/demo/features/space-aware-chat/types';
import { useCallback, useState } from 'react';

export const useSpaceAIChat = (spaceId: string, spaceContext: SpaceContext) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟AI响应 - 实际项目中应该调用真实的AI API
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 基于空间上下文生成回复
    // const context = spaceContext.records.map(r => r.content).join('\n');
    
    // 简单的规则引擎 - 实际项目中应该用真实的AI
    if (userMessage.includes('总结') || userMessage.includes('概括')) {
      return `基于该空间的 ${spaceContext.totalCount} 条记录，我可以看到主要涉及：${spaceContext.records.map(r => r.tags?.[0]).filter(Boolean).join('、')} 等领域。需要我帮你分析某个具体方面吗？`;
    }
    
    if (userMessage.includes('进度') || userMessage.includes('状态')) {
      const workRecords = spaceContext.records.filter(r => r.tags?.includes('进度') || r.tags?.includes('完成'));
      if (workRecords.length > 0) {
        return `根据记录，当前进度情况：${workRecords.map(r => r.content).join('；')}`;
      }
      return '该空间暂无进度相关记录。';
    }
    
    if (userMessage.includes('计划') || userMessage.includes('安排')) {
      const planRecords = spaceContext.records.filter(r => r.tags?.includes('计划') || r.content.includes('需要') || r.content.includes('明天'));
      if (planRecords.length > 0) {
        return `根据记录，接下来的安排：${planRecords.map(r => r.content).join('；')}`;
      }
      return '该空间暂无明确的计划安排。';
    }
    
    // 默认回复
    return `我了解你在 ${spaceId} 空间的情况。该空间有 ${spaceContext.totalCount} 条记录，我可以帮你分析、总结或回答相关问题。请告诉我你需要什么帮助？`;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // 添加用户消息
    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: Date.now(),
      spaceId
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 生成AI回复
      const aiResponse = await generateAIResponse(content);
      
      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: Date.now(),
        spaceId
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI回复生成失败:', error);
      
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        content: '抱歉，AI回复生成失败，请稍后重试。',
        isUser: false,
        timestamp: Date.now(),
        spaceId
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [spaceId, spaceContext]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
};
