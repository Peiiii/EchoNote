import { ChannelList } from "../components/channel-list";
import { MessageTimeline } from "../components/message-timeline";
import { MessageInput } from "../components/message-input";
import { useCurrentChannel } from "@/core/stores/chat-store";
import { Calendar, Clock, Sparkles } from "lucide-react";

export const ChatPage = () => {
    const currentChannel = useCurrentChannel();
    
    return (
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* 顶部频道信息 - 更有仪式感 */}
            <div className="border-b border-white/20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {currentChannel?.name || "选择频道"}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {currentChannel?.description || "开始你的思想之旅"}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* 主要内容区域 */}
            <div className="flex-1 flex min-h-0">
                {/* 左侧频道列表 - 更精致的设计 */}
                <div className="w-72 border-r border-white/20 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
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