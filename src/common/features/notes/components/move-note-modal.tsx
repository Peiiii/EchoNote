import { useState, useMemo } from "react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { modal } from "@/common/components/modal";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/common/lib/utils";
import { useTranslation } from "react-i18next";

interface MoveNoteModalProps {
  fromChannelId: string;
  onMove: (toChannelId: string) => Promise<void>;
}

export function MoveNoteModal({ fromChannelId, onMove }: MoveNoteModalProps) {
  const { t } = useTranslation();
  const channels = useNotesDataStore(state => state.channels);
  const [search, setSearch] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const candidateChannels = useMemo(
    () => channels.filter(channel => channel.id !== fromChannelId),
    [channels, fromChannelId]
  );

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return candidateChannels;
    const keyword = search.trim().toLowerCase();
    return candidateChannels.filter(channel => {
      return (
        channel.name.toLowerCase().includes(keyword) ||
        (channel.description || "").toLowerCase().includes(keyword)
      );
    });
  }, [candidateChannels, search]);

  const selectedChannel = selectedChannelId
    ? channels.find(channel => channel.id === selectedChannelId) ?? null
    : null;

  const handleConfirm = async () => {
    if (!selectedChannelId || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onMove(selectedChannelId);
      modal.close();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('notes.moveNoteModal.error');
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-1 max-h-[80vh] flex flex-col">
      <div className="space-y-2 mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {t('notes.moveNoteModal.title')}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {t('notes.moveNoteModal.description')}
        </p>
      </div>
      {candidateChannels.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('notes.moveNoteModal.noSpaces')}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {t('notes.moveNoteModal.destinationSpace')}
            </span>
            <Input
              placeholder={t('notes.moveNoteModal.searchPlaceholder')}
              value={search}
              onChange={event => setSearch(event.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <ScrollArea className="mt-3 flex-1 min-h-[220px] max-h-[320px] pr-1">
            <div className="space-y-1.5 py-1">
              {filteredChannels.length === 0 ? (
                <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                  {t('notes.moveNoteModal.noMatches')}
                </p>
              ) : (
                filteredChannels.map(channel => {
                  const isSelected = channel.id === selectedChannelId;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      className={cn(
                        "w-full px-3 py-2 flex items-center gap-2.5 text-left text-sm transition-all duration-200 rounded-lg",
                        "hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                        isSelected ? "bg-primary/8 text-primary" : "text-foreground"
                      )}
                      onClick={() => {
                        setSelectedChannelId(channel.id);
                      }}
                      disabled={isSubmitting}
                      aria-pressed={isSelected}
                    >
                      {channel.emoji && <span className="text-lg">{channel.emoji}</span>}
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium truncate">{channel.name}</p>
                        {channel.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {channel.description}
                          </p>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
          {selectedChannel && (
            <div className="mt-3 rounded-md border border-slate-200/70 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{t('notes.moveNoteModal.willMoveTo')} </span>
              {selectedChannel.emoji && <span className="mr-1">{selectedChannel.emoji}</span>}
              <span className="font-medium">{selectedChannel.name}</span>
              {selectedChannel.description && (
                <span className="ml-1 text-slate-500 dark:text-slate-400">
                  <span aria-hidden="true">{t('notes.moveNoteModal.dashSeparator')}</span> {selectedChannel.description}
                </span>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => modal.close()} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={!selectedChannelId || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t('notes.moveNoteModal.moving')}
                </>
              ) : (
                t('notes.moveNoteModal.confirmMove')
              )}
            </Button>
          </div>
        </>
      )}
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
    </div>
  );
}
