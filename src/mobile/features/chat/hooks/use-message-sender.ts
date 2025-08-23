import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from "@/core/stores/chat-view.store";

export const useMessageSender = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    onScrollToBottom?: () => void
) => {
    const { addMessage, addThreadMessage } = useChatDataStore();
    const { currentChannelId, isAddingMessage, setIsAddingMessage } = useChatViewStore();

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    const sendMessage = async (content: string, replyToMessageId?: string) => {
        if (!content.trim() || !currentChannelId) return;

        try {
            if (replyToMessageId) {
                // Add to thread
                await addThreadMessage(replyToMessageId, {
                    content: content.trim(),
                    sender: "user" as const,
                    channelId: currentChannelId,
                });
            } else {
                // Regular message
                await addMessage({
                    content: content.trim(),
                    sender: "user" as const,
                    channelId: currentChannelId,
                });
            }

            setIsAddingMessage(true);

            // Simulate AI response
            setTimeout(async () => {
                try {
                    if (replyToMessageId) {
                        // Add to thread
                        await addThreadMessage(replyToMessageId, {
                            content: "This is an AI response as an annotation to your message.",
                            sender: "ai" as const,
                            channelId: currentChannelId,
                        });
                    } else {
                        // Regular AI response
                        await addMessage({
                            content: "This is an AI response as an annotation to your content.",
                            sender: "ai" as const,
                            channelId: currentChannelId,
                        });
                    }
                } catch (error) {
                    console.error("Failed to add AI response:", error);
                } finally {
                    setIsAddingMessage(false);
                    // AI 响应完成后滚动到底部
                    if (onScrollToBottom) {
                        setTimeout(() => {
                            onScrollToBottom();
                        }, 100);
                    }
                }
            }, 1000);

            // Note: Scrolling is handled by the calling component

            return true;
        } catch (error) {
            console.error("Failed to send message:", error);
            return false;
        }
    };

    return {
        sendMessage,
        isAddingMessage,
        scrollToBottom,
    };
};
