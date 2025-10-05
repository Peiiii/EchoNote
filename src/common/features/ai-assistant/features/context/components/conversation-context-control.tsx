import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useCallback } from "react";
import { useConversationContextDraft } from "../hooks/use-conversation-context-draft";
import { useContextStatus } from "../hooks/use-context-status";
import { useChannelFiltering } from "../hooks/use-channel-filtering";
import { useContextDisplay } from "../hooks/use-context-display";
import { cn } from "@/common/lib/utils";
import { Ban, Check, Globe, Layers, Search, SlidersHorizontal, Sparkles } from "lucide-react";

interface Props {
  conversationId: string;
  fallbackChannelId: string;
  onActiveToolChannelChange?: (id: string | null) => void;
  activeToolChannelId?: string | null;
  variant?: 'inline' | 'banner' | 'compact';
}

export function ConversationContextControl({ conversationId, fallbackChannelId, onActiveToolChannelChange, activeToolChannelId, variant = 'inline' }: Props) {
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const { channels } = useNotesDataStore();

  const getChannelName = useCallback((id: string) => channels.find(ch => ch.id === id)?.name || id, [channels]);

  // Use custom hooks for different concerns
  const {
    draftMode,
    setDraftMode,
    draftChannelIds,
    toggleChannel,
    apply,
    isSelectedMode
  } = useConversationContextDraft({
    conversationId,
    fallbackChannelId,
    onActiveToolChannelChange,
    activeToolChannelId
  });

  const { searchQuery, setSearchQuery, filteredChannels } = useChannelFiltering(channels);

  const { anyLoading, tooltip } = useContextStatus({
    conversationId,
    fallbackChannelId,
    contexts: conv?.contexts,
    getChannelName
  });

  const { label, otherCount, totalCount } = useContextDisplay({
    contexts: conv?.contexts,
    fallbackChannelId,
    getChannelName,
    channelsLength: channels.length
  });




  const containerClass = variant === 'banner'
    ? 'flex items-center gap-2 px-3 py-2 border-b bg-background/60'
    : variant === 'compact'
      ? 'inline-flex items-center'
      : 'inline-flex items-center gap-1';


  return (
    <div className={containerClass}>
      <Popover modal>
        <PopoverTrigger asChild>
          {variant === 'compact' ? (
            <button
              type="button"
              aria-label={`Context: ${label}`}
              title={tooltip || label}
              className="relative h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
            >
              {(() => {
                const ctx = conv?.contexts;
                if (!ctx) return <Sparkles className="w-4 h-4" />; // Auto
                if (ctx.mode === 'none') return <Ban className="w-4 h-4" />;
                if (ctx.mode === 'all') return <Globe className="w-4 h-4" />;
                if (ctx.mode === 'channels') return <Layers className="w-4 h-4" />;
                return <SlidersHorizontal className="w-4 h-4" />;
              })()}
              {/* Total count badge (top-right). Show total instead of +N since compact does not show names */}
              {totalCount > 0 && (
                <span className="absolute top-0 right-0.5 min-w-[14px] h-3 px-1 rounded-full bg-muted text-foreground/80 text-[10px] leading-3 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
              {/* Status dot at bottom-center for better proximity (slightly more inset) */}
              <span className={"absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full " + (anyLoading ? 'bg-primary animate-pulse' : 'bg-emerald-500')} />
            </button>
          ) : (
            <button type="button" title={tooltip || label} className="relative inline-flex items-center gap-2 text-xs px-2 py-1 rounded-sm border hover:bg-accent">
              <span className="text-muted-foreground">Context</span>
              <span className="font-medium text-foreground/90 truncate max-w-[10rem]">{label}</span>
              {otherCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1 rounded-sm border bg-muted text-foreground/80 whitespace-nowrap">+{otherCount}</span>
              )}
              <span className={"ml-1 w-1.5 h-1.5 rounded-full " + (anyLoading ? 'bg-primary animate-pulse' : 'bg-emerald-500')} />
            </button>
          )}
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6} className="p-3 w-80 max-w-[90vw] max-h-[70vh] overflow-hidden mr-4 sm:mr-0" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
          <div className="text-sm font-medium mb-2">Conversation Context</div>
          {anyLoading && (
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Parsing contexts…</span>
            </div>
          )}
          <div className="space-y-3">
            <RadioGroup
              value={draftMode}
              onValueChange={(v) => setDraftMode(v as typeof draftMode)}
              className="grid gap-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem id="ctx-auto" value="auto" />
                <Label htmlFor="ctx-auto" className="text-sm">Auto (follow current channel)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="ctx-none" value="none" />
                <Label htmlFor="ctx-none" className="text-sm">No Context</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="ctx-all" value="all" />
                <Label htmlFor="ctx-all" className="text-sm">All Channels</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem id="ctx-selected" value="channels" />
                <Label htmlFor="ctx-selected" className="text-sm">Selected Channels</Label>
              </div>
            </RadioGroup>

            <div className={cn("border rounded-sm bg-muted/30", isSelectedMode ? "" : "opacity-40 pointer-events-none")}>
              {/* Simple search */}
              <div className="p-2 border-b">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-7 h-7 text-xs"
                    />
                  </div>
                  {/* Selection count */}
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {draftChannelIds.length} of {filteredChannels.length}
                  </div>
                </div>
              </div>

              {/* Compact channels list */}
              <div className="max-h-32 overflow-y-auto">
                {filteredChannels.length === 0 ? (
                  <div className="text-center py-4 text-xs text-muted-foreground">
                    {searchQuery ? 'No channels found' : 'No channels'}
                  </div>
                ) : (
                  <div className="p-1">
                    {filteredChannels.map(ch => {
                      const checked = draftChannelIds.includes(ch.id);
                      const isFallback = ch.id === fallbackChannelId;
                      
                      return (
                        <div
                          key={ch.id}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1 rounded text-xs hover:bg-accent/50 cursor-pointer",
                            checked && "bg-primary/10"
                          )}
                          onClick={() => toggleChannel(ch.id)}
                        >
                          <span className="text-sm">{ch.emoji || '📝'}</span>
                          <div 
                            className="flex-1 min-w-0 truncate text-xs"
                          >
                            {ch.name}
                          </div>
                          <div className="flex items-center gap-1">
                            {isFallback && (
                              <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
                            )}
                            {checked && (
                              <Check className="w-3 h-3 text-primary" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {draftMode === 'channels' && onActiveToolChannelChange && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Active Tool Channel</div>
                <select
                  value={activeToolChannelId && draftChannelIds.includes(activeToolChannelId) ? activeToolChannelId : (draftChannelIds[0] || '')}
                  onChange={e => onActiveToolChannelChange(e.target.value || null)}
                  className="w-full h-8 px-2 rounded-sm border bg-background text-sm"
                >
                  {draftChannelIds.length === 0 && <option value="">(none)</option>}
                  {draftChannelIds.map(id => (
                    <option key={id} value={id}>{getChannelName(id)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <PopoverClose asChild>
                <button type="button" className="h-8 px-3 rounded-md text-sm border hover:bg-accent">Cancel</button>
              </PopoverClose>
              <PopoverClose asChild>
                <button type="button" className="h-8 px-3 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => void apply()}>Apply</button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
