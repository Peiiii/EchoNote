import { Message } from "@/core/stores/chat-data.store";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Button } from "@/common/components/ui/button";
import { MessageSquare, Edit, Trash2 } from "lucide-react";
import { useEditStateStore } from "@/core/stores/edit-state.store";
import { useChatDataStore } from "@/core/stores/chat-data.store";

interface MobileThoughtRecordProps {
    message: Message;
    onOpenThread: (messageId: string) => void;
}

export const MobileThoughtRecord = ({ message, onOpenThread }: MobileThoughtRecordProps) => {
    const { startEditing } = useEditStateStore();
    const { deleteMessage } = useChatDataStore();

    const handleEdit = () => {
        startEditing(message.id, message.content);
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this message?")) {
            deleteMessage(message.id);
        }
    };

    const handleOpenThread = () => {
        onOpenThread(message.id);
    };

    return (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium text-foreground">
                        Thought Record
                    </div>
                </div>
                <div className="text-xs text-muted-foreground">
                    {formatTimeForSocial(message.timestamp)}
                </div>
            </div>

            {/* Content */}
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {message.content}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleOpenThread}
                    className="h-8 px-3 text-xs"
                >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Thread
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 px-3 text-xs"
                >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="h-8 px-3 text-xs text-destructive hover:text-destructive"
                >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                </Button>
            </div>
        </div>
    );
};
