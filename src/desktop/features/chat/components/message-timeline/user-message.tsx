import { format } from "date-fns";
import { MessageCircle, ChevronRight, MoreHorizontal } from "lucide-react";
import { useChatStore, Message } from "@/core/stores/chat-store";

interface UserMessageProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
}

export const UserMessage = ({ message, isFirstInGroup, onReply }: UserMessageProps) => {
    const { getThreadMessages } = useChatStore();
    const threadMessages = getThreadMessages(message.threadId || message.id);
    const hasThread = threadMessages.length > 1;

    return (
        <div className={`max-w-3xl mx-auto ${isFirstInGroup ? 'mt-12' : 'mt-8'}`}>
            {/* User record - core content */}
            <div className="group relative">
                {/* Timestamp - subtle and elegant */}
                <div className="absolute -top-8 left-0 text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {format(message.timestamp, 'HH:mm')}
                </div>
                
                {/* Main record content - clean and minimal */}
                <div className="bg-white dark:bg-slate-900 border-l-2 border-slate-300 dark:border-slate-600 pl-6 py-5 rounded-r-lg hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* Subtle actions - only on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-1">
                        {hasThread && (
                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                                <MessageCircle className="w-3 h-3" />
                                <span>{threadMessages.length - 1}</span>
                            </div>
                        )}
                        <button
                            onClick={onReply}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Add thought"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Thread preview - minimal indicator */}
            {hasThread && (
                <div className="mt-3 ml-6">
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                        <span>{threadMessages.length - 1} thoughts</span>
                        <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            )}
        </div>
    );
}; 