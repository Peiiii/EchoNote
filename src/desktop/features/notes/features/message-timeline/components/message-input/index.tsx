import { InputArea } from "./components/input-area";
import { ReplyIndicator } from "./components/reply-indicator";
import { BottomActions } from "./components/bottom-actions";
import { useMessageInput } from "./hooks/use-message-input";
import { useUIStateStore } from "@/core/stores/ui-state.store";

export function MessageInput() {
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
  } = useMessageInput();
  const { sideView } = useUIStateStore();
  const isFocusMode = !sideView;
  const containerClass = isFocusMode
    ? "sticky top-0 z-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur rounded-xl border border-border/60 shadow-xs"
    : "sticky top-0 z-10 bg-background border-b border-border/60";
  return (
    <div className={containerClass}>
      {replyToMessage && (
        <ReplyIndicator replyToMessage={replyToMessage} onCancelReply={handleCancelReply} />
      )}

      <div className="relative px-3 pt-2">
        <InputArea
          message={message}
          onMessageChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isAddingMessage}
          textareaRef={textareaRef}
        />
      </div>

      <div className="px-3 pb-2">
        <BottomActions onSend={handleSend} canSend={!!message.trim() && !isAddingMessage} />
      </div>
    </div>
  );
}
