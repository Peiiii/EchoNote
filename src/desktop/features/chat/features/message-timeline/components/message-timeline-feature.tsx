import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { Message } from "@/core/stores/chat-data.store";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { MessageTimelineContainer } from "@/desktop/features/chat/components/ui/message-timeline-container";
import { MessageInput } from "./message-input";
import { ScrollToBottomButton } from "./scroll-to-bottom-button";
import { ExpandedEditor } from "./thought-record/expanded-editor";
import { TimelineContainer } from "./timeline-container";

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
    const {
        editingMessageId,
        editContent,
        originalContent,
        editMode,
        isSaving,
        save,
        cancel,
        switchToInlineMode
    } = useEditStateStore();

    // Use specialized hooks
    const { containerRef, isSticky, handleScrollToBottom } = useChatScroll([currentChannelId, messages.length], { smoothScroll: true });
    const { replyToMessageId, handleSend, handleCancelReply } = useChatActions(containerRef);

    const isExpandedEditing = editingMessageId && editMode === 'expanded';

    const handleSave = async () => {
        await save();
    };

    const handleCancel = () => {
        cancel();
    };

    const handleCollapse = () => {
        switchToInlineMode();
    };

    return (
        <div className={`relative w-full h-full ${className}`}>
            {/* Timeline container with normal content */}
            <TimelineContainer
                timeline={
                    <MessageTimelineContainer
                        containerRef={containerRef}
                        onOpenThread={onOpenThread}
                        messages={messages}
                    />
                }
                input={
                    <MessageInput
                        onSend={handleSend}
                        replyToMessageId={replyToMessageId || undefined}
                        onCancelReply={handleCancelReply}
                        onOpenAIAssistant={onOpenAIAssistant}
                    />
                }
                scrollButton={
                    !isSticky && (
                        <ScrollToBottomButton
                            onClick={handleScrollToBottom}
                            isVisible={!isSticky}
                        />
                    )
                }
            />

            {/* Expanded editor overlay with smooth animations */}
            {isExpandedEditing && (
                <div className="absolute inset-0 z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-lg m-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out">
                    <ExpandedEditor
                        content={editContent}
                        originalContent={originalContent}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onCollapse={handleCollapse}
                        isSaving={isSaving}
                    />
                </div>
            )}
        </div>
    );
};
