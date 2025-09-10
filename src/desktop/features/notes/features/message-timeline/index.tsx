import { MessageTimelineRef } from "@/common/features/chat/components/message-timeline/message-timeline";
import { Message } from "@/core/stores/notes-data.store";
import { ExpandedEditorOverlay } from "@/desktop/features/notes/features/message-timeline/components/expanded-editor-overlay";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { TimelineActions } from "@/desktop/features/notes/features/message-timeline/components/timeline-actions";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useTimelineState } from "@/desktop/features/notes/features/message-timeline/hooks/use-timeline-state";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useRef } from "react";

interface MessageTimelineFeatureProps {
    className?: string;
}

export const MessageTimelineFeature = ({
    className = ""
}: MessageTimelineFeatureProps) => {
    // Use unified timeline state management
    const {
        editState,
        chatActions,
        editActions,
        isExpandedEditing
    } = useTimelineState();

    // Get current channel for cover header
    const currentChannel = useCurrentChannel();

    const timelineContentRef = useRef<MessageTimelineRef>(null);

    // Render thought record function
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord
            message={message}
            onOpenThread={(messageId) => rxEventBusService.requestOpenThread$.emit({ messageId })}
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
                channel={currentChannel || undefined}
                onOpenSettings={() => rxEventBusService.requestOpenSettings$.emit({})}
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
