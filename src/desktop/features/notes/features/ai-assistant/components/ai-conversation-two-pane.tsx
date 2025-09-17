import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { AIConversationChat } from "@/common/features/ai-assistant/components/ai-conversation-chat";
import { AIConversationEmptyPane } from "@/common/features/ai-assistant/components/ai-conversation-empty-pane";
import { AIConversation } from "@/common/types/ai-conversation";

interface Props {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  channelId: string;
  onClose?: () => void;
}

export function AIConversationTwoPane({ conversations, currentConversationId, loading, onSelect, onCreate, channelId, onClose }: Props) {
  const hasConversations = conversations.length > 0;
  return (
    <>
      <div className="w-80 flex flex-col">
        <AIConversationList
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          onSelect={onSelect}
          withHeader={false}
        />
      </div>
      <div className="flex-1 flex flex-col">
        {currentConversationId ? (
          <AIConversationChat conversationId={currentConversationId} channelId={channelId} onClose={onClose} />
        ) : hasConversations ? (
          <div className="flex-1" />
        ) : (
          <AIConversationEmptyPane onCreate={onCreate} />
        )}
      </div>
    </>
  );
}


