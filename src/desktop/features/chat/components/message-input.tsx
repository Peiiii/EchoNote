import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send, Bot, Sparkles, Brain, Heart } from "lucide-react";
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
        <div className="border-t border-white/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
                {/* 输入提示 */}
                <div className="mb-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Brain className="w-3 h-3" />
                    <span>记录你的想法...</span>
                    {isFocused && (
                        <span className="ml-auto animate-pulse">正在思考...</span>
                    )}
                </div>
                
                {/* 输入区域 */}
                <div className="relative">
                    <div className={`relative rounded-2xl transition-all duration-300 ${
                        isFocused 
                            ? 'ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/25' 
                            : 'ring-1 ring-slate-200/50 dark:ring-slate-700/50'
                    }`}>
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="在这里记录你的想法、灵感或思考... (Shift+Enter换行)"
                            className="min-h-[60px] max-h-[120px] resize-none pr-16 pl-4 py-4 bg-white/90 dark:bg-slate-800/90 border-0 rounded-2xl text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none"
                            disabled={isLoading}
                        />
                        
                        {/* 装饰性元素 */}
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                            {isLoading && (
                                <div className="flex items-center gap-1 text-blue-500">
                                    <Bot className="w-4 h-4 animate-pulse" />
                                    <span className="text-xs">AI思考中...</span>
                                </div>
                            )}
                            
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                                size="sm"
                                className={`rounded-full transition-all duration-300 ${
                                    message.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* 底部装饰 */}
                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-4">
                            <span>按 Enter 发送</span>
                            <span>Shift + Enter 换行</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>让AI助你思考</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 