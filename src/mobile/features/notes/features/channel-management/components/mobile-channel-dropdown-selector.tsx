import { Button } from "@/common/components/ui/button";
import { Channel } from "@/core/stores/notes-data.store";
import { ChevronDown } from "lucide-react";
import { SpaceSelectorDropdown } from "@/common/components/space-selector/space-selector-dropdown";

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
  const trigger = (
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
  );

  return (
    <SpaceSelectorDropdown
      currentChannel={currentChannel}
      channels={channels}
      onChannelSelect={onChannelSelect}
      trigger={trigger}
      className={className}
      maxHeight={360}
      itemHeight={44}
    />
  );
};
