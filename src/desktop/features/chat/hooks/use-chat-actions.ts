import { useState } from "react";
import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";

export const useChatActions = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30,
        deps: [] // 依赖项由外部传入
    });

    const handleSend = () => {
        setReplyToMessageId(null);
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyToMessageId(null);
    };

    const handleScrollToBottom = () => {
        setSticky(true);
        scrollToBottom();
    };

    return {
        replyToMessageId,
        isSticky,
        handleSend,
        handleCancelReply,
        handleScrollToBottom,
        setReplyToMessageId
    };
};
