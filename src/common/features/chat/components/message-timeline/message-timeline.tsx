import { RefObject } from "react";
import { Message } from "@/core/stores/chat-data.store";
import { useGroupedMessages } from "../../hooks/use-grouped-messages";
import { usePaginatedMessages } from "../../hooks/use-paginated-messages";
import { DateDivider } from "./date-divider";
import { EmptyState } from "./empty-state";
import { MessageTimelineSkeleton } from "./message-skeleton";

interface MessageTimelineProps {
    renderThoughtRecord?: (message: Message, threadCount: number) => React.ReactNode;
    containerRef?: RefObject<HTMLDivElement | null>;
    className?: string;
}

export function MessageTimeline({
    renderThoughtRecord,
    containerRef,
    className = ""
}: MessageTimelineProps) {
    // 直接在组件内部调用 hook，自包含数据获取逻辑
    const { messages, loading } = usePaginatedMessages(20);

    const groupedMessages = useGroupedMessages(messages);

    // 检查是否有消息需要显示
    const hasMessages = Object.values(groupedMessages).some(dayMessages =>
        (dayMessages as Message[]).some((msg: Message) =>
            msg.sender === "user" &&
            !msg.parentId
        )
    );

    // 显示加载骨架屏
    if (loading) {
        return <MessageTimelineSkeleton count={5} />;
    }

    if (!hasMessages) {
        return <EmptyState />;
    }

    return (
        <div data-component="message-timeline"
            ref={containerRef}
            className={`w-full bg-background flex-1 overflow-y-auto min-h-0 ${className}`}
            style={{
                height: '100%',
                minHeight: '100%',
                maxHeight: '100%'
            }}
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
    );
}
