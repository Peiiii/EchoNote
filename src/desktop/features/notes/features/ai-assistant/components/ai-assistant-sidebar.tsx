import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { X } from "lucide-react";
import { AIConversationInterface } from "./ai-conversation-interface";

interface AIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export function AIAssistantSidebar({ isOpen, onClose, channelId }: AIAssistantSidebarProps) {
    const { channels } = useNotesDataStore();
    const currentChannel = channels.find(ch => ch.id === channelId);

    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">AI Conversations</h3>
                        {currentChannel && (
                            <span className="text-sm text-muted-foreground">- {currentChannel.name}</span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-accent flex-shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <AIConversationInterface channelId={channelId} onClose={onClose} />
            </div>
        </div>
    );
};
