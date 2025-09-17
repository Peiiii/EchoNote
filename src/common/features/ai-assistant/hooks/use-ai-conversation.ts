import { useConversationState } from './use-conversation-state';

export function useAIConversation() {
  const conversationState = useConversationState();
  
  return {
    conversations: conversationState.conversations,
    currentConversation: conversationState.currentConversation,
    currentConversationId: conversationState.currentConversationId,
    loading: conversationState.loading,
    error: conversationState.error,
    createConversation: conversationState.createConversation,
    loadConversations: conversationState.loadConversations,
    selectConversation: conversationState.selectConversation,
    deleteConversation: conversationState.deleteConversation,
    updateConversation: conversationState.updateConversation,
    clearError: conversationState.clearError,
  };
}
