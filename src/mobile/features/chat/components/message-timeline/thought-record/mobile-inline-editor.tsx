import { useState, useEffect } from 'react';
import { Button } from '@/common/components/ui/button';
import { Textarea } from '@/common/components/ui/textarea';
import { Save, X, Expand } from 'lucide-react';

interface MobileInlineEditorProps {
    content: string;
    onSave: () => void;
    onCancel: () => void;
    onExpand: () => void;
    isSaving: boolean;
}

export function MobileInlineEditor({
    content,
    onSave,
    onCancel,
    onExpand,
    isSaving
}: MobileInlineEditorProps) {
    const [editContent, setEditContent] = useState(content);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setEditContent(content);
    }, [content]);

    useEffect(() => {
        setHasChanges(editContent !== content);
    }, [editContent, content]);

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
                onChange={(e) => setEditContent(e.target.value)}
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
                        className="h-8 px-3 text-xs"
                    >
                        <Save className="w-3 h-3 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
                
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onExpand}
                    className="h-8 px-3 text-xs"
                >
                    <Expand className="w-3 h-3 mr-1" />
                    Expand
                </Button>
            </div>

            {/* Status */}
            {hasChanges && (
                <div className="text-xs text-blue-600 dark:text-blue-400 text-center">
                    You have unsaved changes
                </div>
            )}
        </div>
    );
}
