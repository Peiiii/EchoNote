import { Message } from "@/core/stores/chat-data.store";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { MoreHorizontal, Edit2, MessageCircle, Lightbulb, Eye, Bookmark, Copy, Trash2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { useState } from "react";
import { MobileMarkdownContent } from "./mobile-markdown-content";
import { MobileReadMoreWrapper } from "./mobile-read-more-wrapper";
import { MobileThoughtRecordSparks } from "./mobile-thought-record-sparks";
import { MobileThreadIndicator } from "./mobile-thread-indicator";
import { MobileInlineEditor } from "./mobile-inline-editor";
import { Button } from "@/common/components/ui/button";
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/common/components/ui/popover";

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
    const [popoverOpen, setPopoverOpen] = useState(false);

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
        setPopoverOpen(false);
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
        setPopoverOpen(false);
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
        <div className="w-full mb-6 px-4 flex flex-col overflow-hidden">
            <div className="relative w-full px-5 py-5 bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 ease-out">
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
                                    onClick={() => {}}
                                    disabled={isEditing}
                                    className="w-full justify-start h-9 px-3 text-sm"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {}}
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
            </div>
        </div>
    );
};
