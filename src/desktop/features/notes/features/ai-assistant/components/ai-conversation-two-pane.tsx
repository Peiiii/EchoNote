import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { ConversationContent } from "@/common/features/ai-assistant/components/conversation-content";
import { ConversationPaneProps } from "@/common/features/ai-assistant/types/conversation.types";

export function AIConversationTwoPane({
  conversations,
  currentConversationId,
  loading,
  channelId,
  onClose,
}: ConversationPaneProps) {
  const hasConversations = conversations.length > 0;

  return (
    <>
      <div className="w-80 flex flex-col">
        <AIConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          withHeader={false}
        />
      </div>
      <div className="flex-1 flex flex-col">
        <ConversationContent
          currentConversationId={currentConversationId}
          channelId={channelId}
          hasConversations={hasConversations}
          onClose={onClose}
        />
      </div>
    </>
  );
}
