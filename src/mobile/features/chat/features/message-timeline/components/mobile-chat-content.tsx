import { ReactNode } from "react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { MobileExpandedEditor } from "./thought-record/mobile-expanded-editor";

interface MobileChatContentProps {
    timeline: ReactNode;
    input: ReactNode;
    scrollButton?: ReactNode;
    className?: string;
}

export const MobileChatContent = ({ timeline, input, scrollButton, className = "" }: MobileChatContentProps) => {
    const { 
        editingMessageId, 
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
        <div data-component="mobile-chat-content" className={`relative flex-1 flex flex-col h-full ${className}`}>
            {/* Normal content - timeline and input */}
            <div className="flex-1 flex flex-col min-h-0">
                {timeline}
                {scrollButton}
            </div>
            {input}
            
            {/* Expanded editor overlay - mobile optimized */}
            {isExpandedEditing && (
                <div className="fixed inset-0 z-50 bg-background">
                    <MobileExpandedEditor
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
