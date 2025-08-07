import { useChatAutoScroll } from "@/common/hooks/use-chat-auto-scroll";
import { useChatStore } from "@/core/stores/chat-store";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { ChannelList } from "../components/channel-list";
import { MessageInput } from "../components/message-input";
import { MessageTimeline } from "../components/message-timeline";

export const ChatPage = () => {
    const { currentChannelId, messages } = useChatStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollToBottom, isSticky, setSticky } = useChatAutoScroll(containerRef, {
        threshold: 30, // When 150px from bottom, enter sticky mode
        deps: [currentChannelId, messages.length] // Dependencies for auto scroll
    });
    const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null);

    const handleSend = () => {
        // After sending, clear the reply state
        setReplyToMessageId(null);
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const handleCancelReply = () => {
        setReplyToMessageId(null);
    };

    const handleScrollToBottom = () => {
        setSticky(true);
        scrollToBottom();
    };

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
                    <div className="flex-1 relative min-h-0">
                        <div ref={containerRef} className="absolute inset-0 overflow-y-auto">
                            <MessageTimeline />
                        </div>
                        
                        {/* Scroll to bottom button - overlays on list but doesn't scroll */}
                        {!isSticky && (
                            <div className="absolute bottom-4 right-4 z-10">
                                <button
                                    onClick={handleScrollToBottom}
                                    className="w-8 h-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 group"
                                    title="Scroll to bottom"
                                >
                                    <ChevronDown className="w-4 h-4 mx-auto group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <MessageInput 
                        onSend={handleSend}
                        replyToMessageId={replyToMessageId || undefined}
                        onCancelReply={handleCancelReply}
                    />
                </div>
            </div>
        </div>
    );
}; 