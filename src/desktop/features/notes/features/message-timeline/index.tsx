import { MessageTimelineRef } from "@/common/features/notes/components/message-timeline/message-timeline";
import { Message } from "@/core/stores/notes-data.store";
import { ExpandedEditorOverlay } from "@/desktop/features/notes/features/message-timeline/components/expanded-editor-overlay";
import { ThoughtRecord } from "@/desktop/features/notes/features/message-timeline/components/thought-record";
import { MessageInput } from "@/desktop/features/notes/features/message-timeline/components/message-input";
import { TimelineContent } from "@/desktop/features/notes/features/message-timeline/components/timeline-content";
import { TimelineLayout } from "@/desktop/features/notes/features/message-timeline/components/timeline-layout";
import { useTimelineState } from "@/desktop/features/notes/features/message-timeline/hooks/use-timeline-state";
import { useCurrentChannel } from "@/desktop/features/notes/hooks/use-current-channel";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useInputCollapse } from "@/desktop/features/notes/features/message-timeline/hooks/use-input-collapse";
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
    
    // Get input collapsed state for conditional rendering
    const { inputCollapsed } = useInputCollapse();

    // Render thought record function
    const renderThoughtRecord = (message: Message, threadCount: number) => (
        <ThoughtRecord
            message={message}
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
                    !inputCollapsed ? (
                        <MessageInput
                            onSend={handleSendMessage}
                            replyToMessageId={chatActions.replyToMessageId ?? undefined}
                            onCancelReply={chatActions.handleCancelReply}
                        />
                    ) : null
                }
            />

            {/* Expanded editor overlay */}
            <ExpandedEditorOverlay
                isVisible={isExpandedEditing}
                editContent={editState.editContent}
                isSaving={editState.isSaving}
                onSave={editActions.handleSave}
                onCancel={editActions.handleCancel}
                onCollapse={editActions.handleCollapse}
            />
        </div>
    );
};
