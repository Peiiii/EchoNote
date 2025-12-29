import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { cn } from "@/common/lib/utils";
import { Channel } from "@/core/stores/notes-data.store";
import { Hash } from "lucide-react";
import { MobileChannelMoreActionsMenu } from "./mobile-channel-more-actions-menu";

interface MobileChannelItemProps {
  channel: Channel;
  isActive: boolean;
}

export function MobileChannelItem({ channel, isActive }: MobileChannelItemProps) {
  const presenter = useCommonPresenterContext();
  const onClick = () => {
    presenter.viewStateManager.setCurrentChannel(channel.id);
  };

  const handleDeleteChannel = async (channelId: string) => {
    const confirmed = window.confirm(
      `🗑️ Delete Channel\n\n` +
        `"${channel.name}"\n\n` +
        `⚠️ This action cannot be undone.\n` +
        `The channel and all its messages will be moved to trash.\n\n` +
        `Are you sure you want to continue?`
    );

    if (confirmed) {
      try {
        await presenter.channelManager.deleteChannel(channelId);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        alert(`❌ Failed to delete the channel.\n\nError: ${errorMessage}\n\nPlease try again.`);
      }
    }
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 text-left transition-all duration-200 group rounded-lg",
        "hover:bg-muted/50",
        isActive && "bg-muted/50"
      )}
    >
      {/* Emoji or fallback icon */}
      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
        {channel.emoji ? (
          <span className="text-lg leading-none" title={`Emoji: ${channel.emoji}`}>
            {channel.emoji}
          </span>
        ) : (
          <Hash className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "font-medium truncate text-sm",
            isActive ? "text-foreground" : "text-foreground/80"
          )}
        >
          {channel.name}
        </div>
        {channel.description && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">{channel.description}</div>
        )}
      </div>

      {/* More Actions - Always visible on mobile */}
      <div className="flex-shrink-0">
        <MobileChannelMoreActionsMenu
          channel={channel}
          onDelete={() => handleDeleteChannel(channel.id)}
        />
      </div>
    </button>
  );
}
