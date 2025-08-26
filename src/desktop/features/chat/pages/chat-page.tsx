
import { ChannelList } from "@/desktop/features/chat/features/channel-management/components/channel-list";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/chat/features/message-timeline";
import { useAIAssistant } from "@/desktop/features/chat/features/ai-assistant/hooks/use-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";

export function ChatPage() {
    // Use specialized hooks
    const { isThreadOpen, currentParentMessage, currentThreadMessages, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();
    
    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <MessageTimelineFeature
                    onOpenThread={handleOpenThread}
                    onOpenAIAssistant={handleOpenAIAssistant}
                />
            }
            rightSidebar={
                (isThreadOpen || isAIAssistantOpen) && (
                    isThreadOpen ? (
                        <ThreadSidebar
                            isOpen={isThreadOpen}
                            onClose={handleCloseThread}
                            parentMessage={currentParentMessage}
                            threadMessages={currentThreadMessages}
                            onSendMessage={handleSendThreadMessage}
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