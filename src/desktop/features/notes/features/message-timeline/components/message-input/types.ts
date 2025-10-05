import { Message } from "@/core/stores/notes-data.store";

export interface MessageInputProps {
    onSend: () => void;
    replyToMessageId?: string;
    onCancelReply: () => void;
}

export interface ToolbarButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    title?: string;
    disabled?: boolean;
    className?: string;
}

export interface ReplyIndicatorProps {
    replyToMessage: Message;
    onCancelReply: () => void;
}

export interface InputAreaProps {
    message: string;
    onMessageChange: (message: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    placeholder: string;
    disabled: boolean;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

export interface SendButtonProps {
    onSend: () => void;
    disabled: boolean;
    message: string;
}
