import { Channel } from "@/core/stores/chat-data.store";
import { getChannelIcon } from "./channel-icons";

interface ChannelItemProps {
    channel: Channel;
    isActive: boolean;
    onClick: () => void;
}

export const ChannelItem = ({ channel, isActive, onClick }: ChannelItemProps) => {
    return (
        <button
            onClick={onClick}
            className={`w-full group transition-all duration-200 ${isActive
                ? 'transform scale-[1.01]'
                : 'hover:transform hover:scale-[1.005]'
                }`}
        >
            <div className={`relative p-3 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 shadow-sm'
                : 'bg-transparent hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}>

                <div className="flex items-start gap-3">
                    {/* Channel Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive
                        ? 'bg-slate-100 dark:bg-slate-600'
                        : 'bg-slate-100 dark:bg-slate-800'
                        }`}>
                        {getChannelIcon(channel.id)}
                    </div>

                    {/* Channel Info */}
                    <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium ${isActive ? 'text-slate-900 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                {channel.name}
                            </span>

                        </div>
                        <p className={`text-xs line-clamp-2 ${isActive ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'
                            }`}>
                            {channel.description}
                        </p>
                    </div>
                </div>
            </div>
        </button>
    );
};
