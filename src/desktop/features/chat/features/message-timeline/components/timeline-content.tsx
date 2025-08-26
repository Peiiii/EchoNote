import { Message } from "@/core/stores/chat-data.store";
import { MessageTimeline } from "@/common/features/chat/components/message-timeline/message-timeline";
import { ScrollToBottomButton } from "./scroll-to-bottom-button";

interface TimelineContentProps {
    containerRef: React.RefObject<HTMLDivElement | null>;
    renderThoughtRecord: (message: Message, threadCount: number) => React.ReactNode;
    isSticky: boolean;
    onScrollToBottom: () => void;
    className?: string;
}

export const TimelineContent = ({
    containerRef,
    renderThoughtRecord,
    isSticky,
    onScrollToBottom,
    className = ""
}: TimelineContentProps) => {
    return (
        <div className={`flex-1 flex flex-col min-h-0 relative ${className}`}>
            {/* Message timeline */}
            <MessageTimeline
                containerRef={containerRef}
                renderThoughtRecord={renderThoughtRecord}
            />
            
            {/* Scroll to bottom button */}
            {!isSticky && (
                <ScrollToBottomButton
                    onClick={onScrollToBottom}
                    isVisible={!isSticky}
                />
            )}
        </div>
    );
};
