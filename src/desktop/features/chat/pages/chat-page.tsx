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
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 relative">
                    <div ref={containerRef} className="flex-1 overflow-y-auto">
                        <MessageTimeline />
                    </div>
                    
                    {/* Sticky state indicator */}
                    {!isSticky && (
                        <div className="absolute bottom-20 right-6">
                            <button
                                onClick={handleScrollToBottom}
                                className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                                title="Scroll to bottom"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                    
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