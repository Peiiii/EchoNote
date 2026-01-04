import { InputArea } from "./components/input-area";
import { ReplyIndicator } from "./components/reply-indicator";
import { BottomActions } from "./components/bottom-actions";
import { HeaderActions } from "./components/header-actions";
import { useMessageInput } from "./hooks/use-message-input";
import { useInputCollapse } from "../../hooks/use-input-collapse";
import { useRef, useState, useEffect } from "react";

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
    shortcutHint,
    handleCancelReply,
  } = useMessageInput();
  const { inputCollapsed } = useInputCollapse();
  const [isFocused, setIsFocused] = useState(false);
  const showShortcutHint = isFocused;
  
  // Outer container stays borderless so when collapsed nothing is visible
  const containerClass = "sticky bottom-0 z-10 shrink-0";
  const panelBase =
    "overflow-hidden transition-[max-height,opacity,transform,padding] duration-220 ease-out will-change-[max-height,opacity,transform] origin-bottom";
  const panelOpen = "max-h-[180px] opacity-100 translate-y-0";
  const panelClosed = "max-h-0 opacity-0 translate-y-1 py-0";
  const panelDecorOpen = "border-t border-border/60";
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const handleFocusIn = () => setIsFocused(true);
    const handleFocusOut = (e: FocusEvent) => {
      if (!panel.contains(e.relatedTarget as Node)) {
        setIsFocused(false);
      }
    };

    panel.addEventListener('focusin', handleFocusIn);
    panel.addEventListener('focusout', handleFocusOut);

    return () => {
      panel.removeEventListener('focusin', handleFocusIn);
      panel.removeEventListener('focusout', handleFocusOut);
    };
  }, []);
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

          <HeaderActions />

          <div className="relative px-2 pt-0">
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
            <BottomActions 
              onSend={handleSend} 
              canSend={!!message.trim() && !isAddingMessage} 
              shortcutHint={showShortcutHint ? shortcutHint : undefined} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
