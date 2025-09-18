import { useMemo } from 'react';
import { useConversationStore } from '@/common/features/ai-assistant/stores/conversation.store';
import { AIConversation } from '@/common/types/ai-conversation';

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
  const conversations = useConversationStore(s => s.conversations);
  const currentConversationId = useConversationStore(s => s.currentConversationId);
  const loading = useConversationStore(s => s.loading);
  const error = useConversationStore(s => s.error);
  const createConversation = useConversationStore(s => s.createConversation);
  const loadConversations = useConversationStore(s => s.loadConversations);
  const selectConversation = useConversationStore(s => s.selectConversation);
  const deleteConversation = useConversationStore(s => s.deleteConversation);
  const updateConversation = useConversationStore(s => s.updateConversation);
  const clearError = useConversationStore(s => s.clearError);

  const currentConversation = useMemo(
    () => conversations.find(c => c.id === currentConversationId) || null,
    [conversations, currentConversationId]
  );

  return {
    conversations,
    currentConversationId,
    currentConversation,
    loading,
    error,
    createConversation,
    loadConversations,
    selectConversation,
    deleteConversation,
    updateConversation,
    clearError,
  };
}
