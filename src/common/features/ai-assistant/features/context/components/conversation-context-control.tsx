import { Input } from "@/common/components/ui/input";
import { RefinedPopover } from "@/common/components/refined-popover";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useCallback, useState } from "react";
import { useConversationContextDraft } from "../hooks/use-conversation-context-draft";
import { useContextStatus } from "../hooks/use-context-status";
import { useChannelFiltering } from "../hooks/use-channel-filtering";
import { useContextDisplay } from "../hooks/use-context-display";
import { cn } from "@/common/lib/utils";
import {
  Ban,
  Check,
  ChevronDown,
  Globe,
  Layers,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { ConversationContextMode } from "@/common/types/ai-conversation";

// Internal component for context option items
interface ContextOptionProps {
  mode: ConversationContextMode;
  currentMode: ConversationContextMode;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  showChevron?: boolean;
  isExpanded?: boolean;
}

function ContextOption({
  mode,
  currentMode,
  icon,
  title,
  description,
  onClick,
  showChevron = false,
  isExpanded = false,
}: ContextOptionProps) {
  const isSelected = currentMode === mode;

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200",
        isSelected ? "bg-primary/8 text-primary" : "hover:bg-accent/30 text-foreground"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 flex-1">
        <div
          className={cn("transition-colors", isSelected ? "text-primary" : "text-muted-foreground")}
        >
          {icon}
        </div>
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground/70">{description}</span>
        {showChevron && (
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground/60 transition-all duration-200",
              isExpanded ? "rotate-180" : ""
            )}
          />
        )}
      </div>
    </div>
  );
}

// Internal component for channel selection
interface ChannelSelectorProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredChannels: Array<{ id: string; name: string; emoji?: string }>;
  draftChannelIds: string[];
  toggleChannel: (id: string) => void;
  fallbackChannelId: string;
}

function ChannelSelector({
  searchQuery,
  setSearchQuery,
  filteredChannels,
  draftChannelIds,
  toggleChannel,
  fallbackChannelId,
}: ChannelSelectorProps) {
  return (
    <div className="bg-muted/35 border border-muted/50 rounded-lg shadow-sm transition-all">
      {/* Search bar */}
      <div className="p-2.5 border-b border-muted/45 bg-muted/15">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <Input
            placeholder="Search spaces..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-7 text-sm border-0 bg-background/95 focus:bg-background focus:ring-1 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Channels list */}
      <div className="max-h-32 overflow-y-auto">
        {filteredChannels.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-muted-foreground/50 mb-1.5 text-lg">
              {searchQuery ? "🔍" : "📁"}
            </div>
            <div className="text-xs text-muted-foreground/70">
              {searchQuery ? "No spaces found" : "No spaces available"}
            </div>
          </div>
        ) : (
          <div className="p-1.5 space-y-0.5">
            {filteredChannels.map(ch => {
              const checked = draftChannelIds.includes(ch.id);
              const isFallback = ch.id === fallbackChannelId;

              return (
                <div
                  key={ch.id}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-200 cursor-pointer",
                    checked ? "bg-primary/6 text-primary" : "hover:bg-accent/25 text-foreground"
                  )}
                  onClick={() => toggleChannel(ch.id)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm">{ch.emoji || "📝"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{ch.name}</div>
                      {isFallback && <div className="text-xs text-primary/80">Current space</div>}
                    </div>
                  </div>
                  {checked && <Check className="w-4 h-4 text-primary" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// Internal component for tool channel selector
interface ToolChannelSelectorProps {
  activeToolChannelId: string | null;
  draftChannelIds: string[];
  onActiveToolChannelChange: (id: string | null) => void;
  getChannelName: (id: string) => string;
}

function ToolChannelSelector({
  activeToolChannelId,
  draftChannelIds,
  onActiveToolChannelChange,
  getChannelName,
}: ToolChannelSelectorProps) {
  return (
    <div className="p-2.5 rounded-lg bg-muted/35 border border-muted/50 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground/70" />
        <span className="text-sm font-medium text-foreground/90">Active Tool Space</span>
      </div>
      <select
        value={
          activeToolChannelId && draftChannelIds.includes(activeToolChannelId)
            ? activeToolChannelId
            : draftChannelIds[0] || ""
        }
        onChange={e => onActiveToolChannelChange(e.target.value || null)}
        className="w-full h-7 px-2.5 rounded-lg border-0 bg-background/95 text-sm focus:bg-background focus:ring-1 focus:ring-primary/20 transition-all duration-200"
      >
        {draftChannelIds.length === 0 && <option value="">(none)</option>}
        {draftChannelIds.map(id => (
          <option key={id} value={id}>
            {getChannelName(id)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface Props {
  conversationId: string;
  fallbackChannelId: string;
  onActiveToolChannelChange?: (id: string | null) => void;
  activeToolChannelId?: string | null;
  variant?: "inline" | "banner" | "compact";
}

export function ConversationContextControl({
  conversationId,
  fallbackChannelId,
  onActiveToolChannelChange,
  activeToolChannelId,
  variant = "inline",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const { channels } = useNotesDataStore();

  const getChannelName = useCallback(
    (id: string) => channels.find(ch => ch.id === id)?.name || id,
    [channels]
  );

  // Use custom hooks for different concerns
  const { draftMode, setDraftMode, draftChannelIds, toggleChannel, apply } =
    useConversationContextDraft({
      conversationId,
      fallbackChannelId,
      onActiveToolChannelChange,
      activeToolChannelId,
    });

  const { searchQuery, setSearchQuery, filteredChannels } = useChannelFiltering(channels);

  const { anyLoading, tooltip } = useContextStatus({
    conversationId,
    fallbackChannelId,
    contexts: conv?.contexts,
    getChannelName,
  });

  const { label, otherCount, totalCount } = useContextDisplay({
    contexts: conv?.contexts,
    fallbackChannelId,
    getChannelName,
    channelsLength: channels.length,
  });

  const [isCustomExpanded, setIsCustomExpanded] = useState(
    draftMode === ConversationContextMode.CHANNELS
  );

  const containerClass =
    variant === "banner"
      ? "flex items-center gap-2 px-3 py-2 border-b bg-background/60"
      : variant === "compact"
        ? "inline-flex items-center"
        : "inline-flex items-center gap-1";

  return (
    <div className={containerClass}>
      <RefinedPopover open={isOpen} onOpenChange={setIsOpen} modal>
        <RefinedPopover.Trigger asChild>
          {variant === "compact" ? (
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
                if (ctx.mode === ConversationContextMode.CHANNELS)
                  return <Layers className="w-4 h-4" />;
                return <SlidersHorizontal className="w-4 h-4" />;
              })()}
              {/* Total count badge (top-right). Show total instead of +N since compact does not show names */}
              {totalCount > 0 && (
                <span className="absolute top-0 right-0.5 min-w-[14px] h-3 px-1 rounded-full bg-muted text-foreground/80 text-[10px] leading-3 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
              {/* Status dot at bottom-center for better proximity (slightly more inset) */}
              <span
                className={
                  "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full " +
                  (anyLoading ? "bg-primary animate-pulse" : "bg-emerald-500")
                }
              />
            </button>
          ) : (
            <button
              type="button"
              title={tooltip || label}
              className="relative inline-flex items-center gap-1.5 text-sm px-2.5 py-1.5 rounded-md bg-background/50 backdrop-blur-sm border border-border/30 shadow-xs hover:shadow-sm hover:border-border/50 hover:bg-accent/30 text-muted-foreground hover:text-foreground transition-all duration-200 ease-out"
            >
              {(() => {
                const ctx = conv?.contexts;
                if (!ctx || ctx.mode === ConversationContextMode.AUTO) return <Sparkles className="w-4 h-4 text-muted-foreground/70" />; // Auto
                if (ctx.mode === ConversationContextMode.NONE) return <Ban className="w-4 h-4 text-muted-foreground/70" />;
                if (ctx.mode === ConversationContextMode.ALL) return <Globe className="w-4 h-4 text-muted-foreground/70" />;
                if (ctx.mode === ConversationContextMode.CHANNELS)
                  return <Layers className="w-4 h-4 text-muted-foreground/70" />;
                return <SlidersHorizontal className="w-4 h-4 text-muted-foreground/70" />;
              })()}
              <span className="font-medium text-foreground/90 truncate max-w-[10rem]">{label}</span>
              {otherCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1 rounded-sm border bg-muted text-foreground/80 whitespace-nowrap">
                  +{otherCount}
                </span>
              )}
              <span
                className={
                  "w-1.5 h-1.5 rounded-full " +
                  (anyLoading ? "bg-primary animate-pulse" : "bg-emerald-500")
                }
              />
              <ChevronDown className="w-4 h-4 text-muted-foreground/60" />
            </button>
          )}
        </RefinedPopover.Trigger>
        <RefinedPopover.Content width="w-80" align="center" side="bottom">
          <RefinedPopover.Header>
            <SlidersHorizontal className="w-4 h-4 text-primary/80" />
            <div className="text-sm font-semibold text-foreground/90">Context Settings</div>
            <RefinedPopover.Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 ml-auto"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              <X className="h-3 w-3" />
            </RefinedPopover.Button>
          </RefinedPopover.Header>

          <RefinedPopover.Body>
            {anyLoading && (
              <div className="mb-3 p-2.5 rounded-lg bg-primary/6">
                <div className="flex items-center gap-2 text-xs text-primary/90">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>Loading context data...</span>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <ContextOption
                mode={ConversationContextMode.AUTO}
                currentMode={draftMode}
                icon={<Sparkles className="w-4 h-4 text-muted-foreground" />}
                title="Auto"
                description="Current space"
                onClick={() => {
                  setDraftMode(ConversationContextMode.AUTO);
                  setIsCustomExpanded(false);
                }}
              />

              <ContextOption
                mode={ConversationContextMode.NONE}
                currentMode={draftMode}
                icon={<Ban className="w-4 h-4 text-muted-foreground" />}
                title="No Context"
                description="Clean chat"
                onClick={() => {
                  setDraftMode(ConversationContextMode.NONE);
                  setIsCustomExpanded(false);
                }}
              />

              <ContextOption
                mode={ConversationContextMode.ALL}
                currentMode={draftMode}
                icon={<Globe className="w-4 h-4 text-muted-foreground" />}
                title="All Spaces"
                description="Full access"
                onClick={() => {
                  setDraftMode(ConversationContextMode.ALL);
                  setIsCustomExpanded(false);
                }}
              />

              <ContextOption
                mode={ConversationContextMode.CHANNELS}
                currentMode={draftMode}
                icon={<Layers className="w-4 h-4 text-muted-foreground" />}
                title="Custom"
                description="Select specific"
                showChevron={true}
                isExpanded={isCustomExpanded}
                onClick={() => {
                  if (draftMode === ConversationContextMode.CHANNELS) {
                    setIsCustomExpanded(!isCustomExpanded);
                  } else {
                    setDraftMode(ConversationContextMode.CHANNELS);
                    setIsCustomExpanded(true);
                  }
                }}
              />

              {/* Expandable channel selection */}
              {isCustomExpanded && (
                <ChannelSelector
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filteredChannels={filteredChannels}
                  draftChannelIds={draftChannelIds}
                  toggleChannel={toggleChannel}
                  fallbackChannelId={fallbackChannelId}
                />
              )}

              {draftMode === ConversationContextMode.CHANNELS && onActiveToolChannelChange && (
                <ToolChannelSelector
                  activeToolChannelId={activeToolChannelId || null}
                  draftChannelIds={draftChannelIds}
                  onActiveToolChannelChange={onActiveToolChannelChange}
                  getChannelName={getChannelName}
                />
              )}
            </div>
          </RefinedPopover.Body>

          <RefinedPopover.Actions>
            <RefinedPopover.Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </RefinedPopover.Button>
            <RefinedPopover.Button
              type="button"
              variant="default"
              onClick={() => {
                void apply();
                setIsOpen(false);
              }}
            >
              Apply Changes
            </RefinedPopover.Button>
          </RefinedPopover.Actions>
        </RefinedPopover.Content>
      </RefinedPopover>
    </div>
  );
}
