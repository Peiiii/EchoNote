import { Button } from '@/common/components/ui/button';
import { Textarea } from '@/common/components/ui/textarea';
import { Save, X, Expand } from 'lucide-react';
import { useEditStateStore } from '@/core/stores/edit-state.store';

interface MobileInlineEditorProps {
    onSave: () => void;
    onCancel: () => void;
    onExpand: () => void;
    isSaving: boolean;
}

export function MobileInlineEditor({
    onSave,
    onCancel,
    onExpand,
    isSaving
}: MobileInlineEditorProps) {
    const { editContent, originalContent, updateContent } = useEditStateStore();
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
        <div className="space-y-3">
            {/* Editor */}
            <Textarea
                value={editContent}
                onChange={handleContentChange}
                placeholder="Edit your thought..."
                className="min-h-[120px] resize-none text-sm leading-relaxed border-2 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
                autoFocus
            />

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="h-8 px-3 text-xs"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        size="sm"
                        className={`h-8 px-3 text-xs ${
                            hasChanges 
                                ? 'bg-slate-600 hover:bg-slate-700 text-white shadow-sm border border-slate-500 transition-colors duration-200' 
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        <Save className="w-3 h-3 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExpand}
                    disabled={isSaving}
                    className="h-8 px-3 text-xs"
                >
                    <Expand className="w-3 h-3 mr-1" />
                    Expand
                </Button>
            </div>
        </div>
    );
}
