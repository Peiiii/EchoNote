import { useChatStore, useCurrentChannel } from "@/core/stores/chat-store";
import { MoreHorizontal, Paperclip, Phone, Scissors, Send, Smile, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            {/* 顶部工具栏 - 统一图标样式 */}
            <div className="px-4 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {/* 左侧功能图标 - 统一样式 */}
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Smile className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Scissors className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
                
                {/* 右侧通话图标 - 统一样式 */}
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Video className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 书写区域 - 更紧凑的布局 */}
            <div className="px-4 pb-2">
                <div className="w-full">
                    <div className="relative min-h-[40px] bg-transparent">
                        {/* 可写区域 - 无边框，像白纸 */}
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="记录你的想法... (Enter 记录，Shift + Enter 换行)"
                            className="w-full min-h-[50px] max-h-[200px] resize-none pr-12 pl-4 py-2 bg-transparent border-0 rounded-none text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-sm focus:ring-0 focus:outline-none focus:border-0 shadow-none"
                            disabled={isLoading}
                            style={{
                                caretColor: '#3b82f6', // 蓝色光标
                            }}
                        />
                        
                        {/* 发送按钮 - 悬浮在书写区域 */}
                        <div className="absolute bottom-2 right-2">
                            <button
                                onClick={handleSendMessage}
                                disabled={!message.trim() || isLoading}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                                    message.trim() && !isLoading
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                                }`}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 