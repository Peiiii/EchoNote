import { 
    ChannelList, 
    MessageInput, 
    ChatLayout, 
    ChatContent, 
    MessageTimelineContainer, 
    ScrollToBottomButton 
} from "../components";
import { useChatPage } from "../hooks/use-chat-page";

export const ChatPage = () => {
    const {
        replyToMessageId,
        isSticky,
        containerRef,
        handleSend,
        handleCancelReply,
        handleScrollToBottom
    } = useChatPage();

    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <ChatContent
                    timeline={<MessageTimelineContainer containerRef={containerRef} />}
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
        />
    );
}; 