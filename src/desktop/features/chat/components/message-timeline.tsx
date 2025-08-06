import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { Avatar } from "@/common/components/ui/avatar";
import { Badge } from "@/common/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { MessageCircle, Lightbulb, Brain, Heart, Star, Clock, Calendar } from "lucide-react";
import { useState } from "react";

export const MessageTimeline = () => {
    const messages = useCurrentChannelMessages();
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <Lightbulb className="w-12 h-12 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                            开始记录你的思想
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">
                            每一个想法都值得被珍视，让时间见证你的成长
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
        <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date} className="relative">
                        {/* 日期分隔线 */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {format(new Date(date), 'MM月dd日', { locale: zhCN })}
                                </span>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                        </div>

                        {/* 当天的消息 */}
                        <div className="space-y-6">
                            {dayMessages.map((message, index) => (
                                <div
                                    key={message.id}
                                    className={`relative group transition-all duration-300 ${
                                        hoveredMessage === message.id ? 'scale-[1.02]' : ''
                                    }`}
                                    onMouseEnter={() => setHoveredMessage(message.id)}
                                    onMouseLeave={() => setHoveredMessage(null)}
                                >
                                    {/* 时间轴连接线 */}
                                    <div className="absolute left-6 top-8 w-px h-full bg-gradient-to-b from-blue-200 to-transparent dark:from-blue-800"></div>
                                    
                                    {/* 消息卡片 */}
                                    <div className={`relative ml-12 p-6 rounded-2xl shadow-lg transition-all duration-300 ${
                                        message.sender === "user"
                                            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-blue-500/25"
                                            : "bg-white dark:bg-slate-800 shadow-slate-200/50 dark:shadow-slate-700/50 border border-slate-200/50 dark:border-slate-700/50"
                                    }`}>
                                        
                                        {/* 时间轴圆点 */}
                                        <div className={`absolute -left-6 top-6 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                                            message.sender === "user" 
                                                ? "bg-gradient-to-br from-blue-400 to-purple-500" 
                                                : "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700"
                                        }`}></div>

                                        {/* 消息头部 */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <Avatar className="w-8 h-8">
                                                <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-medium ${
                                                    message.sender === "user"
                                                        ? "bg-white/20 text-white"
                                                        : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                                                }`}>
                                                    {message.sender === "user" ? "我" : "AI"}
                                                </div>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">
                                                        {message.sender === "user" ? "我的想法" : "AI助手"}
                                                    </span>
                                                    {message.sender === "user" && (
                                                        <Brain className="w-4 h-4 text-white/70" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs opacity-70">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {formatDistanceToNow(message.timestamp, {
                                                            addSuffix: true,
                                                            locale: zhCN,
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 消息内容 */}
                                        <div className="space-y-3">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {message.content}
                                            </p>
                                            
                                            {/* 标签 */}
                                            {message.tags && message.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {message.tags.map((tag) => (
                                                        <Badge 
                                                            key={tag} 
                                                            variant="secondary" 
                                                            className={`text-xs ${
                                                                message.sender === "user"
                                                                    ? "bg-white/20 text-white border-white/30"
                                                                    : ""
                                                            }`}
                                                        >
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* 悬停效果 */}
                                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                                            hoveredMessage === message.id
                                                ? "opacity-10"
                                                : "opacity-0"
                                        } ${
                                            message.sender === "user"
                                                ? "bg-white"
                                                : "bg-gradient-to-br from-blue-500/20 to-purple-600/20"
                                        }`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 