import { useEffect, useState, useCallback } from 'react';
import { UIMessage } from '@agent-labs/agent-chat';
import { MessageListOptions } from '@/common/types/ai-conversation';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';

export function useAgentChatSync(conversationId: string, _channelId: string) {
  const { userId } = useNotesDataStore();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 加载初始消息
  useEffect(() => {
    if (userId && conversationId) {
      setLoading(true);
      firebaseAIConversationService.getMessages(userId, conversationId)
        .then(setMessages)
        .finally(() => setLoading(false));
    }
  }, [userId, conversationId]);
  
  // 实时监听消息变化
  useEffect(() => {
    if (!userId || !conversationId) return;
    
    const unsubscribe = firebaseAIConversationService.subscribeToMessages(
      userId, 
      conversationId, 
      setMessages
    );
    
    return unsubscribe;
  }, [userId, conversationId]);
  
  const addMessage = useCallback(async (message: UIMessage) => {
    if (!userId) return;
    await firebaseAIConversationService.addMessage(userId, conversationId, message);
  }, [userId, conversationId]);
  
  const loadMoreMessages = useCallback(async (options?: MessageListOptions) => {
    if (!userId) return;
    setLoading(true);
    try {
      const moreMessages = await firebaseAIConversationService.listMessages(userId, conversationId, options);
      setMessages(prev => [...prev, ...moreMessages]);
    } finally {
      setLoading(false);
    }
  }, [userId, conversationId]);
  
  return { 
    messages, 
    loading, 
    addMessage, 
    loadMoreMessages 
  };
}
