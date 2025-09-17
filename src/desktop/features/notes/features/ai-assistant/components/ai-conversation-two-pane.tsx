import { AIConversationList } from "./ai-conversation-list";
import { AIConversationChat } from "./ai-conversation-chat";
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
          <EmptyPane onCreate={onCreate} />
        )}
      </div>
    </>
  );
}

function EmptyPane({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
        <p className="text-muted-foreground mb-4">Create a new conversation to start chatting</p>
        <button onClick={onCreate} className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
          Create Conversation
        </button>
      </div>
    </div>
  );
}

