import { useState, useRef, useEffect, useCallback } from "react";
import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileMessageInput } from "@/mobile/features/chat/components/mobile-message-input";
import { MobileMessageTimelineContainer } from "@/mobile/features/chat/components/ui/mobile-message-timeline-container";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/ui/mobile-scroll-to-bottom-button";
import { Message } from "@/core/stores/chat-data.store";

interface MobileChatLayoutProps {
    currentChannelName?: string;
    messages: Message[];
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
    messages,
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
    const [isRefReady, setIsRefReady] = useState(false);
    const [shouldShowScrollButton, setShouldShowScrollButton] = useState(false);
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    
    const handleReply = (messageId: string) => {
        setReplyToMessageId(messageId);
    };

    useEffect(() => {
        if (timelineContainerRef.current) {
            setIsRefReady(true);
        }
    }, []);

    const handleScrollToBottom = useCallback((options: { behavior: 'smooth' | 'instant' }) => {
        if (timelineContainerRef.current && isRefReady) {
            timelineContainerRef.current.scrollTo({
                top: timelineContainerRef.current.scrollHeight,
                behavior: options.behavior
            });
        }
    }, [isRefReady]);

    // Scroll position detection
    useEffect(() => {
        if (!isRefReady) return;
        
        const container = timelineContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            const threshold = 100; // 100px threshold
            
            setShouldShowScrollButton(distanceFromBottom > threshold);
        };

        container.addEventListener('scroll', handleScroll);
        
        // Initial check
        handleScroll();
        
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isRefReady]);

    useEffect(() => {
        if (isRefReady) {
            requestAnimationFrame(() => {
                handleScrollToBottom({ behavior: 'instant' });
            });
        }
    }, [messages.length, isRefReady, handleScrollToBottom]);

    const handleSendMessage = useCallback((content: string) => {
        onSendMessage(content);
        
        requestAnimationFrame(() => {
            handleScrollToBottom({ behavior: 'instant' });
        });
    }, [onSendMessage, handleScrollToBottom]);

    return (
        <div className="h-full flex flex-col">
            <MobileHeader
                onOpenChannelList={onOpenChannelList}
                onOpenAIAssistant={onOpenAIAssistant}
                onOpenSettings={onOpenSettings}
                currentChannelName={currentChannelName}
            />
            
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 relative">
                    <div 
                        ref={timelineContainerRef}
                        className="h-full overflow-auto"
                    >
                        <MobileMessageTimelineContainer
                            onOpenThread={onOpenThread}
                            messages={messages}
                            onReply={handleReply}
                        />
                    </div>
                    
                    {isRefReady && shouldShowScrollButton && (
                        <div className="absolute bottom-2 right-2 z-20">
                            <MobileScrollToBottomButton 
                                onClick={() => handleScrollToBottom({ behavior: 'smooth' })} 
                                isVisible={true}
                            />
                        </div>
                    )}
                </div>
                
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
