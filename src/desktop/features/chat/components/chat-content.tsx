import { ReactNode } from "react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { ExpandedEditor } from "@/desktop/features/chat/features/message-timeline/components/thought-record/expanded-editor";

interface ChatContentProps {
    timeline: ReactNode;
    input: ReactNode;
    scrollButton?: ReactNode;
    className?: string;
}

export const ChatContent = ({ timeline, input, scrollButton, className = "" }: ChatContentProps) => {
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
        <div data-component="chat-content" className={`relative flex-1 flex flex-col h-full ${className}`}>
            {/* Normal content - timeline and input */}
            <div className="flex-1 flex flex-col min-h-0">
                {timeline}
                {scrollButton}
            </div>
            {input}
            
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
