import { format } from "date-fns";
import { MoreHorizontal, Clock, Eye, Bookmark, MessageCircle } from "lucide-react";
import { Message } from "@/core/stores/chat-store";

interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
    onOpenThread?: (messageId: string) => void;
    threadCount?: number;
}

export const ThoughtRecord = ({ message, onReply, onOpenThread, threadCount = 0 }: ThoughtRecordProps) => {
    return (
        <div className="w-full">
            {/* Thought Record Container - Enhanced with subtle interactions */}
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ease-out hover:scale-[1.001] hover:shadow-sm">
                
                {/* Record Header - Enhanced with better visual hierarchy */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{format(message.timestamp, 'HH:mm')}</span>
                        </div>
                    </div>
                    
                    {/* Enhanced Action Menu - Progressive disclosure */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        <button
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="View details"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="Bookmark"
                        >
                            <Bookmark className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onReply}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
                            title="Add thought"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Thought Content - Enhanced typography */}
                <div className="mb-4">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal selection:bg-blue-100 dark:selection:bg-blue-900/30">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* Enhanced Footer - More interactive and informative */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span>Thought</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                            {message.content.length} characters
                        </span>
                    </div>
                    
                    {/* Enhanced Thread indicator with click to open */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                        {threadCount > 0 ? (
                            <button
                                onClick={() => onOpenThread?.(message.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                <MessageCircle className="w-3 h-3" />
                                <span>{threadCount} replies</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => onOpenThread?.(message.id)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                <MessageCircle className="w-3 h-3" />
                                <span>Start discussion</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
