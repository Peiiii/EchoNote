import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useChatActions } from "@/common/features/notes/hooks/use-chat-actions";
import { useChatScroll } from "@/common/features/notes/hooks/use-chat-scroll";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useThreadSidebar } from "@/desktop/features/notes/features/thread-management/hooks/use-thread-sidebar";
import { useMessageSender } from "@/mobile/features/notes/hooks/use-message-sender";
import { useEffect, useRef } from "react";

export const useMobileNotesState = () => {
  const { currentChannelId } = useNotesViewStore();
  const { channels } = useNotesDataStore();
  const { messages, hasMore, loadMore } = useChannelMessages({});

  // Use specialized hooks
  const containerRef = useRef<HTMLDivElement>(null);
  const { isSticky, scrollToBottom } = useChatScroll(containerRef, [
    currentChannelId,
    messages.length,
  ]);
  const { replyToMessageId, handleCancelReply, handleReply } = useChatActions();
  const { isThreadOpen, handleOpenThread, handleCloseThread, handleSendThreadMessage } =
    useThreadSidebar();
  const { sendMessage, isAddingMessage } = useMessageSender();

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { scrollTop } = containerRef.current;

      if (scrollTop === 0 && hasMore && currentChannelId) {
        loadMore({ channelId: currentChannelId, messagesLimit: 20 });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [hasMore, loadMore, containerRef, currentChannelId]);

  const handleSendMessage = async (content: string) => {
    requestAnimationFrame(() => {
      scrollToBottom({ behavior: "instant" });
    });

    sendMessage(content, replyToMessageId || undefined);

    if (replyToMessageId) {
      handleCancelReply();
    }
  };

  return {
    // State
    currentChannelId,
    channels,
    messages,
    hasMore,
    isSticky,
    replyToMessageId,
    isThreadOpen,
    isAddingMessage,

    // Refs
    containerRef,

    // Actions
    handleSendMessage,
    handleCancelReply,
    handleOpenThread,
    handleCloseThread,
    handleSendThreadMessage,
    scrollToBottom,
    handleReply,
  };
};
