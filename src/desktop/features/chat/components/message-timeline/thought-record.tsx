import { format } from "date-fns";
import { MoreHorizontal, Clock } from "lucide-react";
import { Message } from "@/core/stores/chat-store";

interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
}

export const ThoughtRecord = ({ message, onReply }: ThoughtRecordProps) => {
    return (
        <div className="w-full">
            {/* Thought Record Container - Full width with internal padding */}
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300">
                
                {/* Record Header - Subtle and elegant */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{format(message.timestamp, 'HH:mm')}</span>
                        </div>
                    </div>
                    
                    {/* Action Menu - Hidden by default, shown on hover */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={onReply}
                            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
                            title="Add thought"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Main Thought Content - Clean and readable */}
                <div className="mb-4">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-base leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words font-normal">
                            {message.content}
                        </p>
                    </div>
                </div>

                {/* Subtle Footer - Minimal metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                            <span>Thought</span>
                        </span>
                    </div>
                    
                    {/* Thread indicator - if there are AI replies */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-xs">View thread</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
