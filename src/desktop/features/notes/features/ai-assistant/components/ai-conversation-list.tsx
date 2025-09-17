import { Plus, MessageSquare } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { AIConversation } from "@/common/types/ai-conversation";

interface ConversationListProps {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onCreate: () => void;
  onSelect: (id: string) => void;
  withHeader?: boolean;
}

// Reusable conversation list for both two-pane sidebar and single-pane list view.
export function AIConversationList({
  conversations,
  currentConversationId,
  loading,
  onCreate,
  onSelect,
  withHeader = true,
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      {withHeader && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-lg font-semibold">AI Conversations</h2>
          </div>
          <Button onClick={onCreate} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 cursor-pointer hover:bg-accent border-b border-border ${
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

