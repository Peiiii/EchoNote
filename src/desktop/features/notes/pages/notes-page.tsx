
import { ChannelList } from "@/desktop/features/notes/features/channel-management/components/channel-list";
import { NotesLayout } from "@/desktop/features/notes/components/notes-layout";
import { AIAssistantSidebar } from "@/desktop/features/notes/features/ai-assistant/components/ai-assistant-sidebar";
import { ThreadSidebar } from "@/desktop/features/notes/features/thread-management/components/thread-sidebar";
import { MessageTimelineFeature } from "@/desktop/features/notes/features/message-timeline";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { READ_MORE_SELECTORS } from "@/common/features/read-more/core/dom-constants";
import { filter, map, merge, take, timer, delay as rxDelay } from 'rxjs';
import { useNotesViewStore as notesViewStore } from "@/core/stores/notes-view.store";
import { useEffect } from "react";

export function NotesPage() {
    // Use UI state store
    const { 
        isAIAssistantOpen, 
        isThreadOpen, 
        currentThreadId,
        openAIAssistant, 
        closeAIAssistant,
        openThread,
        closeThread,
        openSettings
    } = useUIStateStore();
    const { currentChannelId } = useNotesViewStore();

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

    // Handle cross-channel jump to a specific message (emitted by search modal)
    useEffect(() =>
        rxEventBusService.requestJumpToMessage$.listen(({ channelId, messageId }) => {
            const { currentChannelId } = notesViewStore.getState();
            if (currentChannelId !== channelId) {
                notesViewStore.getState().setCurrentChannel(channelId);
            }

            const selector = READ_MORE_SELECTORS.messageById(messageId);
            // Start polling slightly delayed to let React mount the list after channel switch
            const poll$ = timer(120, 120).pipe(
                map(() => document.querySelector(selector)),
                filter((el): el is Element => Boolean(el)),
                take(1),
                rxDelay(60) // small delay for layout to stabilize
            );
            const timeout$ = timer(6000).pipe(map(() => null as Element | null));

            const sub = merge(poll$, timeout$).pipe(take(1)).subscribe((el) => {
                if (el) {
                    (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.warn('[JumpToMessage] timeout: element not found', { channelId, messageId });
                }
            });

            return () => sub.unsubscribe();
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
                            channelId={currentChannelId || ''}
                        />
                    )
                )
            }
        />
    );
};
