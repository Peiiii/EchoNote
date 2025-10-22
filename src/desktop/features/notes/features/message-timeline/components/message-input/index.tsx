import { InputArea } from "./components/input-area";
import { ReplyIndicator } from "./components/reply-indicator";
import { BottomActions } from "./components/bottom-actions";
import { useMessageInput } from "./hooks/use-message-input";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useInputCollapse } from "../../hooks/use-input-collapse";

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
  const { inputCollapsed } = useInputCollapse();
  const containerClass = isFocusMode
    ? "sticky top-0 z-10 bg-background supports-[backdrop-filter]:bg-background/80 backdrop-blur rounded-xl border border-border/60 shadow-xs"
    : "sticky top-0 z-10 bg-background border-b border-border/60";
  return (
    <div className={containerClass}>
      <div
        className={`overflow-hidden transition-[max-height,opacity,padding] duration-200 ease-out ${
          inputCollapsed ? "max-h-0 opacity-0 py-0" : "max-h-[320px] opacity-100"
        }`}
        aria-hidden={inputCollapsed}
      >
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
    </div>
  );
}
