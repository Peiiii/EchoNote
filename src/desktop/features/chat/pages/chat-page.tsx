import { 
    ChannelList, 
    MessageInput, 
    ChatLayout, 
    ChatContent, 
    MessageTimelineContainer, 
    ScrollToBottomButton,
    ThreadSidebar
} from "../components";
import { useChatScroll, useChatActions, useThreadSidebar } from "../hooks";
import { useChatStore } from "@/core/stores/chat-store";

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