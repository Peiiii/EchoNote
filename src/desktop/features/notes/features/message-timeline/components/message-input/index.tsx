import { InputArea } from "./components/input-area";
import { ReplyIndicator } from "./components/reply-indicator";
import { BottomActions } from "./components/bottom-actions";
import { useMessageInput } from "./hooks/use-message-input";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useInputCollapse } from "../../hooks/use-input-collapse";
import { useRef } from "react";

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
  // Outer container stays borderless so when collapsed nothing is visible
  const containerClass = `sticky bottom-0 z-10 shrink-0 ${isFocusMode ? "pb-4" : ""}`;
  const panelBase =
    "overflow-hidden transition-[max-height,opacity,transform,padding] duration-220 ease-out will-change-[max-height,opacity,transform] origin-bottom";
  const panelOpen = "max-h-[240px] opacity-100 translate-y-0";
  const panelClosed = "max-h-0 opacity-0 translate-y-1 py-0";
  const panelDecorOpen = isFocusMode
    ? "rounded-xl border border-border/60 shadow-xs"
    : "border-t border-border/60";
  const panelRef = useRef<HTMLDivElement>(null);
  return (
    <div className={containerClass}>
      <div
        ref={panelRef}
        className={`${panelBase} ${inputCollapsed ? panelClosed : panelOpen} bg-background ${
          inputCollapsed ? "" : panelDecorOpen
        }`}
        // Use a large max-height constant to avoid measuring before animating
        aria-hidden={inputCollapsed}
      >
        <div>
          {replyToMessage && (
            <ReplyIndicator replyToMessage={replyToMessage} onCancelReply={handleCancelReply} />
          )}

          <div className="relative px-2 pt-1">
            <InputArea
              message={message}
              onMessageChange={handleMessageChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isAddingMessage}
              textareaRef={textareaRef}
            />
          </div>

          <div className="px-2 pb-1">
            <BottomActions onSend={handleSend} canSend={!!message.trim() && !isAddingMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
