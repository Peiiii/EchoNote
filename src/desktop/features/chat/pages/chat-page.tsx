import { ChannelList } from "../components/channel-list";
import { MessageList } from "../components/message-list";
import { MessageInput } from "../components/message-input";
import { useCurrentChannel } from "@/core/stores/chat-store";

export const ChatPage = () => {
    const currentChannel = useCurrentChannel();
    
    return (
        <div className="flex-1 flex flex-col bg-background">
            {/* 顶部频道信息 */}
            <div className="border-b px-4 py-3 bg-card">
                <h2 className="text-lg font-semibold">
                    {currentChannel?.name || "选择频道"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {currentChannel?.description || "开始你的对话"}
                </p>
            </div>
            
            {/* 主要内容区域 */}
            <div className="flex-1 flex">
                {/* 左侧频道列表 */}
                <div className="w-64 border-r bg-card">
                    <ChannelList />
                </div>
                
                {/* 右侧消息区域 */}
                <div className="flex-1 flex flex-col">
                    <MessageList />
                    <MessageInput />
                </div>
            </div>
        </div>
    );
}; 