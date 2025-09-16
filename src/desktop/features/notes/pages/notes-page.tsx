
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { useAIAssistant } from "@/desktop/features/notes/features/ai-assistant/hooks/use-ai-assistant";
import { useThreadSidebar } from "@/desktop/features/notes/features/thread-management/hooks/use-thread-sidebar";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useEffect } from "react";

export function NotesPage() {
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
        rxEventBusService.requestOpenAIConversation$.listen(({ channelId }) => {
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
        <NotesLayout
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