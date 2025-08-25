import { Message } from "@/core/stores/chat-data.store";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Clock } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useState } from "react";
import { MobileMarkdownContent } from "./mobile-markdown-content";
import { MobileReadMoreWrapper } from "./mobile-read-more-wrapper";
import { MobileActionButtons } from "./mobile-action-buttons";
import { MobileThoughtRecordSparks } from "./mobile-thought-record-sparks";
import { MobileThreadIndicator } from "./mobile-thread-indicator";
import { MobileInlineEditor } from "./mobile-inline-editor";

interface MobileThoughtRecordProps {
    message: Message;
    onOpenThread: (messageId: string) => void;
    onReply?: () => void;
    threadCount?: number;
}

export const MobileThoughtRecord = ({ 
    message, 
    onOpenThread, 
    onReply,
    threadCount = 0 
}: MobileThoughtRecordProps) => {
    const { deleteMessage } = useChatDataStore();
    const [showAnalysis, setShowAnalysis] = useState(false);

    // Edit state management
    const {
        editingMessageId,
        editContent,
        editMode,
        isSaving,
        startEditing: startEdit,
        save,
        cancel,
        switchToExpandedMode
    } = useEditStateStore();
    
    const isEditing = editingMessageId === message.id;

    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    // If message is deleted, don't show it
    if (message.isDeleted) {
        return null;
    }

    const handleEdit = () => {
        startEdit(message.id, message.content);
    };

    const handleDelete = async () => {
        const messagePreview = message.content.length > 100 
            ? `${message.content.substring(0, 100)}...` 
            : message.content;
            
        const confirmed = window.confirm(
            `🗑️ Delete Thought\n\n` +
            `"${messagePreview}"\n\n` +
            `⚠️ This action cannot be undone.\n` +
            `The thought will be moved to trash.\n\n` +
            `Are you sure you want to continue?`
        );
        
        if (confirmed) {
            try {
                await deleteMessage(message.id, false); // Soft delete
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                alert(`❌ Failed to delete the message.\n\nError: ${errorMessage}\n\nPlease try again.`);
            }
        }
    };

    const handleToggleAnalysis = () => {
        setShowAnalysis(!showAnalysis);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
    };

    const handleOpenThread = () => {
        onOpenThread(message.id);
    };

    // Edit handlers
    const handleSave = async () => {
        await save();
    };

    const handleCancel = () => {
        cancel();
    };

    const handleExpand = () => {
        switchToExpandedMode();
    };

    return (
        <div className="w-full">
            <div className="relative w-full px-4 py-4 bg-card border border-border rounded-lg hover:shadow-sm transition-all duration-300 ease-out">
                {/* Record Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeForSocial(message.timestamp)}</span>
                        </div>
                    </div>

                    <MobileActionButtons
                        onToggleAnalysis={handleToggleAnalysis}
                        onReply={onReply}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCopy={handleCopy}
                        message={message}
                        isEditing={isEditing}
                        hasSparks={hasSparks}
                    />
                </div>

                {/* Content Area - Show inline editor or read-only content */}
                {isEditing && editMode === 'inline' ? (
                    <MobileInlineEditor
                        content={editContent}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onExpand={handleExpand}
                        isSaving={isSaving}
                    />
                ) : (
                    <MobileReadMoreWrapper maxHeight={200}>
                        <MobileMarkdownContent content={message.content} />
                    </MobileReadMoreWrapper>
                )}

                {/* Sparks Section - Hide when editing */}
                {!isEditing && (
                    <MobileThoughtRecordSparks
                        message={message}
                        showAnalysis={showAnalysis}
                        onToggleAnalysis={handleToggleAnalysis}
                    />
                )}

                {/* Footer - Hide when editing */}
                {!isEditing && (
                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-3">
                            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                                {message.content.length} characters
                            </span>
                            {hasSparks && (
                                <>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200">
                                        {aiAnalysis!.insights.length} sparks
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Thread indicator */}
                        <MobileThreadIndicator
                            threadCount={threadCount}
                            onOpenThread={handleOpenThread}
                            messageId={message.id}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
