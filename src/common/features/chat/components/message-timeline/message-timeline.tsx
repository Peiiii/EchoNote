import { ScrollToBottomButton } from "@/common/features/chat/components/scroll-to-bottom-button";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { Message } from "@/core/stores/chat-data.store";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { DateDivider } from "./date-divider";

interface MessageTimelineProps {
    renderThoughtRecord?: (message: Message, threadCount: number) => React.ReactNode;
    className?: string;
    groupedMessages: Record<string, Message[]>;
    messages: Message[];
    onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export interface MessageTimelineRef {
    scrollToBottom: (options?: { behavior?: 'smooth' | 'instant' }) => void;
}

export const MessageTimeline = forwardRef<MessageTimelineRef, MessageTimelineProps>(({
    renderThoughtRecord,
    className = "",
    groupedMessages,
    messages,
    onScroll
}, ref) => {

    const { containerRef, scrollToBottom, canScrollToBottom } = useChatScroll([], { smoothScroll: true });

    useImperativeHandle(ref, () => ({
        scrollToBottom: scrollToBottom,
    }), [scrollToBottom]);

    useEffect(() => {
        scrollToBottom({ behavior: 'instant' });
    }, []);

    return (
        <>
            <div data-component="message-timeline"
                ref={containerRef}
                className={`w-full bg-background flex-1 overflow-y-auto min-h-0 ${className}`}
                style={{
                    height: '100%',
                    minHeight: '100%',
                    maxHeight: '100%'
                }}
                onScroll={onScroll}
            >
                {Object.entries(groupedMessages).map(([date, dayMessages]) => {
                    // Filter only user messages for display (excluding thread messages)
                    const userMessages = (dayMessages as Message[]).filter((msg: Message) =>
                        msg.sender === "user" &&
                        !msg.parentId // Ensure only main messages are shown, not thread messages
                    );

                    return (
                        <div key={date} className="w-full" style={{ height: 'auto', minHeight: 'auto' }}>
                            <DateDivider date={date} />

                            {/* Elegant timeline of thoughts */}
                            {userMessages.map((message: Message) => {
                                const threadMessages = (messages ?? []).filter(msg =>
                                    msg.threadId === (message.threadId || message.id)
                                );
                                const threadCount = threadMessages.length > 1 ? threadMessages.length - 1 : 0;

                                return (
                                    <div key={message.id} className="w-full" style={{ height: 'auto', minHeight: 'auto' }}>
                                        {renderThoughtRecord ? renderThoughtRecord(message, threadCount) : (
                                            <div className="p-4">
                                                <div className="text-sm text-muted-foreground">
                                                    Message: {message.content}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-1">
                                                    Thread count: {threadCount}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
            <div className="absolute bottom-2 right-2 z-20">
                <ScrollToBottomButton
                    onClick={() => scrollToBottom({ behavior: 'smooth' })}
                    isVisible={canScrollToBottom}
                />
            </div>
        </>
    );
});
