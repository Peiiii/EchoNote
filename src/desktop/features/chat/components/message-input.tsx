import { useState, useRef, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { Send, Bot, Sparkles, Brain, Heart, Eye, PenTool, Star } from "lucide-react";
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
        <div className="border-t border-white/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8">
            <div className="max-w-5xl mx-auto">
                {/* 思想记录提示 */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">记录你的思想</span>
                        </div>
                        {isFocused && (
                            <div className="flex items-center gap-2 text-blue-500 animate-pulse">
                                <Brain className="w-4 h-4" />
                                <span>正在思考...</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>让时间见证你的成长</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span>每一个想法都值得被珍视</span>
                    </div>
                </div>
                
                {/* 思想记录区域 */}
                <div className="relative">
                    <div className={`relative rounded-3xl transition-all duration-500 ${
                        isFocused 
                            ? 'ring-2 ring-blue-500/50 shadow-xl shadow-blue-500/25 scale-[1.01]' 
                            : 'ring-1 ring-slate-200/50 dark:ring-slate-700/50 shadow-lg'
                    }`}>
                        <Textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder="在这里记录你的想法、感受、灵感或任何想要记住的思考... (Shift+Enter换行)"
                            className="min-h-[80px] max-h-[120px] resize-none pr-20 pl-6 py-6 bg-white/95 dark:bg-slate-800/95 border-0 rounded-3xl text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 focus:outline-none font-medium"
                            disabled={isLoading}
                        />
                        
                        {/* 装饰性元素 */}
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                            {isLoading && (
                                <div className="flex items-center gap-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                                    <Bot className="w-4 h-4 animate-pulse" />
                                    <span className="text-xs font-medium">AI思考中...</span>
                                </div>
                            )}
                            
                            <Button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                                size="sm"
                                className={`rounded-full transition-all duration-300 ${
                                    message.trim() && !isLoading
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    
                    {/* 底部装饰和提示 */}
                    <div className="flex items-center justify-between mt-4 text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <PenTool className="w-3 h-3" />
                                <span>记录思想</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-3 h-3" />
                                <span>表达感受</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-3 h-3" />
                                <span>捕捉灵感</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span>按 Enter 记录</span>
                            <span>Shift + Enter 换行</span>
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>AI助你思考</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 