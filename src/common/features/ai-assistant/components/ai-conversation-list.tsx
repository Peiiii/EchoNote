import { ConversationListProps } from "../types/conversation.types";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Trash2 } from "lucide-react";

export function AIConversationList({
  conversations,
  currentConversationId,
  loading,
  onSelect,
  onDelete,
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
          conversations.map((c) => (
            <div
              key={c.id}
              className={`group px-3 py-2 cursor-pointer hover:bg-accent ${currentConversationId === c.id ? "bg-accent" : ""}`}
              onClick={() => onSelect(c.id)}
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{c.title || "New Conversation"}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{c.messageCount} messages</span>
                    <span>•</span>
                    <span>{formatTimeForSocial(c.lastMessageAt)}</span>
                  </div>
                </div>
                {onDelete && (
                  <button
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-2 rounded-md"
                    onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                    aria-label="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
