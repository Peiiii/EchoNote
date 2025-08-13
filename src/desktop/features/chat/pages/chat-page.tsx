
import { useChatStore } from "@/core/stores/chat-store";
import { ChannelList } from "@/desktop/features/chat/components/channel-list";
import { ChatContent } from "@/desktop/features/chat/components/chat-content";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/components/features/thread-sidebar";
import { MessageInput } from "@/desktop/features/chat/components/message-input";
import { MessageTimelineContainer } from "@/desktop/features/chat/components/ui/message-timeline-container";
import { ScrollToBottomButton } from "@/desktop/features/chat/components/ui/scroll-to-bottom-button";
import { useAIAssistant } from "@/desktop/features/chat/hooks/use-ai-assistant";
import { useChatActions } from "@/desktop/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/desktop/features/chat/hooks/use-chat-scroll";
import { useThreadSidebar } from "@/desktop/features/chat/hooks/use-thread-sidebar";

export const ChatPage = () => {
    const { currentChannelId, messages } = useChatStore();

    // 使用专门的hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleSend, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
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
                            <ScrollToBottomButton onClick={handleScrollToBottom} />
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