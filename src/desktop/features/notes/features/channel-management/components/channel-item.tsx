import { Button } from "@/common/components/ui/button";
import { Channel } from "@/core/stores/notes-data.store";
import { Edit2 } from "lucide-react";
import { getChannelIcon } from "./channel-icons";
import { ChannelMoreActionsMenu } from "./channel-more-actions-menu";
import { EditChannelPopover } from "./edit-channel-popover";

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

export const ChannelItem = ({ channel, isActive, onClick }: ChannelItemProps) => {
  const hasDescription = !!(channel.description && channel.description.trim());

  return (
    <div
      className="w-full group cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative px-2.5 py-2 rounded-md transition-colors ${
          isActive
            ? "bg-accent/60"
            : "bg-transparent hover:bg-accent/50"
        }`}
      >
        <div className="flex gap-2.5">
          {/* Channel Icon */}
          <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0">
            {channel.emoji ? (
              <span className="text-lg" title={`Emoji: ${channel.emoji}`}>
                {channel.emoji}
              </span>
            ) : (
              getChannelIcon(channel.id)
            )}
          </div>

          {/* Channel Content */}
          <div
            className={`flex-1 min-w-0 ${hasDescription ? "flex flex-col" : "flex items-center justify-between"}`}
          >
            {hasDescription ? (
              <>
                {/* Top row: Title and Action Buttons */}
                <div className="flex items-center justify-between mb-1">
                  {/* Title */}
                  <span
                    className={`text-sm font-medium truncate ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {channel.name}
                  </span>

                  {/* Action Buttons - Right side */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0">
                    {/* Edit Button */}
                    <EditChannelPopover channel={channel}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Edit channel"
                        onClick={e => e.stopPropagation()}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                    </EditChannelPopover>

                    {/* More Actions Button */}
                    <ChannelMoreActionsMenu channel={channel} />
                  </div>
                </div>

                {/* Bottom row: Description */}
                <p
                  className={`text-xs truncate mt-1 ${
                    isActive
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-slate-500 dark:text-slate-500"
                  }`}
                >
                  {channel.description}
                </p>
              </>
            ) : (
              <>
                {/* Title - Vertically centered when no description */}
                <span
                  className={`text-sm font-medium truncate ${
                    isActive
                      ? "text-slate-900 dark:text-slate-100"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {channel.name}
                </span>

                {/* Action Buttons - Right side */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 flex-shrink-0">
                  {/* Edit Button */}
                  <EditChannelPopover channel={channel}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="Edit channel"
                      onClick={e => e.stopPropagation()}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  </EditChannelPopover>

                  {/* More Actions Button */}
                  <ChannelMoreActionsMenu channel={channel} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
