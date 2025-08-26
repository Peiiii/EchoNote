import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";
import { useMessageSender } from "@/mobile/features/chat/hooks/use-message-sender";
import { useEffect } from 'react';

export const useMobileChatState = () => {
    const { currentChannelId } = useChatViewStore();
    const { channels } = useChatDataStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);
    
    // Use specialized hooks
    const { containerRef, isSticky, scrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleCancelReply, setReplyToMessageId } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { sendMessage, isAddingMessage } = useMessageSender();
    

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            
            const { scrollTop } = containerRef.current;
            
            if (scrollTop === 0 && hasMore) {
                loadMore();
            }
        };
        
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loadMore, containerRef]);

    const handleSendMessage = async (content: string) => {
        requestAnimationFrame(() => {
            scrollToBottom({ behavior: 'instant' });
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
        currentParentMessage,
        currentThreadMessages,
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
        setReplyToMessageId,
    };
};
