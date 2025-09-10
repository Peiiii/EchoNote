import { MessageInput } from "./message-input";

interface TimelineActionsProps {
    onSend: () => void;
    replyToMessageId?: string;
    onCancelReply: () => void;
    className?: string;
}

export const TimelineActions = ({
    onSend,
    replyToMessageId,
    onCancelReply,
    className = ""
}: TimelineActionsProps) => {
    return (
        <div className={className}>
            <MessageInput
                onSend={onSend}
                replyToMessageId={replyToMessageId}
                onCancelReply={onCancelReply}
            />
        </div>
    );
};
