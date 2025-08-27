import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { ChannelItem } from "./channel-item";
import { CreateChannelPopover } from "./create-channel-popover";
import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { useRef, useState, useEffect } from "react";

interface ChannelListProps {
    showFadeEffect?: boolean;
}

export function ChannelList({ showFadeEffect = false }: ChannelListProps) {
    const { channels, addChannel } = useChatDataStore();
    const { currentChannelId, setCurrentChannel } = useChatViewStore();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    const handleAddChannel = (channel: { name: string; description: string }) => {
        addChannel(channel);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (scrollContainerRef.current) {
            const { scrollHeight, clientHeight } = scrollContainerRef.current;
            setHasScroll(scrollHeight > clientHeight);
        }
    });

    return (
        <div data-component="channel-list" className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div data-component="channel-list-header" className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
                            Thought Spaces
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Choose your thinking domain
                        </p>
                    </div>
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
                {channels.map((channel) => (
                    <ChannelItem
                        key={channel.id}
                        channel={channel}
                        isActive={currentChannelId === channel.id}
                        onClick={() => setCurrentChannel(channel.id)}
                    />
                ))}
                {/* Fade effect overlay */}
                {/* <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" /> */}
            </div>

            {/* Fade effect overlay container - positioned outside channel list */}
            {hasScroll && showFadeEffect && (
                <div className="relative">
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-100/90 dark:from-slate-800/90 to-transparent pointer-events-none" />
                </div>
            )}
            {/* Create Channel Button */}
            <div data-component="channel-list-footer" className="p-3 border-t border-slate-200 dark:border-slate-700">
                <CreateChannelPopover onAddChannel={handleAddChannel} />
            </div>

        </div>
    );
}
