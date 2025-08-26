import { MessageTimelineRef } from "@/common/features/chat/components/message-timeline/message-timeline";
import { Message } from "@/core/stores/chat-data.store";
import { ExpandedEditorOverlay } from "@/desktop/features/chat/features/message-timeline/components/expanded-editor-overlay";
import { ThoughtRecord } from "@/desktop/features/chat/features/message-timeline/components/thought-record";
import { TimelineActions } from "@/desktop/features/chat/features/message-timeline/components/timeline-actions";
import { TimelineContent } from "@/desktop/features/chat/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/chat/features/message-timeline/components/timeline-layout";
import { useTimelineState } from "@/desktop/features/chat/features/message-timeline/hooks/use-timeline-state";
import { useRef } from "react";

interface MessageTimelineFeatureProps {
    onOpenThread: (messageId: string) => void;
    onOpenAIAssistant: (channelId?: string) => void;
    className?: string;
}

export const MessageTimelineFeature = ({
    onOpenThread,
    onOpenAIAssistant,
    className = ""
}: MessageTimelineFeatureProps) => {
    // Use unified timeline state management
    const {
        editState,
        chatActions,
        editActions,
        isExpandedEditing
    } = useTimelineState();

    const timelineContentRef = useRef<MessageTimelineRef>(null);

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
        timelineContentRef.current?.scrollToBottom({ behavior: 'instant' });
        chatActions.handleSend();
    };

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Timeline layout with content and actions */}
            <TimelineLayout
                content={
                    <TimelineContent
                        ref={timelineContentRef}
                        renderThoughtRecord={renderThoughtRecord}
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
