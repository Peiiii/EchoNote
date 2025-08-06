import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send, Bot } from "lucide-react";
import { useChatStore, useCurrentChannel } from "@/core/stores/chat-store";

export const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { addMessage, currentChannelId } = useChatStore();
    const currentChannel = useCurrentChannel();

    const handleSendMessage = async () => {
        if (!message.trim() || !currentChannelId) return;

        // 发送用户消息
        addMessage({
            content: message.trim(),
            sender: "user",
            channelId: currentChannelId,
        });

        const userMessage = message.trim();
        setMessage("");
        setIsLoading(true);

        // 模拟AI回复
        setTimeout(() => {
            const aiResponse = generateAIResponse(userMessage, currentChannel?.name || "");
            addMessage({
                content: aiResponse,
                sender: "ai",
                channelId: currentChannelId,
            });
            setIsLoading(false);
        }, 1000);
    };

    const generateAIResponse = (userMessage: string, channelName: string): string => {
        const responses = [
            "我理解你的想法，这很有趣！",
            "这是一个很好的观点，让我想想...",
            "我记录下来了，还有什么要补充的吗？",
            "这个想法很有价值，建议你可以进一步思考...",
            "我已经帮你整理好了这个信息。",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return randomResponse;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // 自动调整文本框高度
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="border-t p-4 bg-card">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入你的消息... (Shift+Enter换行)"
                        className="min-h-[40px] max-h-[120px] resize-none pr-12"
                        disabled={isLoading}
                    />
                    
                    {isLoading && (
                        <div className="absolute right-3 top-3">
                            <Bot className="w-4 h-4 animate-pulse text-muted-foreground" />
                        </div>
                    )}
                </div>
                
                <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isLoading}
                    size="sm"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}; 