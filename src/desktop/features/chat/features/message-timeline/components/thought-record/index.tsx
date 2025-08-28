import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Message } from "@/core/stores/chat-data.store";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Bookmark, Clock, Edit2, Eye, Lightbulb, MessageCircle } from "lucide-react";
import { useState } from "react";

import { channelMessageService } from "@/core/services/channel-message.service";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { MoreActionsMenu } from "../more-actions-menu";
import { InlineEditor } from "./inline-editor";
import { MarkdownContent } from "./markdown-content";
import { ReadMoreWrapper } from "./read-more-wrapper";
import { ThoughtRecordSparks } from "./thought-record-sparks";


interface ThoughtRecordProps {
    message: Message;
    isFirstInGroup: boolean;
    onReply?: () => void;
    onOpenThread?: (messageId: string) => void;
    threadCount?: number;
}

// Reusable action button component
interface ActionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    onClick?: () => void;
    title: string;
    disabled?: boolean;
}

function ActionButton({ icon: Icon, onClick, title, disabled }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 hover:scale-105"
            title={title}
        >
            <Icon className="w-4 h-4" />
        </button>
    );
}

// Thread indicator component
interface ThreadIndicatorProps {
    threadCount: number;
    onOpenThread?: (messageId: string) => void;
    messageId: string;
}

function ThreadIndicator({ threadCount, onOpenThread, messageId }: ThreadIndicatorProps) {
    const displayText = threadCount > 0 ? `${threadCount} replies` : 'Start discussion';

    return (
        <button
            onClick={() => onOpenThread?.(messageId)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-lg transition-all duration-200 cursor-pointer"
        >
            <MessageCircle className="w-3 h-3" />
            <span>{displayText}</span>
        </button>
    );
}

// Action buttons group
interface ActionButtonsProps {
    onToggleAnalysis: () => void;
    onReply?: () => void;
    onEdit: () => void;
    message: Message;
    onDelete: () => void;
    isEditing: boolean;
}

function ActionButtons({ onToggleAnalysis, onReply, onEdit, message, onDelete, isEditing }: ActionButtonsProps) {
    const actionButtons = [
        { icon: Edit2, onClick: onEdit, title: "Edit thought", disabled: isEditing },
        { icon: Lightbulb, onClick: onToggleAnalysis, title: "Toggle sparks", disabled: isEditing },
        { icon: Eye, onClick: undefined, title: "View details", disabled: isEditing },
        { icon: Bookmark, onClick: undefined, title: "Bookmark", disabled: isEditing },
        { icon: MessageCircle, onClick: onReply, title: "Reply to thought", disabled: isEditing },
    ];

    return (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {actionButtons.map(({ icon, onClick, title, disabled }) => (
                <ActionButton
                    key={title}
                    icon={icon}
                    onClick={onClick}
                    title={title}
                    disabled={disabled}
                />
            ))}
            <MoreActionsMenu
                message={message}
                onDelete={onDelete}
                onCopy={() => navigator.clipboard.writeText(message.content)}
            />
        </div>
    );
}

export function ThoughtRecord({
    message,
    onReply,
    onOpenThread,
    threadCount = 0
}: Omit<ThoughtRecordProps, 'isFirstInGroup'>) {
    const { currentChannelId } = useChatViewStore();
    const [showAnalysis, setShowAnalysis] = useState(false);
    const deleteMessage = channelMessageService.deleteMessage;

    // Edit state management
    const {
        editingMessageId,
        editContent,
        editMode,
        isSaving,
        startEditing,
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

    // Delete method (use native confirm)
    const handleDelete = async () => {
        // Use setTimeout to ensure React has time to re-render before showing confirm
        setTimeout(async () => {
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
                    await deleteMessage({ messageId: message.id, hardDelete: false, channelId: currentChannelId! }); // Soft delete
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    alert(`❌ Failed to delete the message.\n\nError: ${errorMessage}\n\nPlease try again.`);
                }
            }
        }, 0);
    };

    const handleToggleAnalysis = () => {
        setShowAnalysis(!showAnalysis);
    };

    // Edit handlers
    const handleEdit = () => {
        startEditing(message.id, message.content);
    };

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
            <div className="group relative w-full px-8 py-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-300 ease-out hover:shadow-sm">
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 shadow-sm"></div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeForSocial(message.timestamp)}</span>
                        </div>
                    </div>

                    <ActionButtons
                        onToggleAnalysis={handleToggleAnalysis}
                        onReply={onReply}
                        onEdit={handleEdit}
                        message={message}
                        onDelete={handleDelete}
                        isEditing={isEditing}
                    />
                </div>

                {/* Content Area - Show inline editor or read-only content */}
                {isEditing && editMode === 'inline' ? (
                    <InlineEditor
                        content={editContent}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onExpand={handleExpand}
                        isSaving={isSaving}
                    />
                ) : (
                    <ReadMoreWrapper maxHeight={300} >
                        <MarkdownContent content={message.content} />
                    </ReadMoreWrapper>
                )}

                {/* Sparks Section - Hide when editing */}
                {!isEditing && (
                    <ThoughtRecordSparks
                        message={message}
                        showAnalysis={showAnalysis}
                        onToggleAnalysis={handleToggleAnalysis}
                    />
                )}

                {/* Footer - Hide when editing */}
                {!isEditing && (
                    <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                                {message.content.length} characters
                            </span>
                            {hasSparks && (
                                <>
                                    <span className="text-slate-300 dark:text-slate-600">•</span>
                                    <span className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer">
                                        {aiAnalysis!.insights.length} sparks
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Thread indicator */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                            <ThreadIndicator
                                threadCount={threadCount}
                                onOpenThread={onOpenThread}
                                messageId={message.id}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export { MarkdownContent } from "./markdown-content";
export { ReadMoreWrapper } from "./read-more-wrapper";

