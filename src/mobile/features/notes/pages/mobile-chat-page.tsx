import { useMobileSidebars } from '@/mobile/features/notes/features/message-timeline';
import { useMobileChatState } from '@/mobile/features/notes/hooks';
import { MobileChatLayout } from '@/mobile/features/notes/components/mobile-chat-layout';
import { MobileSidebarManager } from '@/mobile/features/notes/features/message-timeline';

export function MobileChatPage() {
    // Use custom hooks for state management
    const sidebarState = useMobileSidebars();
    const chatState = useMobileChatState();
    
    // Get current channel name for header
    const currentChannel = chatState.channels.find(channel => channel.id === chatState.currentChannelId);
    return (
        <div className="h-full flex flex-col">
            {/* Main Chat Layout */}
            <MobileChatLayout
                currentChannelName={currentChannel?.name}
                replyToMessageId={chatState.replyToMessageId}
                isAddingMessage={chatState.isAddingMessage}
                onOpenChannelList={sidebarState.openChannelList}
                onOpenAIAssistant={sidebarState.openAIAssistant}
                onOpenSettings={sidebarState.openSettings}
                onOpenThread={chatState.handleOpenThread}
                onSendMessage={chatState.handleSendMessage}
                onCancelReply={chatState.handleCancelReply}
                setReplyToMessageId={chatState.setReplyToMessageId}
            />
            
            {/* Sidebar Manager */}
            <MobileSidebarManager
                {...sidebarState}
                isThreadOpen={chatState.isThreadOpen}
                onSendThreadMessage={chatState.handleSendThreadMessage}
                onCloseThread={chatState.handleCloseThread}
                currentChannelId={chatState.currentChannelId}
            />
        </div>
    );
}
