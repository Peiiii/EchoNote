import { useState, useRef, useEffect, useCallback } from "react";
import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileMessageInput } from "@/mobile/features/chat/components/mobile-message-input";
import { MobileMessageTimelineContainer } from "@/mobile/features/chat/components/ui/mobile-message-timeline-container";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/ui/mobile-scroll-to-bottom-button";
import { Message } from "@/core/stores/chat-data.store";

// Custom hook for viewport height management
const useViewportHeight = () => {
    const [viewportHeight, setViewportHeight] = useState<string>('100vh');
    
    useEffect(() => {
        const updateViewportHeight = () => {
            const newHeight = `${window.innerHeight}px`;
            setViewportHeight(newHeight);
            
            // Set CSS custom property for global use
            document.documentElement.style.setProperty('--mobile-vh', newHeight);
        };

        // Initial setup
        updateViewportHeight();

        // Event listeners for different viewport change scenarios
        const events = ['resize', 'orientationchange'] as const;
        events.forEach(event => {
            window.addEventListener(event, updateViewportHeight);
        });

        // Chrome mobile specific: visual viewport API
        if ('visualViewport' in window && window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewportHeight);
        }

        // Cleanup function
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateViewportHeight);
            });
            
            if ('visualViewport' in window && window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewportHeight);
            }
        };
    }, []);

    return viewportHeight;
};

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
    const [isRefReady, setIsRefReady] = useState<boolean>(false);
    const [shouldShowScrollButton, setShouldShowScrollButton] = useState<boolean>(false);
    
    // Refs
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    
    // Custom hooks
    const viewportHeight = useViewportHeight();
    
    // Event handlers
    const handleReply = useCallback((messageId: string) => {
        setReplyToMessageId(messageId);
    }, [setReplyToMessageId]);

    const handleScrollToBottom = useCallback((options: { behavior: 'smooth' | 'instant' }) => {
        if (timelineContainerRef.current && isRefReady) {
            timelineContainerRef.current.scrollTo({
                top: timelineContainerRef.current.scrollHeight,
                behavior: options.behavior
            });
        }
    }, [isRefReady]);

    const handleSendMessage = useCallback((content: string) => {
        onSendMessage(content);
        
        // Auto-scroll after sending message
        requestAnimationFrame(() => {
            handleScrollToBottom({ behavior: 'instant' });
        });
    }, [onSendMessage, handleScrollToBottom]);

    // Effects
    useEffect(() => {
        if (timelineContainerRef.current) {
            setIsRefReady(true);
        }
    }, []);

    // Scroll position detection
    useEffect(() => {
        if (!isRefReady) return;
        
        const container = timelineContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
            const threshold = 100; // 100px threshold for showing scroll button
            
            setShouldShowScrollButton(distanceFromBottom > threshold);
        };

        container.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isRefReady]);

    // Auto-scroll on new messages
    useEffect(() => {
        if (isRefReady) {
            requestAnimationFrame(() => {
                handleScrollToBottom({ behavior: 'instant' });
            });
        }
    }, [messages.length, isRefReady, handleScrollToBottom]);

    // Render methods
    const renderScrollButton = () => {
        if (!isRefReady || !shouldShowScrollButton) return null;
        
        return (
            <div className="absolute bottom-2 right-2 z-20">
                <MobileScrollToBottomButton 
                    onClick={() => handleScrollToBottom({ behavior: 'smooth' })} 
                    isVisible={true}
                />
            </div>
        );
    };

    const renderTimelineArea = () => (
        <div className="flex-1 min-h-0 relative overflow-hidden">
            <div 
                ref={timelineContainerRef}
                className="h-full overflow-y-auto overflow-x-hidden"
            >
                <MobileMessageTimelineContainer
                    onOpenThread={onOpenThread}
                    messages={messages}
                    onReply={handleReply}
                />
            </div>
            {renderScrollButton()}
        </div>
    );

    const renderInputArea = () => (
        <div className="flex-shrink-0">
            <MobileMessageInput
                onSend={handleSendMessage}
                replyToMessageId={replyToMessageId || undefined}
                onCancelReply={onCancelReply}
                isSending={isAddingMessage}
            />
        </div>
    );

    return (
        <div 
            className="flex flex-col overflow-hidden" 
            style={{ 
                height: viewportHeight,
                minHeight: viewportHeight,
                maxHeight: viewportHeight
            }}
        >
            <MobileHeader
                onOpenChannelList={onOpenChannelList}
                onOpenAIAssistant={onOpenAIAssistant}
                onOpenSettings={onOpenSettings}
                currentChannelName={currentChannelName}
            />
            
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {renderTimelineArea()}
                {renderInputArea()}
            </div>
        </div>
    );
};
