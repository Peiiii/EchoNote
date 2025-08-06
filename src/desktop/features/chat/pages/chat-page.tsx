import { ChannelList } from "../components/channel-list";
import { MessageTimeline } from "../components/message-timeline";
import { MessageInput } from "../components/message-input";
import { useCurrentChannelMessages } from "@/core/stores/chat-store";
import { useEffect, useRef } from "react";

export const ChatPage = () => {
    const messages = useCurrentChannelMessages();
    const timelineRef = useRef<HTMLDivElement>(null);

    // 监听消息变化，自动滚动到底部
    useEffect(() => {
        if (timelineRef.current && messages.length > 0) {
            const scrollToBottom = () => {
                timelineRef.current?.scrollTo({
                    top: timelineRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            };
            
            // 使用setTimeout确保DOM更新完成后再滚动
            setTimeout(scrollToBottom, 100);
        }
    }, [messages.length]);

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
                    <div ref={timelineRef} className="flex-1 overflow-y-auto">
                        <MessageTimeline />
                    </div>
                    <MessageInput />
                </div>
            </div>
        </div>
    );
}; 