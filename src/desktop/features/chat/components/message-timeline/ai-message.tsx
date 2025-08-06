import { format } from "date-fns";
import { AIAvatar } from "./ai-avatar";

interface AIMessageProps {
    message: any;
    isFirstInGroup: boolean;
}

export const AIMessage = ({ message, isFirstInGroup }: AIMessageProps) => (
    <div className={`max-w-2xl ${isFirstInGroup ? 'mt-4' : 'mt-0.5'}`}>
        <div className="flex items-start gap-3">
            {/* AI头像 */}
            <div className="relative flex-shrink-0">
                {isFirstInGroup && <AIAvatar />}
            </div>
            
            {/* AI消息内容 */}
            <div className="flex-1 min-w-0">
                {/* AI标识 - 只在第一条显示 */}
                {isFirstInGroup && (
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            AI助手
                        </span>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-xs text-green-600 dark:text-green-400">在线</span>
                        </div>
                    </div>
                )}
                
                {/* 时间戳 */}
                <div className="text-xs text-slate-400 dark:text-slate-500 mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {format(message.timestamp, 'HH:mm')}
                </div>
                
                {/* 消息气泡 */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-2xl rounded-bl-md shadow-sm hover:shadow-md transition-all duration-200 max-w-full">
                    <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words">
                        {message.content}
                    </div>
                </div>
            </div>
        </div>
    </div>
); 