import { InputArea } from "./components/input-area";
import { ReplyIndicator } from "./components/reply-indicator";
import { SendButton } from "./components/send-button";
import { Toolbar } from "./components/toolbar";
import { useMessageInput } from "./hooks/use-message-input";
import { MessageInputProps } from "./types";

export function MessageInput({ onSend }: MessageInputProps) {
  const {
    message,
    textareaRef,
    replyToMessage,
    isAddingMessage,
    handleSend,
    handleKeyDown,
    handleMessageChange,
    placeholder,
    handleCancelReply,
  } = useMessageInput({ onSend });

  return (
    <div className="bg-white dark:bg-background border-t border-slate-200/50 dark:border-slate-700/50">
      {replyToMessage && (
        <ReplyIndicator replyToMessage={replyToMessage} onCancelReply={handleCancelReply} />
      )}

      <Toolbar />

      <div className="relative">
        <InputArea
          message={message}
          onMessageChange={handleMessageChange}
          onKeyDown={handleKeyDown}
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
