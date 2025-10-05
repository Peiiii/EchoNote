import { useState, useEffect } from "react";
import { Message } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useEditStateStore } from "@/core/stores/edit-state.store";

export function useThoughtRecord(message: Message) {
    const { currentChannelId } = useNotesViewStore();
    const { userId } = useNotesDataStore();
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [editingTags, setEditingTags] = useState<string[]>(message.tags || []);
    
    const deleteMessage = channelMessageService.deleteMessage;

    // Select only the relevant slices for this message to avoid re-rendering all items while typing
    const editingMessageId = useEditStateStore((s) => s.editingMessageId);
    const globalEditContent = useEditStateStore((s) => s.editContent);
    const globalEditMode = useEditStateStore((s) => s.editMode);
    const globalIsSaving = useEditStateStore((s) => s.isSaving);
    const startEditing = useEditStateStore((s) => s.startEditing);
    const save = useEditStateStore((s) => s.save);
    const cancel = useEditStateStore((s) => s.cancel);
    const switchToExpandedMode = useEditStateStore((s) => s.switchToExpandedMode);

    const isEditing = editingMessageId === message.id;
    const editContent = isEditing ? globalEditContent : message.content;
    const editMode = isEditing ? globalEditMode : 'inline';
    const isSaving = isEditing ? globalIsSaving : false;
    const aiAnalysis = message.aiAnalysis;
    const hasSparks = Boolean(aiAnalysis?.insights?.length);

    useEffect(() => {
        setEditingTags(message.tags || []);
    }, [message.tags]);

    const handleDelete = async () => {
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
                    await deleteMessage({ messageId: message.id, hardDelete: false, channelId: currentChannelId! });
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
            setEditingTags(message.tags || []);
        }
    };

    return {
        showAnalysis,
        editingTags,
        isEditing,
        aiAnalysis,
        hasSparks,
        editContent,
        editMode,
        isSaving,
        handleDelete,
        handleToggleAnalysis,
        handleEdit,
        handleSave,
        handleCancel,
        handleExpand,
        handleTagsChange
    };
}
