import { useRef, useState } from "react";
import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";
import { useChatStore } from "@/core/stores/chat-store";

export const useChatPage = () => {
    const { currentChannelId, messages } = useChatStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30,
        deps: [currentChannelId, messages.length]
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
        // State
        currentChannelId,
        messages,
        replyToMessageId,
        isSticky,
        
        // Refs
        containerRef,
        
        // Handlers
        handleSend,
        handleCancelReply,
        handleScrollToBottom,
        setReplyToMessageId
    };
};
