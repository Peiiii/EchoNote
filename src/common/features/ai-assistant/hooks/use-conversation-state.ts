import { useState, useCallback, useMemo } from 'react';
import { AIConversation } from '@/common/types/ai-conversation';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';

export interface ConversationState {
  conversations: AIConversation[];
  currentConversationId: string | null;
  currentConversation: AIConversation | null;
  loading: boolean;
  error: string | null;
}

export interface ConversationActions {
  createConversation: (userId: string, channelId: string, title: string) => Promise<AIConversation>;
  loadConversations: (userId: string, channelId?: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  updateConversation: (userId: string, conversationId: string, updates: Partial<AIConversation>) => Promise<void>;
  clearError: () => void;
}

export function useConversationState(): ConversationState & ConversationActions {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentConversation = useMemo(
    () => conversations.find(c => c.id === currentConversationId) || null,
    [conversations, currentConversationId]
  );

  const createConversation = useCallback(async (userId: string, channelId: string, title: string) => {
    setLoading(true);
    setError(null);
    try {
      const conversation = await firebaseAIConversationService.createConversation(userId, channelId, title);
      setConversations(prev => [conversation, ...prev]);
      setCurrentConversationId(conversation.id);
      return conversation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create conversation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async (userId: string, channelId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const conversations = await firebaseAIConversationService.getConversations(userId, channelId);
      setConversations(conversations);
      if (conversations.length > 0 && !currentConversationId) {
        setCurrentConversationId(conversations[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentConversationId]);

  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
  }, []);

  const deleteConversation = useCallback(async (userId: string, conversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseAIConversationService.deleteConversation(userId, conversationId);
      setConversations(prev => prev.filter(c => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete conversation';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentConversationId]);

  const updateConversation = useCallback(async (userId: string, conversationId: string, updates: Partial<AIConversation>) => {
    setError(null);
    try {
      await firebaseAIConversationService.updateConversation(userId, conversationId, updates);
      setConversations(prev => 
        prev.map(c => c.id === conversationId ? { ...c, ...updates } : c)
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update conversation';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conversations,
    currentConversationId,
    loading,
    error,
    createConversation,
    loadConversations,
    selectConversation,
    deleteConversation,
    updateConversation,
    clearError,
    currentConversation,
  };
}
