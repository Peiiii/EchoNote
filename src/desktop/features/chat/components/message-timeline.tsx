import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { Avatar } from "@/common/components/ui/avatar";
import { Badge } from "@/common/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { MessageCircle, Lightbulb, Brain, Heart, Star, Clock, Calendar, Eye, Sparkles, Quote } from "lucide-react";
import { useState } from "react";

export const MessageTimeline = () => {
    const messages = useCurrentChannelMessages();
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                        <Eye className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                            开始看见你自己
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            每一个想法都是你内心世界的映射。记录它们，回顾它们，让时间见证你的成长轨迹。
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
                            <div className="flex items-center gap-2">
                                <Brain className="w-4 h-4" />
                                <span>思考</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                <span>感受</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                <span>成长</span>
                            </div>
                        </div>
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
            <div className="max-w-5xl mx-auto space-y-12">
                {Object.entries(groupedMessages).map(([date, dayMessages]) => (
                    <div key={date} className="relative">
                        {/* 日期分隔线 - 更有仪式感 */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                <Calendar className="w-5 h-5 text-slate-500" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                                    {format(new Date(date), 'MM月dd日', { locale: zhCN })}
                                </span>
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                        </div>

                        {/* 当天的思想记录 */}
                        <div className="space-y-8">
                            {dayMessages.map((message, index) => {
                                const isUserMessage = message.sender === "user";
                                
                                return (
                                    <div
                                        key={message.id}
                                        className={`relative group transition-all duration-500 ${
                                            hoveredMessage === message.id ? 'scale-[1.02]' : ''
                                        }`}
                                        onMouseEnter={() => setHoveredMessage(message.id)}
                                        onMouseLeave={() => setHoveredMessage(null)}
                                    >
                                        {isUserMessage ? (
                                            // 用户思想 - 主要内容，大卡片
                                            <div className="relative">
                                                {/* 时间轴连接线 */}
                                                <div className="absolute left-8 top-12 w-px h-full bg-gradient-to-b from-blue-400 to-transparent dark:from-blue-600"></div>
                                                
                                                {/* 用户思想卡片 - 主角 */}
                                                <div className="relative ml-16 p-8 rounded-3xl shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white">
                                                    
                                                    {/* 时间轴圆点 - 用户思想节点 */}
                                                    <div className="absolute -left-8 top-8 w-6 h-6 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-400 to-purple-500"></div>

                                                    {/* 思想头部 */}
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <Avatar className="w-12 h-12">
                                                            <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                                                                <Eye className="w-6 h-6" />
                                                            </div>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-lg font-bold">我的思想</span>
                                                                <Brain className="w-5 h-5 text-white/80" />
                                                                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                                                                    思想记录
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-3 text-sm text-white/70">
                                                                <Clock className="w-4 h-4" />
                                                                <span>
                                                                    {formatDistanceToNow(message.timestamp, {
                                                                        addSuffix: true,
                                                                        locale: zhCN,
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* 思想内容 - 核心 */}
                                                    <div className="space-y-4">
                                                        <div className="text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                                            {message.content}
                                                        </div>
                                                        
                                                        {/* 思想标签 */}
                                                        {message.tags && message.tags.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {message.tags.map((tag) => (
                                                                    <Badge 
                                                                        key={tag} 
                                                                        variant="secondary" 
                                                                        className="bg-white/20 text-white border-white/30 text-sm"
                                                                    >
                                                                        #{tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 悬停效果 */}
                                                    <div className={`absolute inset-0 rounded-3xl transition-opacity duration-300 ${
                                                        hoveredMessage === message.id
                                                            ? "opacity-10"
                                                            : "opacity-0"
                                                    } bg-white`}></div>
                                                </div>
                                            </div>
                                        ) : (
                                            // AI洞察 - 次要内容，小卡片，像批注
                                            <div className="relative ml-32 mb-4">
                                                <div className="relative p-6 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                                                    
                                                    {/* AI洞察头部 */}
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <Avatar className="w-8 h-8">
                                                            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-medium">
                                                                <Sparkles className="w-4 h-4" />
                                                            </div>
                                                        </Avatar>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI洞察</span>
                                                            <Quote className="w-4 h-4 text-slate-400" />
                                                        </div>
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