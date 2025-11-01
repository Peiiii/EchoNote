import { Badge } from "@/common/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Input } from "@/common/components/ui/input";
import { sortChannelsWithCurrentFirst } from "@/common/lib/channel-sorting";
import { Channel } from "@/core/stores/notes-data.store";
import { Check, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { cn } from "@/common/lib/utils";
import { getChannelIcon } from "@/desktop/features/notes/features/channel-management/components/channel-icons";

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

  const filteredChannels = useMemo(() => {
    if (!searchQuery.trim()) return sortedChannels;
    
    const query = searchQuery.toLowerCase().trim();
    return sortedChannels.filter(channel => 
      channel.name.toLowerCase().includes(query) ||
      channel.description?.toLowerCase().includes(query)
    );
  }, [sortedChannels, searchQuery]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
    } else {
      setSelectedIndex(0);
    }
  }, [isOpen, filteredChannels.length]);

  const handleSelect = useCallback((channelId: string) => {
    onChannelSelect(channelId);
    setIsOpen(false);
  }, [onChannelSelect]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.min(selectedIndex + 1, filteredChannels.length - 1);
      setSelectedIndex(newIndex);
      if (virtuosoRef.current && newIndex < filteredChannels.length) {
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
    } else if (e.key === "Enter" && filteredChannels[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredChannels[selectedIndex].id);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }, [selectedIndex, filteredChannels, handleSelect]);

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
            {filteredChannels.length === 0 ? (
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
              <Virtuoso
                ref={virtuosoRef}
                data={filteredChannels}
                totalCount={filteredChannels.length}
                itemContent={(index, channel) => (
                  <div className="px-2 py-0.5">
                    <SpaceSelectorItem
                      channel={channel}
                      isSelected={index === selectedIndex}
                      isCurrent={channel.id === currentChannel.id}
                      onSelect={handleSelect}
                      highlightQuery={searchQuery || undefined}
                    />
                  </div>
                )}
                defaultItemHeight={itemHeight + 4}
                style={{ 
                  height: `${Math.min(
                    filteredChannels.length * (itemHeight + 4), 
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

