import { useMobileNotesState } from '@/mobile/features/notes/hooks';
import { MobileNotesLayout } from '@/mobile/features/notes/components/mobile-notes-layout';
import { MobileSidebarManager } from '@/mobile/features/notes/features/message-timeline';
import { useUIStateStore } from '@/core/stores/ui-state.store';

export function MobileNotesPage() {
    // Use UI state store for sidebar management
    const { 
        isChannelListOpen,
        isAIAssistantOpen,
        isSettingsOpen,
        openChannelList,
        openAIAssistant,
        openSettings,
        closeChannelList,
        closeAIAssistant,
        closeSettings
    } = useUIStateStore();
    
    const notesState = useMobileNotesState();
    
    // Get current channel name for header
    const currentChannel = notesState.channels.find(channel => channel.id === notesState.currentChannelId);
    
    // Create wrapper functions for mobile layout
    const handleOpenAIAssistant = () => {
        if (notesState.currentChannelId) {
            openAIAssistant(notesState.currentChannelId);
        }
    };
    
    return (
        <div className="h-full flex flex-col">
            {/* Main Chat Layout */}
            <MobileNotesLayout
                currentChannelName={currentChannel?.name}
                replyToMessageId={notesState.replyToMessageId}
                isAddingMessage={notesState.isAddingMessage}
                onOpenChannelList={openChannelList}
                onOpenAIAssistant={handleOpenAIAssistant}
                onOpenSettings={openSettings}
                onOpenThread={notesState.handleOpenThread}
                onSendMessage={notesState.handleSendMessage}
                onCancelReply={notesState.handleCancelReply}
                setReplyToMessageId={notesState.setReplyToMessageId}
            />
            
            {/* Sidebar Manager */}
            <MobileSidebarManager
                isChannelListOpen={isChannelListOpen}
                isAIAssistantOpen={isAIAssistantOpen}
                isSettingsOpen={isSettingsOpen}
                closeChannelList={closeChannelList}
                closeAIAssistant={closeAIAssistant}
                closeSettings={closeSettings}
                isThreadOpen={notesState.isThreadOpen}
                onSendThreadMessage={notesState.handleSendThreadMessage}
                onCloseThread={notesState.handleCloseThread}
                currentChannelId={notesState.currentChannelId}
            />
        </div>
    );
}
