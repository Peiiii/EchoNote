import { Button } from "@/common/components/ui/button";
import { X, Bot, Sparkles } from "lucide-react";

interface MobileAIAssistantSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    channelId: string;
}

export const MobileAIAssistantSidebar = ({
    isOpen,
    onClose,
    channelId
}: MobileAIAssistantSidebarProps) => {
    if (!isOpen) return null;

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 space-y-4">
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                        AI Assistant
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                        Get help with your thoughts and ideas in this space.
                    </p>
                    <div className="text-xs text-muted-foreground">
                        Channel: {channelId}
                    </div>
                </div>

                {/* AI Features */}
                <div className="space-y-3">
                    <div className="text-sm font-medium text-foreground">Quick Actions</div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="h-20 flex-col gap-2">
                            <Bot className="w-4 h-4" />
                            <span className="text-xs">Ask Question</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-20 flex-col gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs">Generate Ideas</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-20 flex-col gap-2">
                            <Bot className="w-4 h-4" />
                            <span className="text-xs">Summarize</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-20 flex-col gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs">Brainstorm</span>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Button className="w-full" size="lg">
                    <Bot className="w-4 h-4 mr-2" />
                    Start Conversation
                </Button>
            </div>
        </div>
    );
};
