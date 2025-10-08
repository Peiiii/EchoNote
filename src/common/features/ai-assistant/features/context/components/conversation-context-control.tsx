import { Input } from "@/common/components/ui/input";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/common/components/ui/popover";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useCallback, useState } from "react";
import { useConversationContextDraft } from "../hooks/use-conversation-context-draft";
import { useContextStatus } from "../hooks/use-context-status";
import { useChannelFiltering } from "../hooks/use-channel-filtering";
import { useContextDisplay } from "../hooks/use-context-display";
import { cn } from "@/common/lib/utils";
import { Ban, Check, ChevronDown, Globe, Layers, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { ConversationContextMode } from "@/common/types/ai-conversation";

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
    apply
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

  const [isCustomExpanded, setIsCustomExpanded] = useState(draftMode === ConversationContextMode.CHANNELS);




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
                if (ctx.mode === ConversationContextMode.NONE) return <Ban className="w-4 h-4" />;
                if (ctx.mode === ConversationContextMode.ALL) return <Globe className="w-4 h-4" />;
                if (ctx.mode === ConversationContextMode.CHANNELS) return <Layers className="w-4 h-4" />;
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
        <PopoverContent align="start" sideOffset={6} className="p-4 w-80 max-w-[90vw] max-h-[70vh] overflow-hidden mr-4 sm:mr-0" onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <div className="text-sm font-semibold">Context Settings</div>
          </div>
          {anyLoading && (
            <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 text-xs text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>Loading context data...</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                draftMode === ConversationContextMode.AUTO 
                  ? "bg-primary/10 border-primary/30" 
                  : "hover:bg-accent/50 border-border"
              )}
              onClick={() => {
                setDraftMode(ConversationContextMode.AUTO);
                setIsCustomExpanded(false);
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Auto</span>
              </div>
              <span className="text-xs text-muted-foreground">Current channel</span>
            </div>
            
            <div 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                draftMode === ConversationContextMode.NONE 
                  ? "bg-primary/10 border-primary/30" 
                  : "hover:bg-accent/50 border-border"
              )}
              onClick={() => {
                setDraftMode(ConversationContextMode.NONE);
                setIsCustomExpanded(false);
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Ban className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">No Context</span>
              </div>
              <span className="text-xs text-muted-foreground">Clean chat</span>
            </div>
            
            <div 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                draftMode === ConversationContextMode.ALL 
                  ? "bg-primary/10 border-primary/30" 
                  : "hover:bg-accent/50 border-border"
              )}
              onClick={() => {
                setDraftMode(ConversationContextMode.ALL);
                setIsCustomExpanded(false);
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">All Channels</span>
              </div>
              <span className="text-xs text-muted-foreground">Full access</span>
            </div>
            
            <div 
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                draftMode === ConversationContextMode.CHANNELS 
                  ? "bg-primary/10 border-primary/30" 
                  : "hover:bg-accent/50 border-border"
              )}
              onClick={() => {
                if (draftMode === ConversationContextMode.CHANNELS) {
                  setIsCustomExpanded(!isCustomExpanded);
                } else {
                  setDraftMode(ConversationContextMode.CHANNELS);
                  setIsCustomExpanded(true);
                }
              }}
            >
              <div className="flex items-center gap-2 flex-1">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Custom</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Select specific</span>
                <ChevronDown 
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isCustomExpanded ? "rotate-180" : ""
                  )} 
                />
              </div>
            </div>

            {/* Expandable channel selection */}
            {isCustomExpanded && (
              <div className="rounded-lg border bg-muted/10 transition-all">
                {/* Search bar */}
                <div className="p-3 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search channels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-9 text-sm border-0 bg-background/50 focus:bg-background"
                    />
                  </div>
                </div>

                {/* Channels list */}
                <div className="max-h-40 overflow-y-auto">
                  {filteredChannels.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-muted-foreground/60 mb-1">
                        {searchQuery ? '🔍' : '📁'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {searchQuery ? 'No channels found' : 'No channels available'}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredChannels.map(ch => {
                        const checked = draftChannelIds.includes(ch.id);
                        const isFallback = ch.id === fallbackChannelId;
                        
                        return (
                          <div
                            key={ch.id}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer",
                              checked 
                                ? "bg-primary/10 border border-primary/20" 
                                : "hover:bg-accent/50 border border-transparent"
                            )}
                            onClick={() => toggleChannel(ch.id)}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-base">{ch.emoji || '📝'}</span>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{ch.name}</div>
                                {isFallback && (
                                  <div className="text-xs text-primary">Current channel</div>
                                )}
                              </div>
                            </div>
                            {checked && (
                              <Check className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {draftMode === ConversationContextMode.CHANNELS && onActiveToolChannelChange && (
              <div className="p-3 rounded-lg bg-muted/20 border">
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Active Tool Channel</span>
                </div>
                <select
                  value={activeToolChannelId && draftChannelIds.includes(activeToolChannelId) ? activeToolChannelId : (draftChannelIds[0] || '')}
                  onChange={e => onActiveToolChannelChange(e.target.value || null)}
                  className="w-full h-9 px-3 rounded-lg border bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {draftChannelIds.length === 0 && <option value="">(none)</option>}
                  {draftChannelIds.map(id => (
                    <option key={id} value={id}>{getChannelName(id)}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <PopoverClose asChild>
                <button type="button" className="h-9 px-4 rounded-lg text-sm border hover:bg-accent transition-colors">Cancel</button>
              </PopoverClose>
              <PopoverClose asChild>
                <button type="button" className="h-9 px-4 rounded-lg text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium" onClick={() => void apply()}>Apply Changes</button>
              </PopoverClose>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
