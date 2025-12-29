import { useCallback } from "react";

interface UseMobileTimelineStateProps {
  onSendMessage: (content: string) => void;
  setReplyToMessageId: (messageId: string | null) => void;
}

export const useMobileTimelineState = ({
  onSendMessage,
  setReplyToMessageId,
}: UseMobileTimelineStateProps) => {
  // Event handlers
  const handleReply = useCallback(
    (messageId: string) => {
      setReplyToMessageId(messageId);
    },
    [setReplyToMessageId]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      onSendMessage(content);
    },
    [onSendMessage]
  );

  return {
    // Actions
    handleReply,
    handleSendMessage,
  };
};
