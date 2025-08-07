import { 
    ChannelList, 
    MessageInput, 
    ChatLayout, 
    ChatContent, 
    MessageTimelineContainer, 
    ScrollToBottomButton,
    ThreadSidebar
} from "../components";
import { useChatPage } from "../hooks";

export const ChatPage = () => {
    const {
        replyToMessageId,
        isSticky,
        isThreadOpen,
        currentParentMessage,
        currentThreadMessages,
        containerRef,
        handleSend,
        handleCancelReply,
        handleScrollToBottom,
        handleOpenThread,
        handleCloseThread,
        handleSendThreadMessage
    } = useChatPage();

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