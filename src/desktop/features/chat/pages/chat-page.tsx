import { ChannelList } from "../components/channel-list";
import { MessageTimeline } from "../components/message-timeline";
import { MessageInput } from "../components/message-input";

export const ChatPage = () => {
    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {/* 主要内容区域 */}
            <div className="flex-1 flex min-h-0">
                {/* 左侧频道列表 - 极简设计 */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <ChannelList />
                </div>
                
                {/* 右侧记录区域 - 纯净的思考空间 */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                    <MessageTimeline />
                    <MessageInput />
                </div>
            </div>
        </div>
    );
}; 