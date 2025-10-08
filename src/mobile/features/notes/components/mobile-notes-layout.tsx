import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileMessageInput, MobileTimelineContent, useMobileTimelineState, useMobileViewportHeight, type MobileTimelineContentRef } from "@/mobile/features/notes/features/message-timeline";
import { useRef } from "react";
import { QuickSearchModal } from "@/common/features/note-search/components/quick-search-modal";

interface MobileNotesLayoutProps {
    currentChannelName?: string;
    replyToMessageId?: string | null;
    isAddingMessage: boolean;
    onSendMessage: (content: string) => void;
    onCancelReply: () => void;
    setReplyToMessageId: (messageId: string | null) => void;
}

export const MobileNotesLayout = ({
    currentChannelName,
    replyToMessageId,
    isAddingMessage,
    onSendMessage,
    onCancelReply,
    setReplyToMessageId,
}: MobileNotesLayoutProps) => {
    // Use custom hooks for state management
    const timelineState = useMobileTimelineState({
        onSendMessage,
        setReplyToMessageId
    });

    const viewportHeight = useMobileViewportHeight();
    
    // Get current channel and all channels for dropdown
    const { currentChannelId } = useNotesViewStore();
    const { channels } = useNotesDataStore();
    const currentChannel = channels.find(channel => channel.id === currentChannelId);

    // Ref to access timeline content methods
    const timelineContentRef = useRef<MobileTimelineContentRef>(null);

    // Enhanced send message handler that scrolls to bottom after sending
    const handleSendMessage = (content: string) => {
        // timelineState.handleSendMessage(content);
        channelMessageService.sendMessage({
            channelId: useNotesViewStore.getState().currentChannelId!,
            content: content,
            sender: "user",
        });
        // Auto-scroll to bottom after sending message
        setTimeout(() => {
            timelineContentRef.current?.scrollToBottom({ behavior: 'instant' });
        }, 100);
    };

    return (
        <div
            className="flex flex-col overflow-hidden"
            style={{
                height: viewportHeight,
                minHeight: viewportHeight,
                maxHeight: viewportHeight
            }}
        >
            {/* Header */}
            <MobileHeader
                currentChannelName={currentChannelName}
                currentChannel={currentChannel}
                channels={channels}
            />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Timeline content */}
                <MobileTimelineContent
                    ref={timelineContentRef}
                    onReply={timelineState.handleReply}
                />
                {/* Global quick search dialog */}
                <QuickSearchModal />

                {/* Input area - only show when there's a current channel */}
                {currentChannel && (
                    <div className="flex-shrink-0">
                        <MobileMessageInput
                            onSend={handleSendMessage}
                            replyToMessageId={replyToMessageId || undefined}
                            onCancelReply={onCancelReply}
                            isSending={isAddingMessage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
