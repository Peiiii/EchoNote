import { Channel } from "@/core/stores/notes-data.store";
import { Hash } from "lucide-react";
import { cn } from "@/common/lib/utils";
import { MobileChannelMoreActionsMenu } from "./mobile-channel-more-actions-menu";

interface MobileChannelItemProps {
    channel: Channel;
    isActive: boolean;
    onClick: () => void;
    onDelete?: () => void;
}

export function MobileChannelItem({ channel, isActive, onClick, onDelete }: MobileChannelItemProps) {
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
            <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-colors",
                isActive 
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground group-hover:bg-muted/80"
            )}>
                {channel.emoji ? (
                    <span className="text-base leading-none">{channel.emoji}</span>
                ) : (
                    <Hash className="w-3.5 h-3.5" />
                )}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-medium truncate text-sm",
                    isActive 
                        ? "text-foreground"
                        : "text-foreground/80"
                )}>
                    {channel.name}
                </div>
                {channel.description && (
                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                        {channel.description}
                    </div>
                )}
            </div>

            {/* More Actions - Always visible on mobile */}
            {onDelete && (
                <div className="flex-shrink-0">
                    <MobileChannelMoreActionsMenu 
                        channel={channel}
                        onDelete={onDelete}
                    />
                </div>
            )}
        </button>
    );
}
