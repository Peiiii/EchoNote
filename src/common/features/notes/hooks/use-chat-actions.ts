import { useState } from "react";

export const useChatActions = () => {
  const [replyToMessageId, setReplyToMessageId] = useState<string | undefined>(undefined);

  const handleSend = () => {
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
    handleSend,
    handleCancelReply,
    handleReply,
  };
};
