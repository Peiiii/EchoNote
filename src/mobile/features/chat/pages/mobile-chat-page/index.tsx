import { useMobileSidebars } from './hooks/use-mobile-sidebars';
import { useMobileChatState } from './hooks/use-mobile-chat-state';
import { MobileChatLayout } from './components/mobile-chat-layout';
import { MobileSidebarManager } from './components/mobile-sidebar-manager';

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
                messages={chatState.messages}
                containerRef={chatState.containerRef}
                isSticky={chatState.isSticky}
                replyToMessageId={chatState.replyToMessageId}
                isAddingMessage={chatState.isAddingMessage}
                onOpenChannelList={sidebarState.openChannelList}
                onOpenAIAssistant={sidebarState.openAIAssistant}
                onOpenSettings={sidebarState.openSettings}
                onOpenThread={chatState.handleOpenThread}
                onSendMessage={chatState.handleSendMessage}
                onCancelReply={chatState.handleCancelReply}
                onScrollToBottom={chatState.handleScrollToBottom}
                setReplyToMessageId={chatState.setReplyToMessageId}
            />
            
            {/* Sidebar Manager */}
            <MobileSidebarManager
                {...sidebarState}
                isThreadOpen={chatState.isThreadOpen}
                currentParentMessage={chatState.currentParentMessage}
                currentThreadMessages={chatState.currentThreadMessages}
                onSendThreadMessage={chatState.handleSendThreadMessage}
                onCloseThread={chatState.handleCloseThread}
            />
        </div>
    );
}
