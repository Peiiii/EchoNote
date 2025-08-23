import { useState, useEffect } from "react";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { ArrowLeft, Save, X } from "lucide-react";

interface MobileExpandedEditorProps {
    content: string;
    originalContent: string;
    onSave: () => void;
    onCancel: () => void;
    onCollapse: () => void;
    isSaving: boolean;
}

export const MobileExpandedEditor = ({
    content,
    originalContent,
    onSave,
    onCancel,
    onCollapse,
    isSaving
}: MobileExpandedEditorProps) => {
    const [editContent, setEditContent] = useState(content);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        setEditContent(content);
    }, [content]);

    useEffect(() => {
        setHasChanges(editContent !== originalContent);
    }, [editContent, originalContent]);

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
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || isSaving}
                        size="sm"
                    >
                        <Save className="w-4 h-4 mr-1" />
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-4">
                <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Edit your message..."
                    className="h-full resize-none text-sm leading-relaxed"
                    autoFocus
                />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/50">
                <div className="text-xs text-muted-foreground text-center">
                    {hasChanges ? "You have unsaved changes" : "No changes made"}
                </div>
            </div>
        </div>
    );
};
