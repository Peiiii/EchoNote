import { useEffect } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";
import { useMessageSender } from "@/mobile/features/chat/hooks/use-message-sender";

export const useMobileChatState = () => {
    const { currentChannelId } = useChatViewStore();
    const { channels } = useChatDataStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);
    
    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleCancelReply, setReplyToMessageId } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { sendMessage, isAddingMessage } = useMessageSender();
    
    // 添加滚动事件监听器
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            
            const { scrollTop } = containerRef.current;
            
            // 当滚动到顶部时加载更多消息
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

    // 处理消息发送，包括自动滚动到底部
    const handleSendMessage = async (content: string) => {
        // 立即滚动到底部，确保用户体验流畅
        requestAnimationFrame(() => {
            handleScrollToBottom();
        });
        
        // 发送消息（异步，包含AI响应）
        sendMessage(content, replyToMessageId || undefined);
        
        // 清除回复状态
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
        handleScrollToBottom,
        setReplyToMessageId,
    };
};
