import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { MobileChannelItem } from "./mobile-channel-item";
import { MobileCreateChannelPopover } from "./mobile-create-channel-popover";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";

interface MobileChannelListProps {
    isOpen: boolean;
    onClose: () => void;
    onChannelSelect: (channelId: string) => void;
}

export function MobileChannelList({ isOpen, onClose, onChannelSelect }: MobileChannelListProps) {
    const { channels, addChannel } = useChatDataStore();
    const { currentChannelId } = useChatViewStore();

    const handleAddChannel = (channel: { name: string; description: string }) => {
        addChannel(channel);
    };

    const handleChannelClick = (channelId: string) => {
        onChannelSelect(channelId);
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent 
                side="left" 
                className="w-80 p-0 border-r border-border"
            >
                <div className="flex flex-col h-full bg-background">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                Thought Spaces
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Choose your thinking domain
                            </p>
                        </div>
                    </div>
                    
                    {/* Channel List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {channels.map((channel) => (
                            <MobileChannelItem
                                key={channel.id}
                                channel={channel}
                                isActive={currentChannelId === channel.id}
                                onClick={() => handleChannelClick(channel.id)}
                            />
                        ))}
                    </div>
                    
                    {/* Create Channel Button */}
                    <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                        <MobileCreateChannelPopover onAddChannel={handleAddChannel} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
