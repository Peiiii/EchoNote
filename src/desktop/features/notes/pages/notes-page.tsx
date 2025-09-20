
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useEffect } from "react";

export function NotesPage() {
    // Use UI state store
    const { 
        isAIAssistantOpen, 
        aiAssistantChannelId, 
        isThreadOpen, 
        currentThreadId,
        openAIAssistant, 
        closeAIAssistant,
        openThread,
        closeThread,
        openSettings
    } = useUIStateStore();

    const handleOpenSettings = () => {
        console.log('Open channel settings');
        openSettings();
    };

    const handleSendThreadMessage = (message: string) => {
        console.log('Send thread message:', message);
    };

    useEffect(() =>
        rxEventBusService.requestOpenAIAssistant$.listen(({ channelId }) => {
            openAIAssistant(channelId);
        }), [openAIAssistant]);

    useEffect(() =>
        rxEventBusService.requestOpenAIConversation$.listen(({ channelId }) => {
            openAIAssistant(channelId);
        }), [openAIAssistant]);

    useEffect(() =>
        rxEventBusService.requestOpenThread$.listen(({ messageId }) => {
            openThread(messageId);
        }), [openThread]);

    useEffect(() =>
        rxEventBusService.requestCloseThread$.listen(() => {
            closeThread();
        }), [closeThread]);

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
                            onClose={closeThread}
                            onSendMessage={handleSendThreadMessage}
                            currentThreadId={currentThreadId || undefined}
                        />
                    ) : (
                        <AIAssistantSidebar
                            isOpen={isAIAssistantOpen}
                            onClose={closeAIAssistant}
                            channelId={aiAssistantChannelId || ''}
                        />
                    )
                )
            }
        />
    );
};