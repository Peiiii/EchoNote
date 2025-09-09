import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Message } from "@/core/stores/chat-data.store";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Bookmark, Clock, Edit2, Eye, Lightbulb, MessageCircle, Tag as TagIcon } from "lucide-react";
import React, { useState } from "react";

import { channelMessageService } from "@/core/services/channel-message.service";
import { useChatViewStore } from "@/core/stores/chat-view.store";
import { MoreActionsMenu } from "../more-actions-menu";
import { InlineEditor } from "./inline-editor";
import { ReadMoreWrapper } from "./read-more-wrapper";
import { ThoughtRecordSparks } from "./thought-record-sparks";
import { MarkdownContent } from "@/common/components/markdown";
import { TagEditorPopover } from "@/common/features/chat/components/tag-editor-popover";
import { useChatDataStore } from "@/core/stores/chat-data.store";


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
    active?: boolean;
}

function ActionButton({ icon: Icon, onClick, title, disabled, active }: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 transition-all duration-200 rounded-lg hover:scale-105 ${
                active 
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
            } ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
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

// Footer item component for reusable footer elements
interface FooterItemProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

function FooterItem({ children, onClick, className = "" }: FooterItemProps) {
    const baseClasses = "hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200";
    const clickableClasses = onClick ? "cursor-pointer" : "";
    
    if (onClick) {
        return (
            <button 
                onClick={onClick}
                className={`${baseClasses} ${clickableClasses} ${className}`}
            >
                {children}
            </button>
        );
    }
    
    return (
        <span className={`${baseClasses} ${className}`}>
            {children}
        </span>
    );
}

// Tag section component
interface TagSectionProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    maxTags?: number;
}

function TagSection({ tags, onTagsChange, maxTags = 10 }: TagSectionProps) {
    return (
        <div className="flex items-center gap-2">
            <TagEditorPopover
                tags={tags}
                onTagsChange={onTagsChange}
                maxTags={maxTags}
                trigger={
                    <button className="flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800">
                        <TagIcon className="h-3 w-3" />
                        {tags.length > 0 ? `${tags.length} tags` : 'Add tags'}
                    </button>
                }
            />
            
            {/* Inline tag display - only show first few tags */}
            {tags.length > 0 && (
                <div className="flex items-center gap-1">
                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="inline-flex items-center px-1.5 py-0.5 text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded"
                        >
                            #{tag}
                        </span>
                    ))}
                    {tags.length > 2 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{tags.length - 2}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

// Main footer component
interface MessageFooterProps {
    message: Message;
    editingTags: string[];
    onTagsChange: (tags: string[]) => void;
    hasSparks: boolean;
    aiAnalysis: { insights: { length: number } } | null;
    onToggleAnalysis: () => void;
    threadCount: number;
    onOpenThread?: (messageId: string) => void;
}

function MessageFooter({ 
    message, 
    editingTags, 
    onTagsChange, 
    hasSparks, 
    aiAnalysis, 
    onToggleAnalysis, 
    threadCount, 
    onOpenThread 
}: MessageFooterProps) {
    return (
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-8">
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                <FooterItem>
                    {message.content.length} characters
                </FooterItem>
                
                {hasSparks && (
                    <>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <FooterItem onClick={onToggleAnalysis}>
                            {aiAnalysis!.insights.length} sparks
                        </FooterItem>
                    </>
                )}
                
                <TagSection 
                    tags={editingTags}
                    onTagsChange={onTagsChange}
                    maxTags={10}
                />
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
    const { userId } = useChatDataStore();
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [editingTags, setEditingTags] = useState<string[]>(message.tags || []);
    
    // Update editingTags when message.tags changes
    React.useEffect(() => {
        setEditingTags(message.tags || []);
    }, [message.tags]);
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

    // Tag editing handlers
    const handleTagsChange = async (newTags: string[]) => {
        setEditingTags(newTags);
        
        if (!userId || !currentChannelId) return;
        
        try {
            await channelMessageService.updateMessage({
                messageId: message.id,
                channelId: currentChannelId,
                updates: { tags: newTags },
                userId
            });
        } catch (error) {
            console.error('Failed to update tags:', error);
            // Revert on error
            setEditingTags(message.tags || []);
        }
    };

    return (
        <div className="w-full" data-component="thought-record">
            <div className={`group relative w-full py-4 transition-all duration-300 ease-out ${
                isEditing 
                    ? 'bg-gray-100/60 dark:bg-gray-800/30' 
                    : 'hover:bg-gray-100/80 dark:hover:bg-gray-800/20'
            }`}>
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4 px-8">
                    <div className="flex items-center gap-3">
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
                        className="px-8"
                    />
                ) : (
                    <div className="px-8">
                        <ReadMoreWrapper maxHeight={300}>
                            <MarkdownContent content={message.content} />
                        </ReadMoreWrapper>
                        
                    </div>
                )}

                {/* Sparks Section - Hide when editing */}
                {!isEditing && (
                    <ThoughtRecordSparks
                        message={message}
                        showAnalysis={showAnalysis}
                        className="px-8 mx-8"
                        onClose={handleToggleAnalysis}
                    />
                )}

                {/* Footer - Hide when editing */}
                {!isEditing && (
                    <MessageFooter
                        message={message}
                        editingTags={editingTags}
                        onTagsChange={handleTagsChange}
                        hasSparks={hasSparks}
                        aiAnalysis={aiAnalysis || null}
                        onToggleAnalysis={handleToggleAnalysis}
                        threadCount={threadCount}
                        onOpenThread={onOpenThread}
                    />
                )}
            </div>
        </div>
    );
}
