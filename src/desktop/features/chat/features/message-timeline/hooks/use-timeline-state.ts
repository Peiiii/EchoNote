import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useMemo, useRef } from "react";

export const useTimelineState = () => {
    // Edit state management
    const editState = useEditStateStore();
    
    // Container ref for chat actions (still needed for some actions)
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Chat actions management
    const chatActions = useChatActions(containerRef);
    
    // Edit actions - memoized to prevent unnecessary re-renders
    const editActions = useMemo(() => ({
        handleSave: async () => {
            await editState.save();
        },
        handleCancel: () => {
            editState.cancel();
        },
        handleCollapse: () => {
            editState.switchToInlineMode();
        }
    }), [editState]);
    
    // Computed values - memoized to prevent unnecessary re-computations
    const isExpandedEditing = useMemo(() => 
        Boolean(editState.editingMessageId && editState.editMode === 'expanded'),
        [editState.editingMessageId, editState.editMode]
    );
    
    // Memoized state objects to prevent unnecessary re-renders
    const memoizedEditState = useMemo(() => ({
        editingMessageId: editState.editingMessageId,
        editContent: editState.editContent,
        originalContent: editState.originalContent,
        editMode: editState.editMode,
        isSaving: editState.isSaving,
    }), [
        editState.editingMessageId,
        editState.editContent,
        editState.originalContent,
        editState.editMode,
        editState.isSaving
    ]);
    
    const memoizedChatActions = useMemo(() => ({
        replyToMessageId: chatActions.replyToMessageId,
        handleSend: chatActions.handleSend,
        handleCancelReply: chatActions.handleCancelReply,
        chatIsSticky: chatActions.isSticky,
    }), [
        chatActions.replyToMessageId,
        chatActions.handleSend,
        chatActions.handleCancelReply,
        chatActions.isSticky
    ]);
    
    return {
        editState: memoizedEditState,
        chatActions: memoizedChatActions,
        editActions,
        isExpandedEditing,
    };
};
