import { AIConversationChat } from "./ai-conversation-chat";
import { AIConversationEmptyPane } from "./ai-conversation-empty-pane";
import { useConversationState } from "../hooks/use-conversation-state";
import { useNotesDataStore } from "@/core/stores/notes-data.store";

interface ConversationContentProps {
  currentConversationId: string | null;
  channelId: string;
  hasConversations: boolean;
  onClose?: () => void;
}

export function ConversationContent({
  currentConversationId,
  channelId,
  hasConversations,
  onClose,
}: ConversationContentProps) {
  const { createConversation } = useConversationState();
  const { userId } = useNotesDataStore();
  if (currentConversationId) {
    return (
      <AIConversationChat
        conversationId={currentConversationId}
        channelId={channelId}
        onClose={onClose}
      />
    );
  }

  if (hasConversations) {
    return <div className="flex-1" />;
  }

  return (
    <AIConversationEmptyPane
      onCreate={() => {
        if (userId) void createConversation(userId, "New Conversation");
      }}
    />
  );
}
