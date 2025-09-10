import { useMobileSidebars } from '@/mobile/features/notes/features/message-timeline';
import { useMobileNotesState } from '@/mobile/features/notes/hooks';
import { MobileNotesLayout } from '@/mobile/features/notes/components/mobile-notes-layout';
import { MobileSidebarManager } from '@/mobile/features/notes/features/message-timeline';

export function MobileNotesPage() {
    // Use custom hooks for state management
    const sidebarState = useMobileSidebars();
    const notesState = useMobileNotesState();
    
    // Get current channel name for header
    const currentChannel = notesState.channels.find(channel => channel.id === notesState.currentChannelId);
    return (
        <div className="h-full flex flex-col">
            {/* Main Chat Layout */}
            <MobileNotesLayout
                currentChannelName={currentChannel?.name}
                replyToMessageId={notesState.replyToMessageId}
                isAddingMessage={notesState.isAddingMessage}
                onOpenChannelList={sidebarState.openChannelList}
                onOpenAIAssistant={sidebarState.openAIAssistant}
                onOpenSettings={sidebarState.openSettings}
                onOpenThread={notesState.handleOpenThread}
                onSendMessage={notesState.handleSendMessage}
                onCancelReply={notesState.handleCancelReply}
                setReplyToMessageId={notesState.setReplyToMessageId}
            />
            
            {/* Sidebar Manager */}
            <MobileSidebarManager
                {...sidebarState}
                isThreadOpen={notesState.isThreadOpen}
                onSendThreadMessage={notesState.handleSendThreadMessage}
                onCloseThread={notesState.handleCloseThread}
                currentChannelId={notesState.currentChannelId}
            />
        </div>
    );
}
