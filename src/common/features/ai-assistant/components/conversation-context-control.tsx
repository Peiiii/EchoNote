import { useMemo, useState, useCallback, useEffect } from "react";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/common/components/ui/popover";
import { Checkbox } from "@/common/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { Label } from "@/common/components/ui/label";
// import { ScrollArea } from "@/common/components/ui/scroll-area";
import { cn } from "@/common/lib/utils";
import { SlidersHorizontal, Sparkles, Globe, Ban, Layers } from "lucide-react";
import { useContextStatusStore } from "@/common/features/ai-assistant/stores/context-status.store";
import { contextDataCache } from "@/common/features/ai-assistant/services/context-data-cache";

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

  // Keep local draft in sync when switching conversations or when contexts updated externally
  useEffect(() => {
    setDraftMode(conv?.contexts ? conv.contexts.mode : 'auto');
    setDraftChannelIds(conv?.contexts?.mode === 'channels' ? (conv?.contexts?.channelIds || [fallbackChannelId]) : [fallbackChannelId]);
  }, [conversationId, conv?.contexts, fallbackChannelId]);

  const getChannelName = useCallback((id: string) => channels.find(ch => ch.id === id)?.name || id, [channels]);

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
      void contextDataCache.ensureTopIds(5).then(() => {
        const ids = contextDataCache.getTopIdsSnapshot(5);
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
      <Popover>
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
        <PopoverContent align="start" sideOffset={6} className="p-3 w-[22rem] max-w-[90vw] max-h-[70vh] overflow-hidden" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
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

            <div className={cn("border rounded-sm bg-muted/30", isSelectedMode ? "" : "opacity-40 pointer-events-none") }>
              <div className="h-40 overflow-y-auto pr-1 -mr-1 touch-pan-y overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className="py-1 pr-1">
                  {channels.map(ch => {
                    const id = `ctx-ch-${ch.id}`;
                    const checked = draftChannelIds.includes(ch.id);
                    return (
                      <div key={ch.id} className="flex items-center gap-2 px-2 py-1 w-full">
                        <Checkbox id={id} checked={checked} onCheckedChange={() => toggleChannel(ch.id)} />
                        <Label htmlFor={id} className="text-sm truncate cursor-pointer flex-1">{ch.name}</Label>
                      </div>
                    );
                  })}
                </div>
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
