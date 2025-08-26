import { Message } from "@/core/stores/chat-data.store";
import { MessageTimeline } from "@/common/features/chat/components/message-timeline/message-timeline";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/mobile-scroll-to-bottom-button";
import { MobileThoughtRecord } from "@/mobile/features/chat/features/message-timeline";
import { useState, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from "react";

// 定义透出的方法接口
export interface MobileTimelineContentRef {
    scrollToBottom: (options?: { behavior?: 'smooth' | 'instant' }) => void;
}

interface MobileTimelineContentProps {
    onOpenThread: (messageId: string) => void;
    onReply: (messageId: string) => void;
    className?: string;
}

export const MobileTimelineContent = forwardRef<MobileTimelineContentRef, MobileTimelineContentProps>(({
    onOpenThread,
    onReply,
    className = ""
}, ref) => {
    // Internal ref - completely self-contained
    const timelineContainerRef = useRef<HTMLDivElement>(null);
    
    // Internal scroll state management
    const [shouldShowScrollButton, setShouldShowScrollButton] = useState<boolean>(false);
    const [isRefReady, setIsRefReady] = useState<boolean>(false);
    
    // Internal scroll to bottom function - completely self-contained
    const handleScrollToBottom = useCallback((options: { behavior?: 'smooth' | 'instant' } = {}) => {
        if (timelineContainerRef.current && isRefReady) {
            const container = timelineContainerRef.current;
            const scrollOptions: ScrollToOptions = {
                top: container.scrollHeight,
                behavior: options.behavior || 'instant'
            };
            container.scrollTo(scrollOptions);
        }
    }, [isRefReady]);
    
    // Expose scrollToBottom method to parent component
    useImperativeHandle(ref, () => ({
        scrollToBottom: handleScrollToBottom
    }), [handleScrollToBottom]);
    
    // Check if ref is ready
    useEffect(() => {
        if (timelineContainerRef.current) {
            setIsRefReady(true);
        }
    }, []);

    // Scroll position detection - completely internal to this component
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

    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <MobileThoughtRecord
            message={message}
            onOpenThread={onOpenThread}
            onReply={() => onReply(message.id)}
            threadCount={threadCount}
        />
    );

    // Internal computed value
    const canShowScrollButton = isRefReady && shouldShowScrollButton;

    return (
        <div className={`flex-1 min-h-0 relative overflow-hidden ${className}`}>
            {/* Timeline container - no overflow here, let MessageTimeline handle scrolling */}
            <div 
                ref={timelineContainerRef}
                className="h-full"
            >
                <MessageTimeline
                    containerRef={timelineContainerRef}
                    className="h-full"
                    renderThoughtRecord={renderThoughtRecord}
                />
            </div>
            
            {/* Scroll to bottom button - completely self-contained */}
            {canShowScrollButton && (
                <div className="absolute bottom-2 right-2 z-20">
                    <MobileScrollToBottomButton 
                        onClick={() => handleScrollToBottom({ behavior: 'smooth' })} 
                        isVisible={true}
                    />
                </div>
            )}
        </div>
    );
});
