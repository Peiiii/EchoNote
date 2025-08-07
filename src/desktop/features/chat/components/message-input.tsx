import { useChatStore } from "@/core/stores/chat-store";
import { MoreHorizontal, Phone, Send, Smile, Video, Mic, Image, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const MessageInput = () => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { addMessage, currentChannelId } = useChatStore();

    const handleSendMessage = async () => {
        if (!message.trim() || !currentChannelId) return;

        // Send user message
        addMessage({
            content: message.trim(),
            sender: "user",
            channelId: currentChannelId,
        });


        setMessage("");
        setIsLoading(true);

        // Simulate AI response - only reply when valuable
        setTimeout(() => {
            // Only 30% chance AI will reply, simulating selective responses
            if (Math.random() < 0.3) {
                const aiResponse = generateAIResponse();
                addMessage({
                    content: aiResponse,
                    sender: "ai",
                    channelId: currentChannelId,
                });
            }
            setIsLoading(false);
        }, 1000);
    };

    const generateAIResponse = (): string => {
        const responses = [
            "This is a deep thought, let me help you explore it further...",
            "I can feel your thinking process, this is fascinating!",
            "This perspective has great value, I suggest you continue to explore...",
            "I've recorded this important idea, anything else to add?",
            "Your thinking is very clear, this idea deserves to be cherished.",
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

    // Auto-adjust textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [message]);

    return (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            {/* Top toolbar - unified icon style */}
            <div className="px-4 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {/* Left function icons - unified style */}
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Smile className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Image className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <FileText className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Mic className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Right call icons - unified style */}
                <div className="flex items-center gap-1">
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Phone className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200">
                        <Video className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Writing area - more compact layout */}
            <div className="px-4 pb-2">
                <div className="w-full">
                    <div className="relative min-h-[50px] bg-transparent">
                        {/* Writable area - no border, like white paper */}
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Record your thoughts... (Enter to send, Shift+Enter for new line)"
                            className="w-full min-h-[50px] max-h-[200px] resize-none pr-12 pl-4 py-2 bg-transparent border-0 rounded-none text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-sm focus:ring-0 focus:outline-none focus:border-0 shadow-none"
                            disabled={isLoading}
                            style={{
                                caretColor: '#3b82f6', // Blue cursor
                            }}
                        />
                        
                        {/* Send button - floating on writing area */}
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