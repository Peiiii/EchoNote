import { X, Send, MessageCircle, User, Bot } from "lucide-react";
import { Message } from "@/core/stores/chat-data-store";
import { useState } from "react";

interface ThreadSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    parentMessage: Message | null;
    threadMessages: Message[];
    onSendMessage: (content: string) => void;
}

export const ThreadSidebar = ({ 
    isOpen, 
    onClose, 
    parentMessage, 
    threadMessages, 
    onSendMessage 
}: ThreadSidebarProps) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSend = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-900">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Discussion</h3>
                    {threadMessages.length > 0 && (
                        <span className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full">
                            {threadMessages.length}
                        </span>
                    )}
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Parent Message */}
            {parentMessage && (
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                                Original Thought
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {parentMessage.content}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {threadMessages.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            No replies yet. Start the discussion!
                        </p>
                    </div>
                ) : (
                    threadMessages.map((message) => (
                        <div key={message.id} className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                message.sender === "user" 
                                    ? "bg-blue-500" 
                                    : "bg-slate-500"
                            }`}>
                                {message.sender === "user" ? (
                                    <User className="w-4 h-4 text-white" />
                                ) : (
                                    <Bot className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">
                                    {message.sender === "user" ? "You" : "AI Assistant"}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {message.content}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add to the discussion..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={2}
                        />
                    </div>
                    <button
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
