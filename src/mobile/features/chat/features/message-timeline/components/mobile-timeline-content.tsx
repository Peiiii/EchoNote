import { EmptyState } from "@/common/features/chat/components/message-timeline/empty-state";
import { MessageTimelineSkeleton } from "@/common/features/chat/components/message-timeline/message-skeleton";
import { MessageTimeline, MessageTimelineRef } from "@/common/features/chat/components/message-timeline/message-timeline";
import { useGroupedMessages } from "@/common/features/chat/hooks/use-grouped-messages";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";
import { Message } from "@/core/stores/chat-data.store";
import { MobileThoughtRecord } from "@/mobile/features/chat/features/message-timeline";
import { forwardRef, useImperativeHandle, useRef } from "react";

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
    // 使用 MessageTimeline 的 ref
    const messageTimelineRef = useRef<MessageTimelineRef>(null);


    // 直接在组件内部调用 hook，自包含数据获取逻辑
    const { messages, loading } = usePaginatedMessages(20);

    const groupedMessages = useGroupedMessages(messages);

    useImperativeHandle(ref, () => ({
        scrollToBottom: (options?: { behavior?: 'smooth' | 'instant' }) => {
            messageTimelineRef.current?.scrollToBottom(options);
        }
    }), [messageTimelineRef]);


    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <MobileThoughtRecord
            message={message}
            onOpenThread={onOpenThread}
            onReply={() => onReply(message.id)}
            threadCount={threadCount}
        />
    );



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
        <div className={`flex-1 min-h-0 relative overflow-hidden ${className}`}>
            {/* MessageTimeline 自己管理滚动 */}
            <MessageTimeline
                ref={messageTimelineRef}
                className="h-full"
                renderThoughtRecord={renderThoughtRecord}
                groupedMessages={groupedMessages}
                messages={messages}
            />
        </div>
    );
});
