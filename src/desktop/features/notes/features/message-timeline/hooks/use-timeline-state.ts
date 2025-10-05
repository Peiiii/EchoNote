import { useChatActions } from "@/common/features/notes/hooks/use-chat-actions";
import { useRef, useMemo } from "react";

export const useTimelineState = () => {
    // Container ref for chat actions (still needed for some actions)
    const containerRef = useRef<HTMLDivElement>(null);

    // Chat actions management (kept independent from edit state to avoid re-renders while typing)
    const chatActions = useChatActions(containerRef);

    const memoizedChatActions = useMemo(() => ({
        replyToMessageId: chatActions.replyToMessageId,
        handleSend: chatActions.handleSend,
        handleCancelReply: chatActions.handleCancelReply,
        chatIsSticky: chatActions.isSticky,
    }), [
        chatActions.replyToMessageId,
        chatActions.handleSend,
        chatActions.handleCancelReply,
        chatActions.isSticky
    ]);

    return {
        chatActions: memoizedChatActions,
    };
};
