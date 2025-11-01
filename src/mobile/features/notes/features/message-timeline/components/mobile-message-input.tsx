import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { cn } from "@/common/lib/utils";

interface MobileMessageInputProps {
  onSend: (message: string) => void;
  replyToMessageId?: string;
  onCancelReply: () => void;
  isSending?: boolean;
  className?: string;
}

export const MobileMessageInput = ({
  onSend,
  replyToMessageId,
  onCancelReply,
  isSending = false,
  className = "",
}: MobileMessageInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Mobile default: single-row minimalist input, actions hidden by design

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift+Enter: Allow new line (default behavior)
        return;
      } else {
        // Enter: Send message
        e.preventDefault();
        handleSend();
      }
    }
  };

  const isReplyMode = !!replyToMessageId;

  return (
    <div className={cn("bg-background px-3 sm:px-4 py-2 space-y-2 border-t border-border/60", className)}>
      {/* Reply indicator */}
      {isReplyMode && (
        <div className="flex items-center justify-between bg-muted/50 rounded-xl px-3 py-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Replying to message</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-7 px-3 text-xs rounded-lg"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Input area - unified, with embedded actions (like top AI products) */}
      <div className="flex items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="min-h-[48px] max-h-[120px] resize-none bg-transparent shadow-none focus:shadow-none focus:outline-none transition-all duration-200 text-base placeholder:text-muted-foreground/60 border-0 pl-0 pr-12 py-2"
            rows={1}
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 ${
                !message.trim() || isSending ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""
              }`}
              aria-label="Send"
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* No bottom actions for mobile minimalist mode */}
    </div>
  );
};
