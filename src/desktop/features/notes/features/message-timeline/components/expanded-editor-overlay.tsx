import { ExpandedEditor } from "./thought-record/expanded-editor";

interface ExpandedEditorOverlayProps {
    isVisible: boolean;
    editContent: string;
    originalContent: string;
    isSaving: boolean;
    onSave: () => Promise<void>;
    onCancel: () => void;
    onCollapse: () => void;
    className?: string;
}

export const ExpandedEditorOverlay = ({
    isVisible,
    editContent,
    originalContent,
    isSaving,
    onSave,
    onCancel,
    onCollapse,
    className = ""
}: ExpandedEditorOverlayProps) => {
    if (!isVisible) return null;
    
    return (
        <div className={`absolute inset-0 z-50 bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-lg m-2 animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out ${className}`}>
            <ExpandedEditor
                content={editContent}
                originalContent={originalContent}
                onSave={onSave}
                onCancel={onCancel}
                onCollapse={onCollapse}
                isSaving={isSaving}
            />
        </div>
    );
};
