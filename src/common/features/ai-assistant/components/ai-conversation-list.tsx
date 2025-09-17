import { AIConversation } from "@/common/types/ai-conversation";

interface ConversationListProps {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  withHeader?: boolean;
}

export function AIConversationList({
  conversations,
  currentConversationId,
  loading,
  onSelect,
  withHeader = true,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      {withHeader && <div className="p-4" />}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-accent ${
                currentConversationId === conversation.id ? "bg-accent" : ""
              }`}
              onClick={() => onSelect(conversation.id)}
            >
              <div className="font-medium truncate">{conversation.title}</div>
              <div className="text-xs text-muted-foreground">
                {conversation.messageCount} messages
              </div>
              <div className="text-xs text-muted-foreground">
                {conversation.lastMessageAt.toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
