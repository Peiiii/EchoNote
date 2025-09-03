import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send } from "lucide-react";
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
        <div className={cn("bg-background p-4 space-y-3", className)}>
            {/* Reply indicator */}
            {isReplyMode && (
                <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
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

            {/* Input area - Perplexity style */}
            <div className="flex items-end gap-3">
                {/* Message input */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What's on your mind?"
                        className="min-h-[44px] max-h-[120px] resize-none rounded-2xl border-border/60 bg-background/80 backdrop-blur-sm shadow-sm focus:shadow-md focus:border-transparent focus:outline-none transition-all duration-200 px-4 py-2 text-base"
                        rows={1}
                    />
                </div>

                {/* Send button - Apple style */}
                <Button
                    variant="default"
                    onClick={handleSend}
                    disabled={!message.trim() || isSending}
                    size="icon"
                    className="h-11 w-11 flex-shrink-0 bg-primary rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                    {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    ) : (
                        <Send className="h-5 w-5" />
                    )}
                </Button>
            </div>
        </div>
    );
};
