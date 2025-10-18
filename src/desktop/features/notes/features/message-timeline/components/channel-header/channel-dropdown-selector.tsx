import { Badge } from "@/common/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { Channel } from "@/core/stores/notes-data.store";
import { ChevronDown } from "lucide-react";
import { getChannelIcon } from "../../../channel-management/components/channel-icons";

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
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center space-x-1.5 min-w-0 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer group">
            {currentChannel.emoji && (
              <div className="text-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-200">{currentChannel.emoji}</div>
            )}
            <h1 className="text-lg font-semibold text-muted-foreground group-hover:text-foreground truncate transition-colors duration-200 min-w-0 flex-1">
              {currentChannel.name}
            </h1>
            <Badge variant="secondary" className="text-xs flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              {currentChannel.messageCount}
            </Badge>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground flex-shrink-0 transition-colors duration-200" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto" align="start" sideOffset={8}>
          {channels.map(channel => (
            <DropdownMenuItem
              key={channel.id}
              onClick={() => onChannelSelect(channel.id)}
              className={`flex items-center space-x-3 p-3 cursor-pointer transition-all duration-200 ${channel.id === currentChannel.id
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
                }`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                {channel.emoji ? (
                  <span className="text-lg">{channel.emoji}</span>
                ) : (
                  getChannelIcon(channel.id)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="font-medium truncate">{channel.name}</div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">
                    {channel.messageCount}
                  </Badge>
                </div>
                {channel.description && (
                  <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {channel.description}
                  </div>
                )}
              </div>
              {channel.id === currentChannel.id && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
