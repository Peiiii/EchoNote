import { format } from "date-fns";
import { Check } from "lucide-react";

interface UserMessageProps {
    message: any;
    isFirstInGroup: boolean;
}

export const UserMessage = ({ message, isFirstInGroup }: UserMessageProps) => (
    <div className={`max-w-2xl ${isFirstInGroup ? 'mt-4' : 'mt-0.5'}`}>
        <div className="flex items-end gap-2">
            <div className="flex-1"></div>
            <div className="flex flex-col items-end">
                {/* Timestamp */}
                <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {format(message.timestamp, 'HH:mm')}
                </div>
                
                {/* Message Bubble */}
                <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-br-md shadow-sm hover:shadow-md transition-all duration-200 max-w-full">
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                </div>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Check className="w-3 h-3 text-blue-400" />
                    <span className="text-xs text-slate-400 dark:text-slate-500">Sent</span>
                </div>
            </div>
        </div>
    </div>
); 