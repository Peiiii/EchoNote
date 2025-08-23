import { Button } from "@/common/components/ui/button";
import { Menu, Bot } from "lucide-react";

interface MobileHeaderProps {
    onOpenChannelList: () => void;
    onOpenAIAssistant: () => void;
    currentChannelName?: string;
}

export const MobileHeader = ({ 
    onOpenChannelList, 
    onOpenAIAssistant, 
    currentChannelName 
}: MobileHeaderProps) => {
    return (
        <div className="flex-shrink-0 px-4 py-3 border-b border-border bg-background">
            <div className="flex items-center justify-between">
                {/* Left: Channel List Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenChannelList}
                    className="h-10 w-10"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Center: Current Channel Name */}
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-semibold text-foreground truncate px-2">
                        {currentChannelName || "EchoNote"}
                    </h1>
                </div>

                {/* Right: AI Assistant Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onOpenAIAssistant}
                    className="h-10 w-10"
                >
                    <Bot className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};
