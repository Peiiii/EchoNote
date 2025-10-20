import { useState } from "react";

export const useChatReply = () => {
  const [replyToMessageId, setReplyToMessageId] = useState<string | undefined>(undefined);

  const clearReplyToMessageId = () => {
    setReplyToMessageId(undefined);
  };

  const handleCancelReply = () => {
    setReplyToMessageId(undefined);
  };

  const handleReply = (messageId: string) => {
    setReplyToMessageId(messageId);
  };

  return {
    replyToMessageId,
    clearReplyToMessageId,
    handleCancelReply,
    handleReply,
  };
};
