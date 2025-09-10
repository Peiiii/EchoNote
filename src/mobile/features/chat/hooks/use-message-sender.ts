import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

export const useMessageSender = () => {
    const { addMessage, addThreadMessage } = useNotesDataStore();
    const { currentChannelId, isAddingMessage, setIsAddingMessage } = useNotesViewStore();



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
                }
            }, 1000);

            return true;
        } catch (error) {
            console.error("Failed to send message:", error);
            return false;
        }
    };

    return {
        sendMessage,
        isAddingMessage,
    };
};
