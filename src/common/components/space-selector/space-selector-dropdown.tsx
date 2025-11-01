import { Badge } from "@/common/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Input } from "@/common/components/ui/input";
import { sortChannelsWithCurrentFirst } from "@/common/lib/channel-sorting";
import { getRecentChannelIds } from "@/common/lib/recent-channels";
import { Channel } from "@/core/stores/notes-data.store";
import { Check, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { cn } from "@/common/lib/utils";
import { getChannelIcon } from "@/desktop/features/notes/features/channel-management/components/channel-icons";

type DisplayItem = 
  | { type: "channel"; channel: Channel }
  | { type: "separator"; label: string };

interface SpaceSelectorItemProps {
  channel: Channel;
  isSelected: boolean;
  isCurrent: boolean;
  onSelect: (channelId: string) => void;
  highlightQuery?: string;
}

const SpaceSelectorItem = ({ 
  channel, 
  isSelected, 
  isCurrent,
  onSelect,
  highlightQuery 
}: SpaceSelectorItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(channel.id);
  }, [channel.id, onSelect]);

  const highlightText = (text: string, query?: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-primary/20 text-primary font-medium px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 min-h-[40px]",
        isSelected ? "bg-primary/6 text-primary" : "hover:bg-accent/25 text-foreground",
        isCurrent && !isSelected && "ring-1 ring-primary/30"
      )}
    >
      <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-muted-foreground">
        {channel.emoji ? (
          <span className="text-sm leading-none">{channel.emoji}</span>
        ) : (
          getChannelIcon(channel.id)
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="font-medium text-sm truncate">
            {highlightQuery ? highlightText(channel.name, highlightQuery) : channel.name}
          </div>
          {channel.messageCount !== undefined && channel.messageCount > 0 && (
            <Badge 
              variant="secondary" 
              className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0 font-normal"
            >
              {channel.messageCount}
            </Badge>
          )}
        </div>
        {channel.description && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {channel.description}
          </div>
        )}
      </div>

      <div className="flex-shrink-0 ml-1">
        {isSelected && (
          <Check className="w-4 h-4 text-primary" />
        )}
        {isCurrent && !isSelected && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
        )}
      </div>
    </div>
  );
};

interface SpaceSelectorDropdownProps {
  currentChannel: Channel;
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  trigger: React.ReactNode;
  className?: string;
  maxHeight?: number;
  itemHeight?: number;
}

export const SpaceSelectorDropdown = ({
  currentChannel,
  channels,
  onChannelSelect,
  trigger,
  className = "",
  maxHeight = 400,
  itemHeight = 40,
}: SpaceSelectorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const sortedChannels = useMemo(() => {
    return sortChannelsWithCurrentFirst(channels, currentChannel.id);
  }, [channels, currentChannel.id]);

  const { recentChannels, otherChannels, allChannels } = useMemo(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = sortedChannels.filter(channel => 
        channel.name.toLowerCase().includes(query) ||
        channel.description?.toLowerCase().includes(query)
      );
      return { recentChannels: [], otherChannels: [], allChannels: filtered };
    }

    const recentIds = getRecentChannelIds();
    const recentChannelsMap = new Map<string, Channel>();
    const otherChannelsList: Channel[] = [];

    for (const channel of sortedChannels) {
      if (recentIds.includes(channel.id) && channel.id !== currentChannel.id) {
        recentChannelsMap.set(channel.id, channel);
      } else if (channel.id !== currentChannel.id) {
        otherChannelsList.push(channel);
      }
    }

    const recentChannels = recentIds
      .map(id => recentChannelsMap.get(id))
      .filter((channel): channel is Channel => channel !== undefined)
      .slice(0, 8);

    return { recentChannels, otherChannels: otherChannelsList, allChannels: [] };
  }, [sortedChannels, currentChannel.id, searchQuery]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const displayChannels = useMemo(() => {
    if (searchQuery.trim() || allChannels.length > 0) {
      return allChannels.map(channel => ({ type: "channel" as const, channel }));
    }
    
    const result: DisplayItem[] = [];
    
    if (recentChannels.length > 0) {
      recentChannels.forEach(channel => {
        result.push({ type: "channel", channel });
      });
      
      if (otherChannels.length > 0) {
        result.push({ type: "separator", label: "All spaces" });
      }
    }
    
    otherChannels.forEach(channel => {
      result.push({ type: "channel", channel });
    });
    
    return result;
  }, [recentChannels, otherChannels, allChannels, searchQuery]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
    } else {
      setSelectedIndex(0);
    }
  }, [isOpen, displayChannels.length]);

  const handleSelect = useCallback((channelId: string) => {
    onChannelSelect(channelId);
    setIsOpen(false);
  }, [onChannelSelect]);

  const channelList = useMemo(() => {
    return displayChannels.filter(item => item.type === "channel") as Array<{ type: "channel"; channel: Channel }>;
  }, [displayChannels]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.min(selectedIndex + 1, channelList.length - 1);
      setSelectedIndex(newIndex);
      if (virtuosoRef.current && newIndex < channelList.length) {
        virtuosoRef.current.scrollToIndex({
          index: newIndex,
          align: "center",
          behavior: "smooth",
        });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      if (virtuosoRef.current && newIndex >= 0) {
        virtuosoRef.current.scrollToIndex({
          index: newIndex,
          align: "center",
          behavior: "smooth",
        });
      }
    } else if (e.key === "Enter" && channelList[selectedIndex]) {
      e.preventDefault();
      handleSelect(channelList[selectedIndex].channel.id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, [selectedIndex, channelList, handleSelect]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedIndex(0);
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0, behavior: "auto" });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSelectedIndex(0);
    searchInputRef.current?.focus();
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index: 0, behavior: "auto" });
    }
  }, []);

  return (
    <div className={className}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-80 p-0 overflow-hidden"
          align="start"
          sideOffset={8}
          onKeyDown={handleKeyDown}
        >
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                placeholder="Search spaces..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="pl-8 pr-8 h-8 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div 
            className="overflow-hidden py-1"
            style={{ maxHeight: `${maxHeight}px` }}
          >
            {channelList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="text-muted-foreground/50 mb-2 text-2xl">
                  {searchQuery ? "🔍" : "📁"}
                </div>
                <div className="text-sm text-muted-foreground font-medium mb-1">
                  {searchQuery ? "No spaces found" : "No spaces available"}
                </div>
                {searchQuery && (
                  <div className="text-xs text-muted-foreground/70">
                    Try a different search term
                  </div>
                )}
              </div>
            ) : (
              <Virtuoso<DisplayItem>
                ref={virtuosoRef}
                data={displayChannels}
                totalCount={displayChannels.length}
                itemContent={(index, item) => {
                  if (item.type === "separator") {
                    return (
                      <div className="px-3 py-1.5 h-8 flex items-center">
                        <div className="text-xs font-medium text-muted-foreground/70 uppercase tracking-wide">
                          {item.label}
                        </div>
                      </div>
                    );
                  }
                  
                  const channelIndex = displayChannels
                    .slice(0, index + 1)
                    .filter((i): i is { type: "channel"; channel: Channel } => i.type === "channel").length - 1;
                  
                  return (
                    <div className="px-2 py-0.5">
                      <SpaceSelectorItem
                        channel={item.channel}
                        isSelected={channelIndex === selectedIndex}
                        isCurrent={item.channel.id === currentChannel.id}
                        onSelect={handleSelect}
                        highlightQuery={searchQuery || undefined}
                      />
                    </div>
                  );
                }}
                defaultItemHeight={itemHeight + 4}
                style={{ 
                  height: `${Math.min(
                    displayChannels.reduce((sum, item) => 
                      sum + (item.type === "separator" ? 32 : itemHeight + 4), 0
                    ), 
                    maxHeight - 72
                  )}px`,
                  maxHeight: `${maxHeight - 72}px`
                }}
                overscan={5}
              />
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

