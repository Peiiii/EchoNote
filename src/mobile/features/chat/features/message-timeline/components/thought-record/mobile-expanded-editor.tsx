import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { ArrowLeft, Save, X } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";

interface MobileExpandedEditorProps {
    originalContent: string;
    onSave: () => void;
    onCancel: () => void;
    onCollapse: () => void;
    isSaving: boolean;
}

export const MobileExpandedEditor = ({
    originalContent,
    onSave,
    onCancel,
    onCollapse,
    isSaving
}: MobileExpandedEditorProps) => {
    const { editContent, updateContent } = useEditStateStore();
    const hasChanges = editContent !== originalContent;

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        updateContent(newContent);
    };

    const handleSave = () => {
        if (hasChanges) {
            onSave();
        }
    };

    const handleCancel = () => {
        if (hasChanges) {
            if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
                onCancel();
            }
        } else {
            onCancel();
        }
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onCollapse}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold text-foreground">Edit Message</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        size="sm"
                        className={`${
                            hasChanges 
                                ? 'bg-slate-600 hover:bg-slate-700 text-white shadow-sm border border-slate-500 transition-colors duration-200' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Save className="h-4 w-4 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-4">
                <Textarea
                    value={editContent}
                    onChange={handleContentChange}
                    placeholder="Edit your message..."
                    className="h-full resize-none text-sm leading-relaxed"
                    autoFocus
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/50">
                <div className="text-xs text-muted-foreground text-center">
                    {hasChanges ? "Unsaved changes" : "All changes saved"}
                </div>
            </div>
        </div>
    );
};
