
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { ChannelList } from "@/desktop/features/chat/features/channel-management/components/channel-list";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/chat/features/message-timeline";
import { useAIAssistant } from "@/desktop/features/chat/features/ai-assistant/hooks/use-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";
import { usePaginatedMessages } from "@/common/features/chat/hooks/use-paginated-messages";

export function ChatPage() {
    const { currentChannelId } = useChatViewStore();
    const { messages } = usePaginatedMessages(20);

    // Use specialized hooks
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
    
    // TODO: 滚动加载更多消息的逻辑需要从MessageTimelineFeature内部获取containerRef
    // 暂时注释掉，等重构完成后再处理
    
    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <MessageTimelineFeature
                    messages={messages}
                    currentChannelId={currentChannelId || ''}
                    onOpenThread={handleOpenThread}
                    onOpenAIAssistant={handleOpenAIAssistant}
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