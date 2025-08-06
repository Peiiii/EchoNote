import { ChannelList } from "../components/channel-list";
import { MessageTimeline } from "../components/message-timeline";
import { MessageInput } from "../components/message-input";
import { useCurrentChannel } from "@/core/stores/chat-store";
import { Calendar, Clock, Sparkles, Eye, Brain } from "lucide-react";

export const ChatPage = () => {
    const currentChannel = useCurrentChannel();
    
    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* 顶部频道信息 - 更有仪式感 */}
            <div className="border-b border-white/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-8 py-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {currentChannel?.name || "选择思想空间"}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-3 mt-1">
                            <Clock className="w-4 h-4" />
                            <span>{currentChannel?.description || "开始你的思想之旅"}</span>
                            <div className="flex items-center gap-2 ml-4">
                                <Brain className="w-4 h-4 text-blue-500" />
                                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                                    思想记录空间
                                </span>
                            </div>
                        </p>
                    </div>
                </div>
            </div>
            
            {/* 主要内容区域 */}
            <div className="flex-1 flex min-h-0">
                {/* 左侧频道列表 - 更精致的设计 */}
                <div className="w-80 border-r border-white/20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                    <ChannelList />
                </div>
                
                {/* 右侧记录区域 - 时间轴式布局 */}
                <div className="flex-1 flex flex-col">
                    <MessageTimeline />
                    <MessageInput />
                </div>
            </div>
        </div>
    );
}; 