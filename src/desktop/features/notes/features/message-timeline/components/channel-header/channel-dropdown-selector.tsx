import { Badge } from "@/common/components/ui/badge";
import { Channel } from "@/core/stores/notes-data.store";
import { ChevronDown } from "lucide-react";
import { SpaceSelectorDropdown } from "@/common/components/space-selector/space-selector-dropdown";

interface ChannelDropdownSelectorProps {
  currentChannel: Channel;
  channels: Channel[];
  onChannelSelect: (channelId: string) => void;
  className?: string;
}

export const ChannelDropdownSelector = ({
  currentChannel,
  channels,
  onChannelSelect,
  className = "",
}: ChannelDropdownSelectorProps) => {
  const trigger = (
    <div className="flex items-center space-x-1.5 min-w-0 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer group">
      {currentChannel.emoji && (
        <div className="text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
          {currentChannel.emoji}
        </div>
      )}
      <h1 className="text-lg font-semibold text-muted-foreground group-hover:text-foreground truncate transition-colors duration-200 min-w-0 flex-1">
        {currentChannel.name}
      </h1>
      <Badge 
        variant="secondary" 
        className="text-xs flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors duration-200"
      >
        {currentChannel.messageCount}
      </Badge>
      <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors duration-200" />
    </div>
  );

  return (
    <SpaceSelectorDropdown
      currentChannel={currentChannel}
      channels={channels}
      onChannelSelect={onChannelSelect}
      trigger={trigger}
      className={className}
      maxHeight={400}
      itemHeight={40}
    />
  );
};
