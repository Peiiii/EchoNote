import { Button } from "@/common/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/common/components/ui/popover";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { channelMessageService } from "@/core/services/channel-message.service";
import { Message } from "@/core/stores/chat-data.store";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { Bookmark, Copy, Edit2, Eye, Lightbulb, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { MobileInlineEditor } from "./mobile-inline-editor";
import { MobileMarkdownContent } from "./mobile-markdown-content";
import { MobileReadMoreWrapper } from "./mobile-read-more-wrapper";
import { MobileThoughtRecordSparks } from "./mobile-thought-record-sparks";
import { MobileThreadIndicator } from "./mobile-thread-indicator";

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
    const { deleteMessage } = channelMessageService;
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [localEditContent, setLocalEditContent] = useState("");

    // Edit state management
    const {
        editingMessageId,
        editContent,
        editMode,
        isSaving,
        startEditing: startEdit,
        save,
        cancel,
        switchToExpandedMode,
        switchToInlineMode
    } = useEditStateStore();

    const isEditing = editingMessageId === message.id;
    const isExpandedEditing = isEditing && editMode === 'expanded';

    // Sync local content with store content
    useEffect(() => {
        if (editContent) {
            setLocalEditContent(editContent);
        }
    }, [editContent]);

    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    // If message is deleted, don't show it
    if (message.isDeleted) {
        return null;
    }

    const handleEdit = () => {
        startEdit(message.id, message.content);
        setPopoverOpen(false);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setLocalEditContent(newContent);
        // Note: updateContent is handled by the inline editor
    };

    const handleDelete = async () => {
        // Close popover immediately when delete button is clicked
        setPopoverOpen(false);
        
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
                    await deleteMessage({
                        messageId: message.id,
                        channelId: message.channelId,
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    alert(`❌ Failed to delete the message.\n\nError: ${errorMessage}\n\nPlease try again.`);
                }
            }
        }, 0);
    };

    const handleToggleAnalysis = () => {
        setShowAnalysis(!showAnalysis);
        setPopoverOpen(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setPopoverOpen(false);
    };

    const handleOpenThread = () => {
        onOpenThread(message.id);
        setPopoverOpen(false);
    };

    const handleReply = () => {
        onReply?.();
        setPopoverOpen(false);
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
        <div className="w-full mb-6 px-4 py-2 flex flex-col overflow-hidden">
            <div className="relative w-full px-5 py-3 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-out">
                {/* Record Header - Ultra Simplified */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {formatTimeForSocial(message.timestamp)}
                        </div>
                    </div>

                    {/* More Actions Popover */}
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-56 p-2"
                            align="end"
                            side="bottom"
                        >
                            <div className="space-y-1">
                                {/* Primary Actions */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEdit}
                                    disabled={isEditing}
                                    className="w-full justify-start h-9 px-3 text-sm"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>

                                {onReply && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleReply}
                                        disabled={isEditing}
                                        className="w-full justify-start h-9 px-3 text-sm"
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Reply
                                    </Button>
                                )}

                                {/* Secondary Actions */}
                                {hasSparks && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleToggleAnalysis}
                                        disabled={isEditing}
                                        className="w-full justify-start h-9 px-3 text-sm"
                                    >
                                        <Lightbulb className="w-4 h-4 mr-2" />
                                        {showAnalysis ? 'Hide Sparks' : 'Show Sparks'}
                                    </Button>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { }}
                                    disabled={isEditing}
                                    className="w-full justify-start h-9 px-3 text-sm"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { }}
                                    disabled={isEditing}
                                    className="w-full justify-start h-9 px-3 text-sm"
                                >
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    Bookmark
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="w-full justify-start h-9 px-3 text-sm"
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>

                                {/* Destructive Action */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    disabled={isEditing}
                                    className="w-full justify-start h-9 px-3 text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Content Area - Show inline editor or read-only content */}
                {isEditing && editMode === 'inline' ? (
                    <MobileInlineEditor
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

                {/* Footer - Ultra Simplified, only thread indicator */}
                {!isEditing && threadCount > 0 && (
                    <div className="flex justify-end mt-4">
                        <MobileThreadIndicator
                            threadCount={threadCount}
                            onOpenThread={handleOpenThread}
                            messageId={message.id}
                        />
                    </div>
                )}

                {/* Expanded Editor Modal */}
                <Dialog open={isExpandedEditing} onOpenChange={(open) => {
                    if (!open) {
                        switchToInlineMode();
                    }
                }}>
                    <DialogContent 
                        showCloseButton={false}
                        className="h-[90vh] w-[95vw] max-w-none p-0 border-0 bg-background"
                        onInteractOutside={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => switchToInlineMode()}
                                        className="h-8 w-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <h3 className="font-semibold text-foreground">Edit Message</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>

                            {/* Editor */}
                            <div className="flex-1 p-4">
                                <textarea
                                    value={localEditContent}
                                    onChange={handleContentChange}
                                    className="w-full h-full resize-none text-sm leading-relaxed border border-input rounded-lg p-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    placeholder="Edit your message..."
                                    autoFocus
                                />
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
