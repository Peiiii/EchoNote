
import { useChannelMessages } from "@/common/features/chat/hooks/use-channel-messages";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { Bot, FileText, Image, Mic, MoreHorizontal, Phone, Reply, Send, Smile, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";



interface MessageInputProps {
    onSend: () => void;
    replyToMessageId?: string;
    onCancelReply: () => void;
    onOpenAIAssistant: (channelId?: string) => void;
}

export function MessageInput({ onSend, replyToMessageId, onCancelReply, onOpenAIAssistant }: MessageInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { sendMessage } = channelMessageService
    const addThreadMessage = useChatDataStore(state => state.addThreadMessage);
    const { currentChannelId, isAddingMessage } = useChatViewStore();

    // 遵循Zustand最佳实践：分别订阅不同的状态
    // const {messages: channelMessages} = useChatDataStore(state => 
    //     currentChannelId ? state.messagesByChannel[currentChannelId] || {
    //         messages: [],
    //         loading: false,
    //         hasMore: true,
    //         lastVisible: null
    //     } : {
    //         messages: [],
    //         loading: false,
    //         hasMore: true,
    //         lastVisible: null
    //     }
    // );
    const { messages: channelMessages = [] } = useChannelMessages({});

    // 使用useMemo避免每次渲染都重新计算
    const replyToMessage = useMemo(() =>
        replyToMessageId && channelMessages.length > 0
            ? channelMessages.find(msg => msg.id === replyToMessageId)
            : null
        , [replyToMessageId, channelMessages]);

    const handleSend = async () => {
        if (!message.trim() || !currentChannelId) return;

        if (replyToMessageId) {
            // Add to thread
            addThreadMessage(replyToMessageId, {
                content: message.trim(),
                sender: "user" as const,
                channelId: currentChannelId,
            });
        } else {
            // Regular message
            sendMessage({
                content: message.trim(),
                sender: "user" as const,
                channelId: currentChannelId,
            });
        }

        // Notify parent component that message was sent
        onSend();

        setMessage("");
    };



    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-background">
            {/* Reply indicator */}
            {replyToMessage && (
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Reply className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-700 dark:text-blue-300">Reply:</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {replyToMessage.content.substring(0, 50)}...
                            </span>
                        </div>
                        <button
                            onClick={onCancelReply}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

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
                    <button
                        onClick={() => onOpenAIAssistant?.(currentChannelId || undefined)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-all duration-200"
                        title="Open AI Assistant"
                    >
                        <Bot className="w-4 h-4" />
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
                            placeholder={replyToMessage ? "Reply to this message... (Enter to send, Shift+Enter for new line)" : "Record your thoughts... (Enter to send, Shift+Enter for new line)"}
                            className="w-full min-h-[50px] max-h-[200px] resize-none pr-12 pl-4 py-2 bg-transparent border-0 rounded-none text-sm leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-sm focus:ring-0 focus:outline-none focus:border-0 shadow-none"
                            disabled={isAddingMessage}
                            style={{
                                caretColor: '#3b82f6', // Blue cursor
                            }}
                        />

                        {/* Send button - floating on writing area */}
                        <div className="absolute bottom-2 right-2">
                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isAddingMessage}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${message.trim() && !isAddingMessage
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