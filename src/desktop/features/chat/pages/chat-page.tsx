
import { ChannelList } from "@/desktop/features/chat/features/channel-management/components/channel-list";
import { ChatLayout } from "@/desktop/features/chat/components/chat-layout";
import { AIAssistantSidebar } from "@/desktop/features/chat/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/chat/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/chat/features/message-timeline";
import { useAIAssistant } from "@/desktop/features/chat/features/ai-assistant/hooks/use-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/chat/features/thread-management/hooks/use-thread-sidebar";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useEffect } from "react";

export function ChatPage() {
    // Use specialized hooks
    const { isThreadOpen, currentThreadId, handleOpenThread, handleCloseThread, handleSendThreadMessage } = useThreadSidebar();
    const { isAIAssistantOpen, currentAIAssistantChannel, handleOpenAIAssistant, handleCloseAIAssistant } = useAIAssistant();

    const handleOpenSettings = () => {
        console.log('Open channel settings');
    };

    useEffect(() =>
        rxEventBusService.requestOpenAIAssistant$.listen(({ channelId }) => {
            handleOpenAIAssistant(channelId);
        }), [handleOpenAIAssistant]);

    useEffect(() =>
        rxEventBusService.requestOpenThread$.listen(({ messageId }) => {
            handleOpenThread(messageId);
        }), [handleOpenThread]);

    useEffect(() =>
        rxEventBusService.requestCloseThread$.listen(() => {
            handleCloseThread();
        }), [handleCloseThread]);

    useEffect(() =>
        rxEventBusService.requestOpenSettings$.listen(() => {
            handleOpenSettings();
        }), []);

    return (
        <ChatLayout
            sidebar={<ChannelList />}
            content={
                <MessageTimelineFeature />
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