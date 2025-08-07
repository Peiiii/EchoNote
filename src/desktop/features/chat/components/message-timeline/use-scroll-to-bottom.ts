import { RefObject, useCallback } from "react";


export const useScrollToBottom = (containerRef: RefObject<HTMLDivElement | null>) => {
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior
            });
        }
    }, [containerRef]);

    return {
        scrollToBottom
    };
};
