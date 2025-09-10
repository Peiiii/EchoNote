import { ReplyIndicator } from "./components/reply-indicator";
import { Toolbar } from "./components/toolbar";
import { InputArea } from "./components/input-area";
import { SendButton } from "./components/send-button";
import { useMessageInput } from "./hooks/use-message-input";
import { MessageInputProps } from "./types";

export function MessageInput({ onSend, replyToMessageId, onCancelReply }: MessageInputProps) {
    const {
        message,
        textareaRef,
        replyToMessage,
        isAddingMessage,
        handleSend,
        handleKeyPress,
        handleMessageChange,
        placeholder,
        currentChannelId
    } = useMessageInput({ onSend, replyToMessageId, onCancelReply });

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-background">
            {replyToMessage && (
                <ReplyIndicator 
                    replyToMessage={replyToMessage} 
                    onCancelReply={onCancelReply} 
                />
            )}

            <Toolbar currentChannelId={currentChannelId} />

            <div className="relative">
                <InputArea
                    message={message}
                    onMessageChange={handleMessageChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={isAddingMessage}
                    textareaRef={textareaRef}
                />
                
                <SendButton
                    onSend={handleSend}
                    disabled={!message.trim() || isAddingMessage}
                    message={message}
                />
            </div>
        </div>
    );
}
