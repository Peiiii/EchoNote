import { useState, useRef, useEffect, useMemo } from "react";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { isModifierKeyPressed, SHORTCUTS } from "@/common/lib/keyboard-shortcuts";
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && isModifierKeyPressed(e)) {
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
        ? `Reply to this message... (${SHORTCUTS.SEND} to send, Enter for new line)`
        : `Record your thoughts... (${SHORTCUTS.SEND} to send, Enter for new line)`;

    return {
        message,
        textareaRef,
        replyToMessage,
        isAddingMessage,
        handleSend,
        handleKeyDown,
        handleMessageChange,
        placeholder,
        currentChannelId
    };
}
