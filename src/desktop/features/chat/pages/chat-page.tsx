import { useChatStore } from "@/core/stores/chat-store";
import { useEffect, useRef } from "react";
import { ChannelList } from "../components/channel-list";
import { MessageInput } from "../components/message-input";
import { MessageTimeline } from "../components/message-timeline";
import { useScrollToBottom } from "../components/message-timeline/use-scroll-to-bottom";

export const ChatPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollToBottom } = useScrollToBottom(containerRef);
    const { currentChannelId } = useChatStore();

    useEffect(() => {
        scrollToBottom("instant");
    }, [currentChannelId, scrollToBottom]);

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
            {/* Main content area */}
            <div className="flex-1 flex min-h-0">
                {/* Left channel list - minimal design */}
                <div className="w-80 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <ChannelList />
                </div>

                {/* Right recording area - pure thinking space */}
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                    <div ref={containerRef} className="flex-1 overflow-y-auto">
                        <MessageTimeline />
                    </div>
                    <MessageInput onSend={() => scrollToBottom('smooth')} />
                </div>
            </div>
        </div>
    );
}; 