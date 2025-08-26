import { MessageInput } from "./message-input";

interface TimelineActionsProps {
    onSend: () => void;
    replyToMessageId?: string;
    onCancelReply: () => void;
    onOpenAIAssistant: (channelId?: string) => void;
    className?: string;
}

export const TimelineActions = ({
    onSend,
    replyToMessageId,
    onCancelReply,
    onOpenAIAssistant,
    className = ""
}: TimelineActionsProps) => {
    return (
        <div className={className}>
            <MessageInput
                onSend={onSend}
                replyToMessageId={replyToMessageId}
                onCancelReply={onCancelReply}
                onOpenAIAssistant={onOpenAIAssistant}
            />
        </div>
    );
};
