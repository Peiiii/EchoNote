import { useEffect } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { usePaginatedMessages } from "@/desktop/features/chat/hooks/use-paginated-messages";
import { useChatScroll } from "@/desktop/features/chat/hooks/use-chat-scroll";
import { useChatActions } from "@/desktop/features/chat/hooks/use-chat-actions";
import { useThreadSidebar } from "@/desktop/features/chat/hooks/use-thread-sidebar";
import { useMessageSender } from "@/mobile/features/chat/hooks/use-message-sender";

export const useMobileChatState = () => {
    const { currentChannelId } = useChatViewStore();
    const { channels } = useChatDataStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);
    
    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { sendMessage, isAddingMessage } = useMessageSender(containerRef, handleScrollToBottom);
    
    // 滚动加载更多消息
    const handleScroll = () => {
        if (!containerRef.current) return;
        
        const { scrollTop } = containerRef.current;
        
        // 当滚动到顶部时加载更多消息
        if (scrollTop === 0 && hasMore) {
            loadMore();
        }
    };
    
    // 添加滚动事件监听器
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loadMore]);

    // 使用公共的消息发送处理
    const handleSendMessage = async (content: string) => {
        await sendMessage(content, replyToMessageId || undefined);
        
        // 清除回复状态
        if (replyToMessageId) {
            handleCancelReply();
        }
        
        // 发送消息后强制滚动到底部
        setTimeout(() => {
            // 强制设置sticky状态并滚动到底部
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }, 100);
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
    };
};
