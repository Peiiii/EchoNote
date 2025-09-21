import { Button } from "@/common/components/ui/button";
import { Channel } from "@/core/stores/notes-data.store";
import { Edit2 } from "lucide-react";
import { getChannelIcon } from "./channel-icons";
import { EditChannelPopover } from "./edit-channel-popover";
import { ChannelMoreActionsMenu } from "./channel-more-actions-menu";

interface ChannelItemProps {
    channel: Channel;
    isActive: boolean;
    onClick: () => void;
    onDelete: () => void;
}

export const ChannelItem = ({ channel, isActive, onClick, onDelete }: ChannelItemProps) => {
    return (
        <div
            className={`w-full group transition-all duration-200 cursor-pointer ${isActive
                ? 'transform scale-[1.01]'
                : 'hover:transform hover:scale-[1.005]'
                }`}
            onClick={onClick}
        >
            <div className={`relative p-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-sidebar-accent dark:bg-sidebar-accent shadow-sm'
                : 'bg-transparent hover:bg-sidebar-accent dark:hover:bg-sidebar-accent'
                }`}>

                <div className="flex items-start gap-3">
                    {/* Channel Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive
                        ? 'bg-sidebar-accent dark:bg-sidebar-accent'
                        : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                        {channel.emoji ? (
                            <span className="text-lg" title={`Emoji: ${channel.emoji}`}>{channel.emoji}</span>
                        ) : (
                            getChannelIcon(channel.id)
                        )}
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium truncate ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                {channel.name}
                            </span>
                        </div>
                        <p className={`text-xs line-clamp-2 ${isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'
                            }`}>
                            {channel.description}
                        </p>
                    </div>

                    {/* Action Buttons - Right side */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {/* Edit Button */}
                        <EditChannelPopover channel={channel}>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                                title="Edit channel"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Edit2 className="h-3 w-3" />
                            </Button>
                        </EditChannelPopover>

                        {/* More Actions Button */}
                        <ChannelMoreActionsMenu 
                            channel={channel}
                            onDelete={onDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
