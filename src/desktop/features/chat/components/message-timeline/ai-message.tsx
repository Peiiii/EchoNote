import { format } from "date-fns";
import { AIAvatar } from "./ai-avatar";
import { Reply } from "lucide-react";
import { Message } from "@/core/stores/chat-store";

interface AIMessageProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
}

export const AIMessage = ({ message, isFirstInGroup, onReply }: AIMessageProps) => (
    <div className={`max-w-4xl mx-auto ${isFirstInGroup ? 'mt-6' : 'mt-4'}`}>
        <div className="group relative">
            {/* Timestamp - shown on hover */}
            <div className="absolute -top-6 left-0 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {format(message.timestamp, 'MMM dd, yyyy HH:mm')}
            </div>
            
            {/* AI annotation content */}
            <div className="bg-slate-50 dark:bg-slate-800 border-l-4 border-purple-500 pl-6 py-4 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-start gap-3">
                    {/* AI avatar - small */}
                    <div className="flex-shrink-0">
                        <AIAvatar />
                    </div>
                    
                    {/* Content area */}
                    <div className="flex-1 min-w-0">
                        {/* AI label - small */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                AI Annotation
                            </span>
                        </div>
                        
                        {/* Annotation content */}
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words">
                                {message.content}
                            </div>
                        </div>
                    </div>
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
        </div>
    </div>
); 