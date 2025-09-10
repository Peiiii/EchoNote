import { useState, useRef, useEffect, useMemo } from "react";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { MessageInputProps } from "../types";

export function useMessageInput({ onSend, replyToMessageId }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage } = channelMessageService;
    const addThreadMessage = useNotesDataStore(state => state.addThreadMessage);
    const { currentChannelId, isAddingMessage } = useNotesViewStore();

    const { messages: channelMessages = [] } = useChannelMessages({});

    const replyToMessage = useMemo(() =>
        replyToMessageId && channelMessages.length > 0
            ? channelMessages.find(msg => msg.id === replyToMessageId)
            : null
        , [replyToMessageId, channelMessages]);

    const handleSend = async () => {
        if (!message.trim() || !currentChannelId) return;

        if (replyToMessageId) {
            addThreadMessage(replyToMessageId, {
                content: message.trim(),
                sender: "user" as const,
                channelId: currentChannelId,
            });
        } else {
            sendMessage({
                content: message.trim(),
                sender: "user" as const,
                channelId: currentChannelId,
            });
        }

        onSend();
        setMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleMessageChange = (newMessage: string) => {
        setMessage(newMessage);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    const placeholder = replyToMessage 
        ? "Reply to this message... (Enter to send, Shift+Enter for new line)"
        : "Record your thoughts... (Enter to send, Shift+Enter for new line)";

    return {
        message,
        textareaRef,
        replyToMessage,
        isAddingMessage,
        handleSend,
        handleKeyPress,
        handleMessageChange,
        placeholder,
        currentChannelId
    };
}
