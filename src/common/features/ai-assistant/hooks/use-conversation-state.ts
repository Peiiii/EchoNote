import { useMemo } from "react";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { AIConversation, ConversationContextConfig } from "@/common/types/ai-conversation";

export interface ConversationState {
  conversations: AIConversation[];
  currentConversationId: string | null;
  currentConversation: AIConversation | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
}

export interface ConversationActions {
  createConversation: (
    userId: string,
    title: string,
    contexts?: ConversationContextConfig
  ) => Promise<AIConversation>;
  loadConversations: (userId: string) => Promise<void>;
  loadMoreConversations: (userId: string) => Promise<void>;
  selectConversation: (conversationId: string) => void;
  deleteConversation: (userId: string, conversationId: string) => Promise<void>;
  updateConversation: (
    userId: string,
    conversationId: string,
    updates: Partial<AIConversation>
  ) => Promise<void>;
  clearError: () => void;
}

export function useConversationState(): ConversationState & ConversationActions {
  const conversations = useConversationStore(s => s.conversations);
  const currentConversationId = useConversationStore(s => s.currentConversationId);
  const loading = useConversationStore(s => s.loading);
  const loadingMore = useConversationStore(s => s.loadingMore);
  const error = useConversationStore(s => s.error);
  const hasMore = useConversationStore(s => s.hasMore);
  const createConversation = useConversationStore(s => s.createConversation);
  const loadConversations = useConversationStore(s => s.loadConversations);
  const loadMoreConversations = useConversationStore(s => s.loadMoreConversations);
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
    loadingMore,
    error,
    hasMore,
    createConversation,
    loadConversations,
    loadMoreConversations,
    selectConversation,
    deleteConversation,
    updateConversation,
    clearError,
  };
}
