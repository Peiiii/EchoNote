import React, { useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface ModernChatInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ModernChatInputBar({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type your message..."
}: ModernChatInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSend = async () => {
    if (!value.trim() || disabled) return;
    await onSend();
  };

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm p-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[40px] max-h-[120px] resize-none pr-12 text-sm leading-relaxed"
            disabled={disabled}
            style={{
              paddingRight: "48px",
            }}
          />
          
          {/* Character count indicator */}
          {value.length > 0 && (
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {value.length}
            </div>
          )}
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          size="sm"
          className="h-10 w-10 p-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Helper text */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}
