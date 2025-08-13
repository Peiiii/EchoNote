
import { useChatStore } from "@/core/stores/chat-store";
import { ChannelList } from "@/desktop/features/chat/components/channel-list";
import { ChatContent } from "@/desktop/features/chat/components/chat-content";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { ThreadSidebar } from "@/desktop/features/chat/components/features/thread-sidebar";
import { MessageInput } from "@/desktop/features/chat/components/message-input";
import { MessageTimelineContainer } from "@/desktop/features/chat/components/ui/message-timeline-container";
import { ScrollToBottomButton } from "@/desktop/features/chat/components/ui/scroll-to-bottom-button";
import { useChatActions, useChatScroll, useThreadSidebar } from "../hooks";

export const ChatPage = () => {
    const { currentChannelId, messages } = useChatStore();

    // 使用专门的hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleSend, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();

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
                isThreadOpen && (
                    <ThreadSidebar
                        isOpen={isThreadOpen}
                        onClose={handleCloseThread}
                        parentMessage={currentParentMessage}
                        threadMessages={currentThreadMessages}
                        onSendMessage={handleSendThreadMessage}
                    />
                )
            }
        />
    );
}; 