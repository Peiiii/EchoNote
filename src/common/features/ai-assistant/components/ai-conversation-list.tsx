import { ConversationListProps } from "../types/conversation.types";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Trash2, Archive, Filter } from "lucide-react";
import { useConversationState } from "../hooks/use-conversation-state";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/common/components/ui/popover";
import { useConversationStore } from "../stores/conversation.store";
import { toast } from "sonner";

import { useState } from "react";

export function AIConversationList({ conversations, currentConversationId, loading }: ConversationListProps) {
  const { selectConversation, deleteConversation, updateConversation } = useConversationState();
  const { userId } = useNotesDataStore();
  const deletingIds = useConversationStore(s => s.deletingIds);
  const showArchived = useConversationStore(s => s.showArchived);
  const setShowArchived = useConversationStore(s => s.setShowArchived);
  const query = useConversationStore(s => s.query);
  const setQuery = useConversationStore(s => s.setQuery);
  const titleGeneratingMap = useConversationStore(s => s.titleGeneratingMap);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const filtered = conversations.filter(c => {
    if (!showArchived && c.isArchived) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (c.title || '').toLowerCase().includes(q);
  });
  return (
    <div className="flex flex-col h-full">
      <div className="p-2 px-3 sticky top-0 bg-background z-10 border-b flex items-center gap-2">
        <div className="flex-1">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full h-8 px-2 rounded-md border bg-muted text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-8 w-8 inline-flex items-center justify-center rounded-md border bg-background hover:bg-accent"
              aria-label="Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={6} className="p-2 w-56" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className="w-full h-8 px-2 rounded-md border bg-background text-sm flex items-center justify-between hover:bg-accent"
            >
              <span>Show archived</span>
              <span className={"inline-block w-5 h-5 rounded-sm border " + (showArchived ? 'bg-primary' : 'bg-background')}></span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No conversations yet</div>
        ) : (
          filtered.map((c) => (
            <div
              key={c.id}
              className={`group px-3 py-2 cursor-pointer hover:bg-accent ${currentConversationId === c.id ? "bg-accent" : ""} ${deletingIds.includes(c.id) ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => selectConversation(c.id)}
            >
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {editingId === c.id ? (
                      <input
                        value={draftTitle}
                        onChange={e => setDraftTitle(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { const t = draftTitle.trim(); if (t && userId) { void updateConversation(userId, c.id, { title: t }); } setEditingId(null); }
                          if (e.key === 'Escape') { setEditingId(null); }
                        }}
                        onBlur={() => { const t = draftTitle.trim(); if (t && userId) { void updateConversation(userId, c.id, { title: t }); } setEditingId(null); }}
                        className="h-7 px-2 rounded-sm border bg-background text-sm w-full"
                        autoFocus
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span onDoubleClick={(e) => { e.stopPropagation(); setEditingId(c.id); setDraftTitle(c.title || ''); }}>
                        {titleGeneratingMap[c.id] ? "Generating title..." : (c.title || "New Conversation")}
                      </span>
                    )}
                    {c.isArchived && <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">Archived</span>}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>{c.messageCount} messages</span>
                    <span>•</span>
                    <span>{formatTimeForSocial(c.lastMessageAt)}</span>
                  </div>
                </div>
                {userId && (
                  <>
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground p-2 rounded-md"
                    onClick={(e) => { e.stopPropagation(); if (!c.isArchived) { void updateConversation(userId, c.id, { isArchived: true }); toast.success('Conversation archived'); } else { void updateConversation(userId, c.id, { isArchived: false }); toast.success('Conversation restored'); } }}
                    aria-label={c.isArchived ? "Restore conversation" : "Archive conversation"}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
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
                            onClick={(e) => { e.stopPropagation(); void deleteConversation(userId, c.id).then(() => toast.success('Conversation deleted')).catch(() => toast.error('Delete failed')); }}
                          >
                            Delete
                          </button>
                        </PopoverClose>
                      </div>
                    </PopoverContent>
                  </Popover>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
