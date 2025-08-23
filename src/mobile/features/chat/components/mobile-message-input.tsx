import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/common/lib/utils";

interface MobileMessageInputProps {
    onSend: (message: string) => void;
    replyToMessageId?: string;
    onCancelReply: () => void;
    className?: string;
}

export const MobileMessageInput = ({
    onSend,
    replyToMessageId,
    onCancelReply,
    className = ""
}: MobileMessageInputProps) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isReplyMode = !!replyToMessageId;

    return (
        <div className={cn("border-t border-border bg-background p-3 space-y-3", className)}>
            {/* Reply indicator */}
            {isReplyMode && (
                <div className="flex items-center justify-between bg-muted rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Replying to message</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancelReply}
                        className="h-6 px-2 text-xs"
                    >
                        Cancel
                    </Button>
                </div>
            )}

            {/* Input area */}
            <div className="flex items-end gap-2">
                {/* Message input */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="min-h-[40px] max-h-[120px] resize-none"
                        rows={1}
                    />
                </div>

                {/* Send button */}
                <Button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
                >
                    <Send className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
