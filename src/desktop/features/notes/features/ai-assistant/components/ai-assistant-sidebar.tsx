import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { Plus, MessageSquare, X } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { AIConversationInterface, AIConversationInterfaceRef } from "./ai-conversation-interface";
import { useRef } from "react";

interface AIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export function AIAssistantSidebar({ isOpen, onClose, channelId }: AIAssistantSidebarProps) {
    const { channels } = useNotesDataStore();
    const currentChannel = channels.find(ch => ch.id === channelId);
    const convRef = useRef<AIConversationInterfaceRef>(null);
    const { currentConversation } = useConversationState();

    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col">
            <div className="px-3 py-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{currentConversation?.title || "AI Conversations"}</h3>
                        {currentChannel && (
                            <span className="text-sm text-muted-foreground truncate">- {currentChannel.name}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                const api = convRef.current;
                                if (!api) return;
                                if (api.isSinglePane()) api.showList();
                            }}
                            aria-label="Conversations"
                        >
                            <MessageSquare className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => convRef.current?.createNew()}
                            aria-label="New conversation"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <AIConversationInterface ref={convRef} channelId={channelId} onClose={onClose} />
            </div>
        </div>
    );
};
