import { useEffect, useRef } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { AIConversationMobile, MobileConversationRef } from "./ai-conversation-mobile";

interface MobileAIAssistantProps {
  channelId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileAIAssistant = ({ channelId, isOpen, onClose }: MobileAIAssistantProps) => {
  const { userId } = useNotesDataStore();
  const { conversations, currentConversationId, loading, createConversation, loadConversations } =
    useConversationState();
  const conversationRef = useRef<MobileConversationRef>(null);

  useEffect(() => {
    if (userId && isOpen) {
      // Load global conversations (decoupled from channels)
      loadConversations(userId);
    }
  }, [userId, isOpen, loadConversations]);

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
