import { useEffect, useState } from 'react';
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { MobileHeader } from "@/mobile/components/mobile-header";
import { MobileChannelList } from "@/mobile/features/chat/components/mobile-channel-list";
import { MobileMessageInput } from "@/mobile/features/chat/components/mobile-message-input";
import { MobileMessageTimelineContainer } from "@/mobile/features/chat/components/ui/mobile-message-timeline-container";
import { MobileScrollToBottomButton } from "@/mobile/features/chat/components/ui/mobile-scroll-to-bottom-button";
import { MobileAIAssistant } from "@/mobile/features/chat/components/mobile-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/chat/hooks/use-thread-sidebar";
import { usePaginatedMessages } from "@/desktop/features/chat/hooks/use-paginated-messages";
import { MobileThreadSidebar } from "@/mobile/features/chat/components/mobile-thread-sidebar";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { Button } from "@/common/components/ui/button";
import { Settings } from "lucide-react";
import { AuthStatus } from "@/common/components/firebase/auth-status";
import { ThemeToggle } from "@/common/components/theme";
import { useChatScroll } from "@/desktop/features/chat/hooks/use-chat-scroll";
import { useChatActions } from "@/desktop/features/chat/hooks/use-chat-actions";
import { useMessageSender } from "@/mobile/features/chat/hooks/use-message-sender";

export function MobileChatPage() {
    const { currentChannelId } = useChatViewStore();
    const { channels } = useChatDataStore();
    const { messages, hasMore, loadMore } = usePaginatedMessages(20);
    const [isChannelListOpen, setIsChannelListOpen] = useState(false);
    const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Get current channel name for header
    const currentChannel = channels.find(channel => channel.id === currentChannelId);

    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length]);
    const { replyToMessageId, handleCancelReply } = useChatActions(containerRef);
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { sendMessage, isAddingMessage } = useMessageSender(containerRef, handleScrollToBottom);
    
    // 滚动加载更多消息
    const handleScroll = () => {
        if (!containerRef.current) return;
        
        const { scrollTop } = containerRef.current;
        
        // 当滚动到顶部时加载更多消息
        if (scrollTop === 0 && hasMore) {
            loadMore();
        }
    };
    
    // 添加滚动事件监听器
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [hasMore, loadMore]);

    // 移动端特有的处理：关闭频道列表当选择频道后
    const handleChannelSelect = (channelId: string) => {
        useChatViewStore.getState().setCurrentChannel(channelId);
        setIsChannelListOpen(false);
    };

    // 移动端特有的处理：关闭侧边栏当打开线程后
    useEffect(() => {
        if (isThreadOpen) {
            setIsChannelListOpen(false);
        }
    }, [isThreadOpen]);

    // 使用公共的消息发送处理
    const handleSendMessage = async (content: string) => {
        await sendMessage(content, replyToMessageId || undefined);
        
        // 清除回复状态
        if (replyToMessageId) {
            handleCancelReply();
        }
        
        // 发送消息后强制滚动到底部
        setTimeout(() => {
            // 强制设置sticky状态并滚动到底部
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }, 100);
    };

    console.log("[MobileChatPage] ", {
        currentChannelName: currentChannel?.name,
        isChannelListOpen,
        isAIAssistantOpen,
        isAddingMessage
    });

    return (
        <div className="h-full flex flex-col">
            {/* Mobile Header */}
            <MobileHeader
                onOpenChannelList={() => setIsChannelListOpen(true)}
                onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                currentChannelName={currentChannel?.name}
            />
            
            {/* Main Chat Area - Fixed Layout */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Timeline Area - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <MobileMessageTimelineContainer
                        containerRef={containerRef}
                        onOpenThread={handleOpenThread}
                        messages={messages}
                    />
                    {/* Scroll to bottom button */}
                    {!isSticky && (
                        <MobileScrollToBottomButton onClick={handleScrollToBottom} />
                    )}
                </div>
                
                {/* Input Area - Fixed at bottom */}
                <div className="flex-shrink-0">
                    <MobileMessageInput
                        onSend={handleSendMessage}
                        replyToMessageId={replyToMessageId || undefined}
                        onCancelReply={handleCancelReply}
                        isSending={isAddingMessage}
                    />
                </div>
            </div>

            {/* Channel List Sidebar */}
            <MobileChannelList 
                isOpen={isChannelListOpen}
                onClose={() => setIsChannelListOpen(false)}
                onChannelSelect={handleChannelSelect}
            />

            {/* AI Assistant - Bottom Sheet */}
            <Sheet open={isAIAssistantOpen} onOpenChange={setIsAIAssistantOpen}>
                <SheetContent 
                    side="bottom" 
                    className="h-[80vh] p-0 border-t border-border"
                >
                    <MobileAIAssistant />
                </SheetContent>
            </Sheet>

            {/* Thread Sidebar */}
            {isThreadOpen && (
                <Sheet open={isThreadOpen} onOpenChange={handleCloseThread}>
                    <SheetContent 
                        side="right" 
                        className="w-full max-w-md p-0 border-l border-border"
                    >
                        <MobileThreadSidebar
                            parentMessage={currentParentMessage}
                            threadMessages={currentThreadMessages}
                            onSendMessage={handleSendThreadMessage}
                        />
                    </SheetContent>
                </Sheet>
            )}

            {/* Settings Sidebar */}
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <SheetContent 
                    side="right" 
                    className="w-full max-w-md p-0 border-l border-border"
                >
                    <div className="h-full flex flex-col bg-background">
                        {/* Header */}
                        <div className="flex items-center justify-start p-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-foreground">Settings</h3>
                            </div>
                        </div>

                        {/* Settings Content */}
                        <div className="flex-1 p-4 space-y-4">
                            {/* Account Section */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-foreground">Account</div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <AuthStatus />
                                </div>
                            </div>

                            {/* Appearance Section */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-foreground">Appearance</div>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <ThemeToggle />
                                </div>
                            </div>

                            {/* Data Section */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-foreground">Data</div>
                                <Button variant="outline" className="w-full justify-start">
                                    Export Data
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Import Data
                                </Button>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
