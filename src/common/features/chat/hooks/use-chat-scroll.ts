import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";
import { useEffect, useRef, useState } from "react";

export const checkCanScrollToBottom = (element: HTMLElement | null, threshold: number = 5) => {
    if (!element) return false;

    const { scrollTop, clientHeight, scrollHeight } = element;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;

    return distanceToBottom > threshold;
};


export const useChatScroll = (deps: unknown[] = [], options: { smoothScroll?: boolean, threshold?: number } = {}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: options.threshold ?? 30,
        deps
    });

    const [canScrollToBottom, setCanScrollToBottom] = useState(false);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            setCanScrollToBottom(checkCanScrollToBottom(container, options.threshold ?? 30));
            const handleScroll = () => {
                setCanScrollToBottom(checkCanScrollToBottom(container, options.threshold ?? 30));
            };
            container.addEventListener('scroll', handleScroll);
            return () => {
                container?.removeEventListener('scroll', handleScroll);
            };
        }
    }, [containerRef, options.threshold]);



    const handleScrollToBottom = (options?: { behavior?: 'smooth' | 'instant' }) => {
        setSticky(true);
        scrollToBottom({ smooth: options?.behavior === 'smooth' });
    };

    return {
        containerRef,
        isSticky,
        scrollToBottom: handleScrollToBottom,
        canScrollToBottom
    };
};
