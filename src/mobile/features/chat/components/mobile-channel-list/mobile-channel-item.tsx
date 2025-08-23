import { Channel } from "@/core/stores/chat-data.store";
import { Hash } from "lucide-react";
import { cn } from "@/common/lib/utils";

interface MobileChannelItemProps {
    channel: Channel;
    isActive: boolean;
    onClick: () => void;
}

export function MobileChannelItem({ channel, isActive, onClick }: MobileChannelItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
                "hover:bg-slate-100 dark:hover:bg-slate-800",
                isActive && "bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800"
            )}
        >
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                isActive 
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            )}>
                <Hash className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-medium truncate",
                    isActive 
                        ? "text-blue-900 dark:text-blue-100"
                        : "text-slate-900 dark:text-slate-100"
                )}>
                    {channel.name}
                </div>
                {channel.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {channel.description}
                    </div>
                )}
            </div>
        </button>
    );
}
