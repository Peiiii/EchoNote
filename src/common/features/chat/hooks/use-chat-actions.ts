import { useState } from "react";
import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";

export const useChatActions = (containerRef: React.RefObject<HTMLDivElement | null>) => {
    const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30,
        deps: [] // Dependencies passed from outside
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
