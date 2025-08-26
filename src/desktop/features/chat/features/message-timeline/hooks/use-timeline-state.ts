import { useChatActions } from "@/common/features/chat/hooks/use-chat-actions";
import { useChatScroll } from "@/common/features/chat/hooks/use-chat-scroll";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useMemo } from "react";

export const useTimelineState = (currentChannelId: string, messagesLength: number) => {
    // Edit state management
    const editState = useEditStateStore();
    
    // Scroll state management
    const scrollState = useChatScroll([currentChannelId, messagesLength], { smoothScroll: true });
    
    // Chat actions management
    const chatActions = useChatActions(scrollState.containerRef);
    
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
    
    const memoizedScrollState = useMemo(() => ({
        containerRef: scrollState.containerRef,
        isSticky: scrollState.isSticky,
        handleScrollToBottom: scrollState.handleScrollToBottom,
    }), [
        scrollState.containerRef,
        scrollState.isSticky,
        scrollState.handleScrollToBottom
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
        scrollState: memoizedScrollState,
        chatActions: memoizedChatActions,
        editActions,
        isExpandedEditing,
    };
};
