import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MobileChannelItem } from "./mobile-channel-item";
import { MobileCreateChannelPopover } from "./mobile-create-channel-popover";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";

interface MobileChannelListProps {
    isOpen: boolean;
    onClose: () => void;
    onChannelSelect: (channelId: string) => void;
}

export function MobileChannelList({ isOpen, onClose, onChannelSelect }: MobileChannelListProps) {
    const { channels, addChannel, deleteChannel } = useNotesDataStore();
    const { currentChannelId, setCurrentChannel } = useNotesViewStore();

    const handleAddChannel = (channel: { name: string; description: string; emoji?: string }) => {
        addChannel(channel);
    };

    const handleChannelClick = (channelId: string) => {
        onChannelSelect(channelId);
    };

    const handleDeleteChannel = async (channelId: string) => {
        const channel = channels.find(c => c.id === channelId);
        if (!channel) return;

        const confirmed = window.confirm(
            `🗑️ Delete Channel\n\n` +
            `"${channel.name}"\n\n` +
            `⚠️ This action cannot be undone.\n` +
            `The channel and all its messages will be moved to trash.\n\n` +
            `Are you sure you want to continue?`
        );

        if (confirmed) {
            try {
                await deleteChannel(channelId);
                // If the deleted channel was the current channel, switch to first available channel
                if (currentChannelId === channelId && channels.length > 1) {
                    const remainingChannels = channels.filter(c => c.id !== channelId);
                    if (remainingChannels.length > 0) {
                        setCurrentChannel(remainingChannels[0].id);
                        onChannelSelect(remainingChannels[0].id);
                    }
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                alert(`❌ Failed to delete the channel.\n\nError: ${errorMessage}\n\nPlease try again.`);
            }
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent 
                side="left" 
                className="w-80 p-0 border-r border-border"
            >
                <div className="flex flex-col h-full bg-background">
                    {/* Header - Consistent with Settings */}
                    <div className="flex items-center justify-start p-4">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">Spaces</h3>
                        </div>
                    </div>
                    
                    {/* Channel List - Consistent with Settings */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {channels.map((channel) => (
                            <MobileChannelItem
                                key={channel.id}
                                channel={channel}
                                isActive={currentChannelId === channel.id}
                                onClick={() => handleChannelClick(channel.id)}
                                onDelete={() => handleDeleteChannel(channel.id)}
                            />
                        ))}
                    </div>
                    
                    {/* Create Channel Button - Consistent with Settings */}
                    <div className="p-4">
                        <MobileCreateChannelPopover onAddChannel={handleAddChannel} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
