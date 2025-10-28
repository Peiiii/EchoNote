import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { sortChannelsWithCurrentFirst } from "@/common/lib/channel-sorting";
import { Channel } from "@/core/stores/notes-data.store";
import { ChevronDown, Hash } from "lucide-react";

interface MobileChannelDropdownSelectorProps {
  currentChannel: Channel;
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  className?: string;
}

export const MobileChannelDropdownSelector = ({
  currentChannel,
  channels,
  onChannelSelect,
  className = "",
}: MobileChannelDropdownSelectorProps) => {
  const sortedChannels = sortChannelsWithCurrentFirst(channels, currentChannel.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-auto px-2 py-1.5 hover:bg-muted/50 active:bg-muted/70 transition-all duration-200 touch-manipulation min-h-[36px] ${className}`}
        >
          <div className="flex items-center space-x-1.5 min-w-0 max-w-full">
            {currentChannel.emoji && (
              <div className="text-base flex-shrink-0">{currentChannel.emoji}</div>
            )}
            <div className="flex items-center min-w-0 flex-1">
              <h1 className="text-base font-medium text-foreground/90 truncate">
                {currentChannel.name}
              </h1>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 max-h-72 overflow-y-auto" align="center" sideOffset={6}>
        {sortedChannels.map(channel => (
          <DropdownMenuItem
            key={channel.id}
            onClick={() => onChannelSelect(channel.id)}
            className={`flex items-center space-x-2 px-3 py-2 cursor-pointer transition-all duration-200 touch-manipulation min-h-[40px] ${
              channel.id === currentChannel.id
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50 active:bg-accent/70"
            }`}
          >
            <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
              {channel.emoji ? (
                <span className="text-sm">{channel.emoji}</span>
              ) : (
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate text-sm">{channel.name}</div>
              {channel.description && (
                <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {channel.description}
                </div>
              )}
            </div>
            {channel.id === currentChannel.id && (
              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
