
import { ChannelList } from "@/desktop/features/chat/features/channel-management/components/channel-list";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/chat/features/message-timeline";
import { useAIAssistant } from "@/desktop/features/chat/features/ai-assistant/hooks/use-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";

export function ChatPage() {
    // Use specialized hooks
    const { isThreadOpen, currentThreadId, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
    
    const handleOpenSettings = () => {
        console.log('Open channel settings');
    };
    
    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <MessageTimelineFeature
                    onOpenThread={handleOpenThread}
                    onOpenAIAssistant={handleOpenAIAssistant}
                    onOpenSettings={handleOpenSettings}
                />
            }
            rightSidebar={
                (isThreadOpen || isAIAssistantOpen) && (
                    isThreadOpen ? (
                        <ThreadSidebar
                            isOpen={isThreadOpen}
                            onClose={handleCloseThread}
                            onSendMessage={handleSendThreadMessage}
                            currentThreadId={currentThreadId}
                        />
                    ) : (
                        <AIAssistantSidebar
                            isOpen={isAIAssistantOpen}
                            onClose={handleCloseAIAssistant}
                            channelId={currentAIAssistantChannel || ''}
                        />
                    )
                )
            }
        />
    );
};