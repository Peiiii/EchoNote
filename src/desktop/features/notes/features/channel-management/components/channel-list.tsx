import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { useAutoSelectFirstChannel } from "@/common/hooks/use-auto-select-first-channel";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChannelItem } from "./channel-item";
import { ChannelListEmptyState } from "./channel-list-empty-state";
import { ChannelListSkeleton } from "./channel-list-skeleton";
import { CreateChannelPopover } from "./create-channel-popover";
import { Plus } from "lucide-react";

interface ChannelListProps {
    showFadeEffect?: boolean;
}

export function ChannelList({ showFadeEffect = false }: ChannelListProps) {
    const { channels, channelsLoading, addChannel, deleteChannel } = useNotesDataStore();
    const { currentChannelId, setCurrentChannel } = useNotesViewStore();
    useAutoSelectFirstChannel();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    const handleAddChannel = (channel: { name: string; description: string; emoji?: string }) => {
        addChannel(channel);
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
                    }
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                alert(`❌ Failed to delete the channel.\n\nError: ${errorMessage}\n\nPlease try again.`);
            }
        }
    };

    // Sort channels by activity:
    // 1) lastMessageTime (desc) if exists
    // 2) else updatedAt (desc)
    // 3) else createdAt (desc)
    const orderedChannels = useMemo(() => {
        const getActivity = (c: typeof channels[number]) => {
            const t1 = c.lastMessageTime?.getTime();
            const t2 = c.updatedAt?.getTime();
            const t3 = c.createdAt?.getTime?.() ? c.createdAt.getTime() : 0;
            return t1 ?? t2 ?? t3 ?? 0;
        };
        return [...channels].sort((a, b) => getActivity(b) - getActivity(a));
    }, [channels]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            setHasScroll(scrollHeight > clientHeight);
        }
    });

    // Show skeleton while loading
    if (channelsLoading) {
        return <ChannelListSkeleton />;
    }

    return (
        <div data-component="channel-list" className="flex flex-col h-full overflow-hidden bg-card shadow-sm">
            {/* Header */}
            <div data-component="channel-list-header" className="h-12 px-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 truncate">
                        Spaces
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <CreateChannelPopover
                        onAddChannel={handleAddChannel}
                        trigger={
                            <button
                                type="button"
                                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                                aria-label="New space"
                                title="New space"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        }
                    />
                    <CollapsibleSidebar.ToggleButton />
                </div>
            </div>

            {/* Channel List */}
            <div
                ref={scrollContainerRef}
                data-component="channel-list-content"
                className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0 channel-list-content"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                }}
            >
                {orderedChannels.length === 0 ? (
                    <ChannelListEmptyState onCreateChannel={handleAddChannel} />
                ) : (
                    orderedChannels.map((channel) => (
                        <ChannelItem
                            key={channel.id}
                            channel={channel}
                            isActive={currentChannelId === channel.id}
                            onClick={() => setCurrentChannel(channel.id)}
                            onDelete={() => handleDeleteChannel(channel.id)}
                        />
                    ))
                )}
            </div>

            {/* Fade effect overlay container - positioned outside channel list */}
            {hasScroll && showFadeEffect && (
                <div className="relative">
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-100/90 dark:from-slate-800/90 to-transparent pointer-events-none" />
                </div>
            )}

            {/* Footer removed: create entry moved to header */}

        </div>
    );
}
