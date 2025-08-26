import { Message } from "@/core/stores/chat-data.store";
import { TimelineLayout } from "./timeline-layout";
import { TimelineContent } from "./timeline-content";
import { TimelineActions } from "./timeline-actions";
import { ExpandedEditorOverlay } from "./expanded-editor-overlay";
import { ThoughtRecord } from "./thought-record";
import { useTimelineState } from "../hooks/use-timeline-state";

interface MessageTimelineFeatureProps {
    messages: Message[];
    currentChannelId: string;
    onOpenThread: (messageId: string) => void;
    onOpenAIAssistant: (channelId?: string) => void;
    className?: string;
}

export const MessageTimelineFeature = ({
    messages,
    currentChannelId,
    onOpenThread,
    onOpenAIAssistant,
    className = ""
}: MessageTimelineFeatureProps) => {
    // Use unified timeline state management
    const {
        editState,
        scrollState,
        chatActions,
        editActions,
        isExpandedEditing
    } = useTimelineState(currentChannelId, messages.length);

    // Render thought record function
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord 
            message={message} 
            onOpenThread={onOpenThread}
            threadCount={threadCount}
        />
    );

    // Create wrapper function for onSend to match MessageInput interface
    const handleSendMessage = () => {
        chatActions.handleSend();
    };

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Timeline layout with content and actions */}
            <TimelineLayout
                content={
                    <TimelineContent
                        containerRef={scrollState.containerRef}
                        renderThoughtRecord={renderThoughtRecord}
                        isSticky={scrollState.isSticky}
                        onScrollToBottom={scrollState.handleScrollToBottom}
                    />
                }
                actions={
                    <TimelineActions
                        onSend={handleSendMessage}
                        replyToMessageId={chatActions.replyToMessageId ?? undefined}
                        onCancelReply={chatActions.handleCancelReply}
                        onOpenAIAssistant={onOpenAIAssistant}
                    />
                }
            />

            {/* Expanded editor overlay */}
            <ExpandedEditorOverlay
                isVisible={isExpandedEditing}
                editContent={editState.editContent}
                originalContent={editState.originalContent}
                isSaving={editState.isSaving}
                onSave={editActions.handleSave}
                onCancel={editActions.handleCancel}
                onCollapse={editActions.handleCollapse}
            />
        </div>
    );
};
