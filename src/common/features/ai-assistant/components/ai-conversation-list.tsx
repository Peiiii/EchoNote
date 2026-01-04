import { ConversationListProps } from "../types/conversation.types";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Trash2, Archive, Filter, MessageSquare } from "lucide-react";
import { useConversationState } from "../hooks/use-conversation-state";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/common/components/ui/popover";
import { useConversationStore } from "../stores/conversation.store";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { useState } from "react";

export function AIConversationList({
  conversations,
  currentConversationId,
  loading,
}: ConversationListProps) {
  const { t } = useTranslation();
  const {
    selectConversation,
    deleteConversation,
    updateConversation,
    loadMoreConversations,
    hasMore,
    loadingMore,
  } = useConversationState();
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
    return (c.title || "").toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 sticky top-0 z-10 flex items-center gap-3">
        <div className="flex-1">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('aiAssistant.conversationList.searchPlaceholder')}
            className="w-full h-9 px-3 rounded-lg border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-9 w-9 inline-flex items-center justify-center rounded-lg border bg-background hover:bg-accent transition-colors"
              aria-label={t('aiAssistant.conversationList.filter')}
            >
              <Filter className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            sideOffset={6}
            className="p-2 w-56"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className="w-full h-8 px-3 rounded-md border bg-background text-sm flex items-center justify-between hover:bg-accent transition-colors"
            >
              <span>{t('aiAssistant.conversationList.showArchived')}</span>
              <span
                className={
                  "inline-block w-4 h-4 rounded-sm border " +
                  (showArchived ? "bg-primary border-primary" : "bg-background")
                }
              ></span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">{t('common.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">{t('aiAssistant.conversationList.noConversations')}</div>
        ) : (
          <>
            {filtered.map(c => (
              <div
                key={c.id}
                className={`group px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors ${currentConversationId === c.id ? "bg-accent" : ""} ${deletingIds.includes(c.id) ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => selectConversation(c.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-foreground truncate mb-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate">
                          {editingId === c.id ? (
                            <input
                              value={draftTitle}
                              onChange={e => setDraftTitle(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  const t = draftTitle.trim();
                                  if (t && userId) {
                                    void updateConversation(userId, c.id, { title: t });
                                  }
                                  setEditingId(null);
                                }
                                if (e.key === "Escape") {
                                  setEditingId(null);
                                }
                              }}
                              onBlur={() => {
                                const t = draftTitle.trim();
                                if (t && userId) {
                                  void updateConversation(userId, c.id, { title: t });
                                }
                                setEditingId(null);
                              }}
                              className="h-7 px-2 rounded-sm border bg-background text-sm w-full"
                              autoFocus
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <span
                              onDoubleClick={e => {
                                e.stopPropagation();
                                setEditingId(c.id);
                                setDraftTitle(c.title || "");
                              }}
                            >
                              {titleGeneratingMap[c.id]
                                ? t('aiAssistant.conversationList.generatingTitle')
                                : c.title || t('aiAssistant.conversationList.newConversation')}
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <MessageSquare className="w-3 h-3 text-muted-foreground/60" />
                          <span className="text-xs text-muted-foreground/70">{c.messageCount}</span>
                        </div>
                      </div>
                      {c.isArchived && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                          {t('aiAssistant.conversationList.archived')}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeForSocial(c.lastMessageAt)}
                    </div>
                  </div>
                  {userId && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent/50 transition-colors"
                        onClick={e => {
                          e.stopPropagation();
                          if (!c.isArchived) {
                            void updateConversation(userId, c.id, { isArchived: true });
                            toast.success(t('aiAssistant.conversationList.archivedSuccess'));
                          } else {
                            void updateConversation(userId, c.id, { isArchived: false });
                            toast.success(t('aiAssistant.conversationList.restoredSuccess'));
                          }
                        }}
                        aria-label={c.isArchived ? t('aiAssistant.conversationList.restoreConversation') : t('aiAssistant.conversationList.archiveConversation')}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent/50 transition-colors"
                            onClick={e => {
                              e.stopPropagation();
                            }}
                            onMouseDown={e => {
                              e.stopPropagation();
                            }}
                            onKeyDown={e => {
                              e.stopPropagation();
                            }}
                            aria-label={t('aiAssistant.conversationList.deleteConversation')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="p-2 w-56"
                          onClick={e => e.stopPropagation()}
                          onMouseDown={e => e.stopPropagation()}
                        >
                          <div className="text-sm mb-2">{t('aiAssistant.conversationList.deleteConfirm')}</div>
                          <div className="flex justify-end gap-2">
                            <PopoverClose asChild>
                              <button
                                type="button"
                                className="h-8 px-3 rounded-md text-sm border hover:bg-accent"
                                onClick={e => {
                                  e.stopPropagation();
                                }}
                              >
                                {t('common.cancel')}
                              </button>
                            </PopoverClose>
                            <PopoverClose asChild>
                              <button
                                type="button"
                                className="h-8 px-3 rounded-md text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={e => {
                                  e.stopPropagation();
                                  void deleteConversation(userId, c.id)
                                    .then(() => toast.success(t('aiAssistant.conversationList.deletedSuccess')))
                                    .catch(() => toast.error(t('aiAssistant.conversationList.deleteFailed')));
                                }}
                              >
                                {t('common.delete')}
                              </button>
                            </PopoverClose>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {hasMore && userId && (
              <div className="p-4 border-t">
                <button
                  type="button"
                  className="w-full h-9 px-4 rounded-lg text-sm border bg-background hover:bg-accent disabled:opacity-60 transition-colors"
                  disabled={loadingMore}
                  onClick={() => {
                    void loadMoreConversations(userId);
                  }}
                >
                  {loadingMore ? t('common.loading') : t('aiAssistant.conversationList.loadMore')}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
