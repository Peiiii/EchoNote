import { useState, useCallback } from 'react';
import { AIConversation } from '@/common/types/ai-conversation';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';

export function useAIConversation() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const currentConversation = conversations.find(c => c.id === currentConversationId);
  
  const createConversation = useCallback(async (userId: string, channelId: string, title: string) => {
    setLoading(true);
    try {
      const conversation = await firebaseAIConversationService.createConversation(userId, channelId, title);
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversationId(conversation.id);
      return conversation;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const loadConversations = useCallback(async (userId: string, channelId?: string) => {
    setLoading(true);
    try {
      const conversations = await firebaseAIConversationService.getConversations(userId, channelId);
      setConversations(conversations);
      if (conversations.length > 0) {
        setCurrentConversationId(conversations[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);
  
  const deleteConversation = useCallback(async (userId: string, conversationId: string) => {
    setLoading(true);
    try {
      await firebaseAIConversationService.deleteConversation(userId, conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } finally {
      setLoading(false);
    }
  }, [currentConversationId]);
  
  return {
    conversations,
    currentConversation,
    currentConversationId,
    loading,
    createConversation,
    loadConversations,
    selectConversation,
    deleteConversation,
  };
}
