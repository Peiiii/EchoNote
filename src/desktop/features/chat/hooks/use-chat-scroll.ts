import { useRef } from "react";
import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";

export const useChatScroll = (deps: unknown[] = []) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30,
        deps
    });

    const handleScrollToBottom = () => {
        setSticky(true);
        scrollToBottom();
    };

    return {
        containerRef,
        isSticky,
        handleScrollToBottom
    };
};
