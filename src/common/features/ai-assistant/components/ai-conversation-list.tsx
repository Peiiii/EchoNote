import { ConversationListProps } from "../types/conversation.types";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Trash2 } from "lucide-react";
import { useConversationState } from "../hooks/use-conversation-state";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/common/components/ui/popover";

export function AIConversationList({
  conversations,
  currentConversationId,
  loading,
  withHeader = true,
}: ConversationListProps) {
  const { selectConversation, deleteConversation } = useConversationState();
  const { userId } = useNotesDataStore();
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
              onClick={() => selectConversation(c.id)}
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
                {userId && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-2 rounded-md"
                        onClick={(e) => { e.stopPropagation(); }}
                        onMouseDown={(e) => { e.stopPropagation(); }}
                        onKeyDown={(e) => { e.stopPropagation(); }}
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={6} className="p-2 w-56" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                      <div className="text-sm mb-2">Delete this conversation?</div>
                      <div className="flex justify-end gap-2">
                        <PopoverClose asChild>
                          <button
                            type="button"
                            className="h-8 px-3 rounded-md text-sm border hover:bg-accent"
                            onClick={(e) => { e.stopPropagation(); }}
                          >
                            Cancel
                          </button>
                        </PopoverClose>
                        <PopoverClose asChild>
                          <button
                            type="button"
                            className="h-8 px-3 rounded-md text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={(e) => { e.stopPropagation(); void deleteConversation(userId, c.id); }}
                          >
                            Delete
                          </button>
                        </PopoverClose>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
