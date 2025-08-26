import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileMessageInput, MobileTimelineContent, type MobileTimelineContentRef } from "@/mobile/features/chat/features/message-timeline";
import { useMobileTimelineState } from "@/mobile/features/chat/features/message-timeline";
import { useMobileViewportHeight } from "@/mobile/features/chat/features/message-timeline";
import { useRef } from "react";

interface MobileChatLayoutProps {
    currentChannelName?: string;
    replyToMessageId?: string | null;
    isAddingMessage: boolean;
    onOpenChannelList: () => void;
    onOpenAIAssistant: () => void;
    onOpenSettings: () => void;
    onOpenThread: (messageId: string) => void;
    onSendMessage: (content: string) => void;
    onCancelReply: () => void;
    setReplyToMessageId: (messageId: string | null) => void;
}

export const MobileChatLayout = ({
    currentChannelName,
    replyToMessageId,
    isAddingMessage,
    onOpenChannelList,
    onOpenAIAssistant,
    onOpenSettings,
    onOpenThread,
    onSendMessage,
    onCancelReply,
    setReplyToMessageId,
}: MobileChatLayoutProps) => {
    // Use custom hooks for state management
    const timelineState = useMobileTimelineState({
        onSendMessage,
        setReplyToMessageId
    });
    
    const viewportHeight = useMobileViewportHeight();
    
    // Ref to access timeline content methods
    const timelineContentRef = useRef<MobileTimelineContentRef>(null);
    
    // Enhanced send message handler that scrolls to bottom after sending
    const handleSendMessage = (content: string) => {
        timelineState.handleSendMessage(content);
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
                onOpenChannelList={onOpenChannelList}
                onOpenAIAssistant={onOpenAIAssistant}
                onOpenSettings={onOpenSettings}
                currentChannelName={currentChannelName}
            />
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Timeline content */}
                <MobileTimelineContent
                    ref={timelineContentRef}
                    onOpenThread={onOpenThread}
                    onReply={timelineState.handleReply}
                />
                
                {/* Input area */}
                <div className="flex-shrink-0">
                    <MobileMessageInput
                        onSend={handleSendMessage}
                        replyToMessageId={replyToMessageId || undefined}
                        onCancelReply={onCancelReply}
                        isSending={isAddingMessage}
                    />
                </div>
            </div>
        </div>
    );
};
