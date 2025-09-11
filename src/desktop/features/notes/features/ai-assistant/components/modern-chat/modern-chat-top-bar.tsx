import { Button } from "@/common/components/ui/button";
import { Bot, Settings, Trash2 } from "lucide-react";

interface ModernChatTopBarProps {
  conversationTitle: string;
  onClear: () => void;
  onSettings: () => void;
}

export function ModernChatTopBar({
  conversationTitle,
  onClear,
  onSettings
}: ModernChatTopBarProps) {
  return (
    <div className="border-b bg-background/95 backdrop-blur-sm p-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {conversationTitle}
            </h2>
            <p className="text-xs text-muted-foreground">
              AI Assistant • Ready to help
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onSettings}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
