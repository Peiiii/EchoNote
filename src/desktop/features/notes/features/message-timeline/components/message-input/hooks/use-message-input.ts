import { useState, useRef, useEffect, useMemo } from "react";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { logService, NoteType } from "@/core/services/log.service";
import { MessageInputProps } from "../types";

export function useMessageInput({ onSend, replyToMessageId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { sendMessage } = channelMessageService;
  const addThreadMessage = useNotesDataStore(state => state.addThreadMessage);
  const { currentChannelId, isAddingMessage } = useNotesViewStore();

  const { messages: channelMessages = [] } = useChannelMessages({});

  const replyToMessage = useMemo(
    () =>
      replyToMessageId && channelMessages.length > 0
        ? channelMessages.find(msg => msg.id === replyToMessageId)
        : null,
    [replyToMessageId, channelMessages]
  );

  const handleSend = async () => {
    if (!message.trim() || !currentChannelId) return;

    const messageContent = message.trim();
    const hasTags = messageContent.includes('#');
    const noteType = NoteType.TEXT;

    logService.logNoteCreate(
      currentChannelId,
      noteType,
      messageContent.length,
      hasTags
    );

    if (replyToMessageId) {
      logService.logMessageReply(
        replyToMessageId,
        currentChannelId,
        replyToMessageId
      );
      addThreadMessage(replyToMessageId, {
        content: messageContent,
        sender: "user" as const,
        channelId: currentChannelId,
      });
    } else {
      sendMessage({
        content: messageContent,
        sender: "user" as const,
        channelId: currentChannelId,
      });
    }

    onSend();
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: Allow new line (default behavior)
        return;
      } else {
        // Enter: Send message
        e.preventDefault();
        handleSend();
      }
    }
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const placeholder = replyToMessage
    ? `Reply to this message... (Enter to send, Shift+Enter for new line)`
    : `Record your thoughts... (Enter to send, Shift+Enter for new line)`;

  return {
    message,
    textareaRef,
    replyToMessage,
    isAddingMessage,
    handleSend,
    handleKeyDown,
    handleMessageChange,
    placeholder,
    currentChannelId,
  };
}
