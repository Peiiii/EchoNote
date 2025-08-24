import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileMessageInput } from "@/mobile/features/chat/components/mobile-message-input";
import { MobileMessageTimelineContainer } from "@/mobile/features/chat/components/ui/mobile-message-timeline-container";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/ui/mobile-scroll-to-bottom-button";
import { Message } from "@/core/stores/chat-data.store";

interface MobileChatLayoutProps {
    currentChannelName?: string;
    messages: Message[];
    containerRef: React.RefObject<HTMLDivElement | null>;
    isSticky: boolean;
    replyToMessageId?: string | null;
    isAddingMessage: boolean;
    onOpenChannelList: () => void;
    onOpenAIAssistant: () => void;
    onOpenSettings: () => void;
    onOpenThread: (messageId: string) => void;
    onSendMessage: (content: string) => void;
    onCancelReply: () => void;
    onScrollToBottom: () => void;
}

export const MobileChatLayout = ({
    currentChannelName,
    messages,
    containerRef,
    isSticky,
    replyToMessageId,
    isAddingMessage,
    onOpenChannelList,
    onOpenAIAssistant,
    onOpenSettings,
    onOpenThread,
    onSendMessage,
    onCancelReply,
    onScrollToBottom,
}: MobileChatLayoutProps) => {
    return (
        <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <MobileHeader
                onOpenChannelList={onOpenChannelList}
                onOpenAIAssistant={onOpenAIAssistant}
                onOpenSettings={onOpenSettings}
                currentChannelName={currentChannelName}
            />
            
            {/* Main Chat Area - Fixed Layout */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Timeline Area - Scrollable */}
                <MobileMessageTimelineContainer
                    containerRef={containerRef}
                    onOpenThread={onOpenThread}
                    messages={messages}
                />
                {/* Scroll to bottom button */}
                {!isSticky && (
                    <MobileScrollToBottomButton 
                        onClick={onScrollToBottom} 
                        isVisible={!isSticky}
                    />
                )}
                
                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0">
                    <MobileMessageInput
                        onSend={onSendMessage}
                        replyToMessageId={replyToMessageId || undefined}
                        onCancelReply={onCancelReply}
                        isSending={isAddingMessage}
                    />
                </div>
            </div>
        </div>
    );
};
