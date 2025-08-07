import { format } from "date-fns";
import { MessageCircle } from "lucide-react";
import { Message } from "@/core/stores/chat-store";

interface AIMessageProps {
    message: Message;
    isFirstInGroup: boolean;
}

export const AIMessage = ({ message, isFirstInGroup }: AIMessageProps) => (
    <div className={`max-w-3xl mx-auto ${isFirstInGroup ? 'mt-6' : 'mt-4'}`}>
        <div className="group relative">
            {/* Timestamp - very subtle */}
            <div className="absolute -top-6 left-0 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {format(message.timestamp, 'HH:mm')}
            </div>
            
            {/* AI annotation - minimal and subtle */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 border-l border-slate-200 dark:border-slate-700 pl-4 py-3 rounded-r-lg">
                <div className="flex items-start gap-2">
                    {/* AI indicator - very small */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                            <MessageCircle className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400" />
                        </div>
                    </div>
                    
                    {/* Content - subtle and minimal */}
                    <div className="flex-1 min-w-0">
                        <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-wrap break-words">
                            {message.content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
); 