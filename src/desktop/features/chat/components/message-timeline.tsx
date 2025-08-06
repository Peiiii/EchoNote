import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { Badge } from "@/common/components/ui/badge";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Eye, Sparkles } from "lucide-react";

export const MessageTimeline = () => {
    const messages = useCurrentChannelMessages();

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300">
                            开始记录你的思想
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                            在这里，每一个想法都值得被珍视。
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // 按日期分组消息
    const groupedMessages = messages.reduce((groups, message) => {
        const date = format(message.timestamp, 'yyyy-MM-dd');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {} as Record<string, typeof messages>);

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-12">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date} className="relative">
                        {/* 日期分隔线 - 极简 */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-sm text-slate-500 dark:text-slate-400 px-3">
                                {format(new Date(date), 'MM月dd日', { locale: zhCN })}
                            </span>
                            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                        </div>

                        {/* 当天的思想记录 */}
                        <div className="space-y-6">
                            {dayMessages.map((message) => {
                                const isUserMessage = message.sender === "user";
                                
                                return (
                                    <div key={message.id}>
                                        {isUserMessage ? (
                                            // 用户思想 - 纯净设计，无装饰
                                            <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                                                {/* 思想内容 - 核心，无头部装饰 */}
                                                <div className="space-y-3">
                                                    <div className="text-base leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                                                        {message.content}
                                                    </div>
                                                    
                                                    {/* 思想标签 - 可选 */}
                                                    {message.tags && message.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {message.tags.map((tag) => (
                                                                <Badge 
                                                                    key={tag} 
                                                                    variant="outline" 
                                                                    className="text-xs"
                                                                >
                                                                    #{tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            // AI洞察 - 只在有价值时显示，极简设计
                                            <div className="ml-8 mb-4">
                                                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                                    {/* AI洞察头部 */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                                            <Sparkles className="w-3 h-3 text-slate-500" />
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">AI洞察</span>
                                                    </div>

                                                    {/* AI洞察内容 */}
                                                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {message.content}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 