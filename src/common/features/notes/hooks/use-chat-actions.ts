import { useState } from "react";

export const useChatActions = () => {
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

  const handleSend = () => {
    setReplyToMessageId(null);
  };

  const handleCancelReply = () => {
    setReplyToMessageId(null);
  };

  return {
    replyToMessageId,
    handleSend,
    handleCancelReply,
    setReplyToMessageId,
  };
};
