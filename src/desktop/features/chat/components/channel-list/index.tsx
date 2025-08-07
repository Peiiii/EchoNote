import { useChatStore } from "@/core/stores/chat-store";
import { ChannelItem } from "./channel-item";
import { CreateChannelPopover } from "./create-channel-popover";

export const ChannelList = () => {
    const { channels, currentChannelId, setCurrentChannel, addChannel } = useChatStore();

    const handleAddChannel = (channel: { name: string; description: string }) => {
        addChannel(channel);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                    Thought Spaces
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Choose your thinking domain
                </p>
            </div>
            
            {/* Channel List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
                {channels.map((channel) => (
                    <ChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={currentChannelId === channel.id}
                        onClick={() => setCurrentChannel(channel.id)}
                    />
                ))}
            </div>
            
            {/* Create Channel Button */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                <CreateChannelPopover onAddChannel={handleAddChannel} />
            </div>
        </div>
    );
};
