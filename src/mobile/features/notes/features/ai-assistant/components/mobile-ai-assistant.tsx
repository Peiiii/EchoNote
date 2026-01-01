import { useEffect, useRef } from "react";
import { useAuthStore } from "@/core/stores/auth.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { AIConversationMobile, MobileConversationRef } from "./ai-conversation-mobile";
import { openLoginModal } from "@/common/features/auth/open-login-modal";

interface MobileAIAssistantProps {
  channelId: string;
  isOpen: boolean;
  onClose?: () => void;
}

export const MobileAIAssistant = ({ channelId, isOpen, onClose }: MobileAIAssistantProps) => {
  const uid = useAuthStore(s => s.currentUser?.uid) ?? null;
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
    if (!uid) {
      resetForLoggedOut();
      openLoginModal({ title: "登录以使用对话能力" });
      return;
    }
    loadConversations(uid);
  }, [uid, isOpen, loadConversations, resetForLoggedOut]);

  const handleCreateConversation = () => {
    if (!uid) return;
    void createConversation(uid, "New Conversation");
  };

  if (!isOpen) return null;
  if (!uid) return null;

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
