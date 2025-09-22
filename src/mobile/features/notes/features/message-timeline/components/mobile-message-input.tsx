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

            {/* Input area - unified, with embedded actions (like top AI products) */}
            <div className="flex items-end">
                {/* Message input with inline send button */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What's on your mind?"
                        className="min-h-[52px] max-h-[120px] resize-none rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm shadow-sm focus:shadow-none focus:outline-none transition-all duration-200 pl-4 pr-12 py-3 text-base"
                        rows={1}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleSend}
                        disabled={!message.trim() || isSending}
                        size="icon"
                        className={`absolute right-2 bottom-2 h-9 w-9 rounded-full transition-colors duration-150 ${
                            message.trim() && !isSending
                                ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 shadow-sm'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                        }`}
                        aria-label="Send"
                    >
                        {isSending ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
