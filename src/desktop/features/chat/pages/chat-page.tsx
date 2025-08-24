
import { useEffect } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { ChannelList } from "@/desktop/features/chat/components/channel-list";
import { ChatContent } from "@/desktop/features/chat/components/chat-content";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/components/features/thread-sidebar";
import { MessageInput } from "@/desktop/features/chat/components/message-input";
import { MessageTimelineContainer } from "@/desktop/features/chat/components/ui/message-timeline-container";
import { ScrollToBottomButton } from "@/common/features/chat/components/ui/scroll-to-bottom-button";
import { useAIAssistant } from "@/desktop/features/chat/hooks/use-ai-assistant";
import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { useThreadSidebar } from "@/desktop/features/chat/hooks/use-thread-sidebar";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";

export function ChatPage() {
    const { currentChannelId } = useChatViewStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);

    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleSend, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
    
    // 滚动加载更多消息
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
    
    console.log("[ChatPage] ", {
        currentAIAssistantChannel
    });

    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <ChatContent
                    timeline={
                        <MessageTimelineContainer
                            containerRef={containerRef}
                            onOpenThread={handleOpenThread}
                            messages={messages}
                        />
                    }
                    input={
                        <MessageInput
                            onSend={handleSend}
                            replyToMessageId={replyToMessageId || undefined}
                            onCancelReply={handleCancelReply}
                            onOpenAIAssistant={handleOpenAIAssistant}
                        />
                    }
                    scrollButton={
                        !isSticky && (
                            <ScrollToBottomButton 
                                onClick={handleScrollToBottom} 
                                isVisible={!isSticky} 
                            />
                        )
                    }
                />
            }
            rightSidebar={
                (isThreadOpen || isAIAssistantOpen) && (
                    isThreadOpen ? (
                        <ThreadSidebar
                            isOpen={isThreadOpen}
                            onClose={handleCloseThread}
                            parentMessage={currentParentMessage}
                            threadMessages={currentThreadMessages}
                            onSendMessage={handleSendThreadMessage}
                        />
                    ) : (
                        <AIAssistantSidebar
                            isOpen={isAIAssistantOpen}
                            onClose={handleCloseAIAssistant}
                            channelId={currentAIAssistantChannel || ''}
                        />
                    )
                )
            }
        />
    );
};