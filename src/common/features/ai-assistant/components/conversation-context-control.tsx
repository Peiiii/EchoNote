import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { contextDataCache } from "@/common/features/ai-assistant/services/context-data-cache";
import { useContextStatusStore } from "@/common/features/ai-assistant/stores/context-status.store";
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
  const updateConversation = useConversationStore(s => s.updateConversation);
  const { userId, channels } = useNotesDataStore();

  const [draftMode, setDraftMode] = useState<'auto' | ConversationContextConfig["mode"]>(conv?.contexts ? conv.contexts.mode : 'auto');
  const [draftChannelIds, setDraftChannelIds] = useState<string[]>(conv?.contexts?.mode === 'channels' ? (conv?.contexts?.channelIds || [fallbackChannelId]) : [fallbackChannelId]);
  const [searchQuery, setSearchQuery] = useState('');

  // Keep local draft in sync when switching conversations or when contexts updated externally
  useEffect(() => {
    setDraftMode(conv?.contexts ? conv.contexts.mode : 'auto');
    setDraftChannelIds(conv?.contexts?.mode === 'channels' ? (conv?.contexts?.channelIds || [fallbackChannelId]) : [fallbackChannelId]);
  }, [conversationId, conv?.contexts, fallbackChannelId]);

  const getChannelName = useCallback((id: string) => channels.find(ch => ch.id === id)?.name || id, [channels]);

  // Filter and sort channels for better UX
  const filteredChannels = useMemo(() => {
    let filtered = channels;
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = channels.filter(ch => 
        ch.name.toLowerCase().includes(query) || 
        ch.description?.toLowerCase().includes(query)
      );
    }
    
    // Sort by: message count (most active first), then alphabetically
    // Remove selected-first sorting to keep order stable
    return filtered.sort((a, b) => {
      // First by message count (most active first)
      if (a.messageCount !== b.messageCount) {
        return b.messageCount - a.messageCount;
      }
      
      // Then alphabetically
      return a.name.localeCompare(b.name);
    });
  }, [channels, searchQuery]);

  const label = useMemo(() => {
    const ctx = conv?.contexts;
    if (!ctx) return `Auto (${getChannelName(fallbackChannelId)})`;
    if (ctx.mode === 'none') return 'No Context';
    if (ctx.mode === 'all') return 'All Channels';
    const ids = ctx.channelIds || [];
    if (ids.length === 0) return 'No Context';
    if (ids.length === 1) return getChannelName(ids[0]);
    // Only render the first name in the truncated label; we will render +N as a separate badge to avoid truncation hiding it
    return getChannelName(ids[0]);
  }, [conv?.contexts, fallbackChannelId, getChannelName]);

  const otherCount = useMemo(() => {
    const ctx = conv?.contexts;
    if (!ctx || ctx.mode !== 'channels') return 0;
    const ids = ctx.channelIds || [];
    return Math.max(0, ids.length - 1);
  }, [conv?.contexts]);

  // Total count for compact/mobile where no names are shown
  const totalCount = useMemo(() => {
    const ctx = conv?.contexts;
    if (!ctx) return 1; // Auto -> current channel
    if (ctx.mode === 'none') return 0;
    if (ctx.mode === 'all') return channels.length;
    const ids = ctx.channelIds || [];
    return ids.length;
  }, [conv?.contexts, channels.length]);

  const isSelectedMode = draftMode === 'channels';
  const toggleChannel = (id: string) => {
    // Do not prefetch on draft changes; only fetch after Apply
    setDraftChannelIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };


  const apply = async () => {
    if (!userId || !conv) return;
    if (draftMode === 'auto') {
      // Clear contexts (store null to unset) so it follows current channel automatically
      await updateConversation(userId, conv.id, { contexts: null });
      return;
    }
    let next: ConversationContextConfig | undefined;
    if (draftMode === 'none') {
      next = { mode: 'none' };
    } else if (draftMode === 'all') {
      next = { mode: 'all' };
    } else {
      const ids = draftChannelIds.length ? draftChannelIds : [fallbackChannelId];
      next = { mode: 'channels', channelIds: ids };
      // If active tool channel not in list, adjust
      if (onActiveToolChannelChange) {
        const ensure = (activeToolChannelId && ids.includes(activeToolChannelId)) ? activeToolChannelId : ids[0];
        onActiveToolChannelChange(ensure);
      }
    }
    await updateConversation(userId, conv.id, { contexts: next });
    // After apply, prefetch contexts to reflect loading/ready quickly (applied state only)
    if (next?.mode === 'channels' && next.channelIds) {
      next.channelIds.forEach(id => void contextDataCache.ensureFetched(id));
    }
    if (next?.mode === 'all') {
      void contextDataCache.ensureAllMetas().then(() => {
        const ids = contextDataCache.getAllIdsSnapshot();
        // Progressive hydration; do not block UI
        ids.forEach(id => void contextDataCache.ensureFetched(id));
      });
    }
  };

  const containerClass = variant === 'banner'
    ? 'flex items-center gap-2 px-3 py-2 border-b bg-background/60'
    : variant === 'compact'
      ? 'inline-flex items-center'
      : 'inline-flex items-center gap-1';

  // Observe and compute loading status for status dot
  const observe = useContextStatusStore(s => s.observeSession);
  const session = useContextStatusStore(s => s.sessions[conversationId]);
  useEffect(() => {
    const mode: 'auto' | 'none' | 'all' | 'channels' = conv?.contexts ? conv.contexts.mode : 'auto';
    const ids = conv?.contexts?.mode === 'channels' ? (conv.contexts.channelIds || []) : undefined;
    const off = observe({ conversationId, mode, channelIds: ids, fallbackChannelId });
    return () => off();
  }, [conversationId, fallbackChannelId, conv?.contexts, observe]);

  const sessionAnyLoading = useMemo(() => {
    const s = session;
    if (!s) return false;
    // Now that topStatus('all') reflects full hydration (all channels fetched at least once),
    // a single flag is enough for the status dot.
    if (s.topStatus === 'loading') return true;
    return s.resolvedChannelIds.some(id => s.byChannel[id]?.status === 'loading');
  }, [session]);
  // Only reflect loading for applied contexts; do not trigger loads or loading UI for drafts
  const anyLoading = sessionAnyLoading;

  const tooltip = useMemo(() => {
    const s = session;
    if (!s) return label;
    if (s.mode === 'channels') {
      const parts = s.resolvedChannelIds.map(id => {
        const st = s.byChannel[id];
        const name = st?.channelName || getChannelName(id);
        const stat = st?.status || 'idle';
        return `${name}(${stat})`;
      });
      return parts.join(', ');
    }
    return label;
  }, [session, label, getChannelName]);

  return (
    <div className={containerClass}>
      <Popover modal>
        <PopoverTrigger asChild>
          {variant === 'compact' ? (
            <button
              type="button"
              aria-label={`Context: ${label}`}
              title={tooltip}
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
            <button type="button" title={tooltip} className="relative inline-flex items-center gap-2 text-xs px-2 py-1 rounded-sm border hover:bg-accent">
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
