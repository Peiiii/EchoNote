import { useEffect, useState } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileChannelList } from "@/mobile/features/chat/components/mobile-channel-list";
import { MobileChatContent } from "@/mobile/features/chat/components/mobile-chat-content";
import { MobileChatLayout } from "@/mobile/features/chat/components/mobile-chat-layout";
import { MobileMessageInput } from "@/mobile/features/chat/components/mobile-message-input";
import { MobileMessageTimelineContainer } from "@/mobile/features/chat/components/ui/mobile-message-timeline-container";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/ui/mobile-scroll-to-bottom-button";
import { useAIAssistant } from "@/desktop/features/chat/hooks/use-ai-assistant";
import { useChatActions } from "@/desktop/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/desktop/features/chat/hooks/use-chat-scroll";
import { useThreadSidebar } from "@/desktop/features/chat/hooks/use-thread-sidebar";
import { usePaginatedMessages } from "@/desktop/features/chat/hooks/use-paginated-messages";
import { MobileThreadSidebar } from "@/mobile/features/chat/components/mobile-thread-sidebar";
import { MobileAIAssistantSidebar } from "@/mobile/features/chat/components/mobile-ai-assistant-sidebar";

export function MobileChatPage() {
    const { currentChannelId } = useChatViewStore();
    const { channels } = useChatDataStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);

    // Get current channel name for header
    const currentChannel = channels.find(channel => channel.id === currentChannelId);

    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleSend, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
    
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

    // 移动端特有的处理：关闭频道列表当选择频道后
    const handleChannelSelect = (channelId: string) => {
        useChatViewStore.getState().setCurrentChannel(channelId);
        setIsChannelListOpen(false);
    };

    // 移动端特有的处理：关闭侧边栏当打开线程或AI助手后
    useEffect(() => {
        if (isThreadOpen || isAIAssistantOpen) {
            setIsChannelListOpen(false);
        }
    }, [isThreadOpen, isAIAssistantOpen]);

    console.log("[MobileChatPage] ", {
        currentAIAssistantChannel,
        isChannelListOpen,
        currentChannelName: currentChannel?.name
    });

    return (
        <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <MobileHeader
                onOpenChannelList={() => setIsChannelListOpen(true)}
                onOpenAIAssistant={handleOpenAIAssistant}
                currentChannelName={currentChannel?.name}
            />
            
            {/* Chat Layout */}
            <div className="flex-1 min-h-0">
                <MobileChatLayout
                    sidebar={
                        <MobileChannelList 
                            isOpen={isChannelListOpen}
                            onClose={() => setIsChannelListOpen(false)}
                            onChannelSelect={handleChannelSelect}
                        />
                    }
                    content={
                        <MobileChatContent
                            timeline={
                                <MobileMessageTimelineContainer
                                    containerRef={containerRef}
                                    onOpenThread={handleOpenThread}
                                    messages={messages}
                                />
                            }
                            input={
                                <MobileMessageInput
                                    onSend={handleSend}
                                    replyToMessageId={replyToMessageId || undefined}
                                    onCancelReply={handleCancelReply}
                                />
                            }
                            scrollButton={
                                !isSticky && (
                                    <MobileScrollToBottomButton onClick={handleScrollToBottom} />
                                )
                            }
                        />
                    }
                    rightSidebar={
                        (isThreadOpen || isAIAssistantOpen) && (
                            isThreadOpen ? (
                                <MobileThreadSidebar
                                    isOpen={isThreadOpen}
                                    onClose={handleCloseThread}
                                    parentMessage={currentParentMessage}
                                    threadMessages={currentThreadMessages}
                                    onSendMessage={handleSendThreadMessage}
                                />
                            ) : (
                                <MobileAIAssistantSidebar
                                    isOpen={isAIAssistantOpen}
                                    onClose={handleCloseAIAssistant}
                                    channelId={currentAIAssistantChannel || ''}
                                />
                            )
                        )
                    }
                />
            </div>
        </div>
    );
};
