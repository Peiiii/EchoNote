import { useRef } from "react";
import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";

export const useChatScroll = (deps: unknown[] = [], options: { smoothScroll?: boolean } = {}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30,
        deps
    });

    const handleScrollToBottom = () => {
        setSticky(true);
        scrollToBottom({ smooth: options.smoothScroll });
    };

    return {
        containerRef,
        isSticky,
        handleScrollToBottom
    };
};
