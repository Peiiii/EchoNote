import { AIConversationChat } from "./ai-conversation-chat";
import { AIConversationEmptyPane } from "./ai-conversation-empty-pane";

interface ConversationContentProps {
  currentConversationId: string | null;
  channelId: string;
  hasConversations: boolean;
  onCreate: () => void;
  onClose?: () => void;
}

export function ConversationContent({
  currentConversationId,
  channelId,
  hasConversations,
  onCreate,
  onClose
}: ConversationContentProps) {
  console.log("[ConversationContent]", { currentConversationId, hasConversations });
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

  return <AIConversationEmptyPane onCreate={onCreate} />;
}
