import { format } from "date-fns";
import { MessageCircle, ChevronDown, ChevronRight, Reply } from "lucide-react";
import { useChatStore, Message } from "@/core/stores/chat-store";

interface UserMessageProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
}

export const UserMessage = ({ message, isFirstInGroup, onReply }: UserMessageProps) => {
    const { getThreadMessages, toggleThreadExpansion } = useChatStore();
    const threadMessages = getThreadMessages(message.threadId || message.id);
    const hasThread = threadMessages.length > 1;
    const isExpanded = message.isThreadExpanded || false;

    return (
        <div className={`max-w-4xl mx-auto ${isFirstInGroup ? 'mt-8' : 'mt-6'}`}>
            {/* User message content - like a paragraph */}
            <div className="group relative">
                {/* Timestamp - shown on hover */}
                <div className="absolute -top-6 left-0 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {format(message.timestamp, 'MMM dd, yyyy HH:mm')}
                </div>
                
                {/* Main content area */}
                <div className="bg-white dark:bg-slate-900 border-l-4 border-blue-500 pl-6 py-4 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* Action buttons - shown on hover */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onReply}
                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                            title="Reply"
                        >
                            <Reply className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Thread indicator */}
                {hasThread && (
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={() => toggleThreadExpansion(message.id)}
                            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors duration-200"
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                            ) : (
                                <ChevronRight className="w-4 h-4" />
                            )}
                            <MessageCircle className="w-4 h-4" />
                            <span>{threadMessages.length - 1} replies</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Thread content - shown when expanded */}
            {hasThread && isExpanded && (
                <div className="mt-4 ml-8 space-y-3">
                    {threadMessages
                        .filter(msg => msg.id !== message.id) // Exclude parent message
                        .map((threadMessage) => (
                            <div key={threadMessage.id} className="bg-slate-50 dark:bg-slate-800 border-l-2 border-slate-300 dark:border-slate-600 pl-4 py-3 rounded-r">
                                <div className="flex items-start gap-3">
                                    {threadMessage.sender === 'ai' && (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                            AI
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                                            {threadMessage.sender === 'ai' ? 'AI Assistant' : 'You'}
                                        </div>
                                        <div className="text-sm text-slate-700 dark:text-slate-300">
                                            {threadMessage.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}; 