import { useChatActions } from "@/common/features/notes/hooks/use-chat-actions";
import { useMemo } from "react";

export const useTimelineState = () => {
  // Chat actions management (kept independent from edit state to avoid re-renders while typing)
  const chatActions = useChatActions();

  const memoizedChatActions = useMemo(
    () => ({
      replyToMessageId: chatActions.replyToMessageId,
      handleSend: chatActions.handleSend,
      handleCancelReply: chatActions.handleCancelReply,
    }),
    [chatActions.replyToMessageId, chatActions.handleSend, chatActions.handleCancelReply]
  );

  return {
    chatActions: memoizedChatActions,
  };
};
