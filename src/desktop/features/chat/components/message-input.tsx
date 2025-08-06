import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send, Bot, Eye, Brain } from "lucide-react";
import { useChatStore, useCurrentChannel } from "@/core/stores/chat-store";

export const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
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

        // 模拟AI回复 - 只在有价值时回复
        setTimeout(() => {
            // 只有30%的概率AI会回复，模拟选择性回复
            if (Math.random() < 0.3) {
                const aiResponse = generateAIResponse(userMessage, currentChannel?.name || "");
                addMessage({
                    content: aiResponse,
                    sender: "ai",
                    channelId: currentChannelId,
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    const generateAIResponse = (userMessage: string, channelName: string): string => {
        const responses = [
            "这个想法很有深度，让我帮你进一步思考...",
            "我感受到了你的思考过程，这很有趣！",
            "这个观点很有价值，建议你可以继续深入...",
            "我已经记录下这个重要的想法，还有什么要补充的吗？",
            "你的思维很清晰，这个想法值得被珍视。",
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
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto">
                {/* 思想记录提示 */}
                <div className="mb-4 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Eye className="w-4 h-4" />
                    <span>记录你的思想</span>
                    {isFocused && (
                        <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                            <Brain className="w-4 h-4" />
                            <span>正在思考...</span>
                        </div>
                    )}
                </div>
                
                {/* 思想记录区域 */}
                <div className="relative">
                    <div className={`relative rounded-lg transition-all duration-300 ${
                        isFocused 
                            ? 'ring-2 ring-slate-300 dark:ring-slate-600 shadow-md' 
                            : 'ring-1 ring-slate-200 dark:ring-slate-700'
                    }`}>
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="在这里记录你的想法、感受、灵感或任何想要记住的思考... (Shift+Enter换行)"
                            className="min-h-[60px] max-h-[120px] resize-none pr-16 pl-4 py-4 bg-white dark:bg-slate-800 border-0 rounded-lg text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none"
                            disabled={isLoading}
                        />
                        
                        {/* 发送按钮 */}
                        <div className="absolute top-3 right-3">
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                                size="sm"
                                className={`rounded-md transition-all duration-300 ${
                                    message.trim() && !isLoading
                                        ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 hover:bg-slate-700 dark:hover:bg-slate-300'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* 底部提示 */}
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <span>按 Enter 记录</span>
                        <span>Shift + Enter 换行</span>
                    </div>
                </div>
            </div>
        </div>
    );
}; 