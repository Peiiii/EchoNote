import { useEffect, useRef } from "react";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { AIConversationMobile, MobileConversationRef } from "./ai-conversation-mobile";
import { useNotesDataStore } from "@/core/stores/notes-data.store";

interface MobileAIAssistantProps {
  channelId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileAIAssistant = ({ channelId, isOpen, onClose }: MobileAIAssistantProps) => {
  const { userId } = useNotesDataStore();
  const {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    loadConversations,
    resetForLoggedOut,
  } = useConversationState();
  const conversationRef = useRef<MobileConversationRef>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!userId) {
      resetForLoggedOut();
      return;
    }
    loadConversations(userId);
  }, [userId, isOpen, loadConversations, resetForLoggedOut]);

  const handleCreateConversation = () => {
    if (!userId) return;
    void createConversation(userId, "New Conversation");
  };

  if (!isOpen) return null;

  return (
    <AIConversationMobile
      ref={conversationRef}
      conversations={conversations}
      currentConversationId={currentConversationId}
      loading={loading}
      onCreate={handleCreateConversation}
      channelId={channelId}
      onClose={onClose}
    />
  );
};
