import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useChatReply } from "@/common/features/notes/hooks/use-chat-reply";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { logService, NoteType } from "@/core/services/log.service";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect, useMemo, useRef } from "react";
import { useComposerStateStore } from "@/core/stores/composer-state.store";

export function useMessageInput() {
  const presenter = useCommonPresenterContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentChannelId, isAddingMessage } = useNotesViewStore();
  const { messages: channelMessages = [] } = useChannelMessages({});
  const {
    clearReplyToMessageId,
    replyToMessageId,
    handleCancelReply
  } = useChatReply();
  
  const replyToMessage = useMemo(
    () =>
      replyToMessageId && channelMessages.length > 0
        ? channelMessages.find(msg => msg.id === replyToMessageId)
        : null,
    [replyToMessageId, channelMessages]
  );

  const composerExpanded = useComposerStateStore(s => s.expanded);
  const draft = useComposerStateStore(s => (currentChannelId ? (s.drafts[currentChannelId] ?? "") : ""));
  const setDraft = useComposerStateStore(s => s.setDraft);
  const clearDraft = useComposerStateStore(s => s.clearDraft);

  const message = draft;

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
      presenter.threadManager.addThreadMessage(replyToMessageId, {
        content: messageContent,
        sender: "user" as const,
        channelId: currentChannelId,
      });
    } else {
      presenter.noteManager.sendMessage({
        content: messageContent,
        sender: "user" as const,
        channelId: currentChannelId,
      });
    }

    clearReplyToMessageId();
    presenter.rxEventBus.requestTimelineScrollToLatest$.emit();
    clearDraft(currentChannelId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd+Enter sends while Enter alone keeps adding new lines
    if (!composerExpanded && e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMessageChange = (newMessage: string) => {
    if (!currentChannelId) return;
    setDraft(currentChannelId, newMessage);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const placeholder = replyToMessage
    ? `Reply to this message... (Ctrl/Cmd+Enter to send)`
    : `What's on your mind... (Ctrl/Cmd+Enter to send)`;

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
    handleCancelReply,
  };
}
