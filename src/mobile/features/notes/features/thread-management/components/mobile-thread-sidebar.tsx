import { Button } from "@/common/components/ui/button";
import { MessageSquare } from "lucide-react";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { useChannelMessages } from "@/common/features/notes/hooks/use-channel-messages";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

interface MobileThreadSidebarProps {
  onSendMessage: (message: string) => void;
}

export const MobileThreadSidebar = ({ onSendMessage }: MobileThreadSidebarProps) => {
  const { currentChannelId } = useNotesViewStore();
  const { messages } = useChannelMessages({});
  const parentMessage = currentChannelId ? messages.find(m => m.id === currentChannelId) : null;
  const threadMessages = currentChannelId
    ? messages.filter(m => m.threadId === currentChannelId) || []
    : [];

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-start p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Thread</h3>
        </div>
      </div>

      {/* Parent Message */}
      <div className="p-4 bg-muted/50">
        <div className="text-sm text-muted-foreground mb-2">Parent Message</div>
        <div className="text-sm text-foreground leading-relaxed">{parentMessage?.content}</div>
        <div className="text-xs text-muted-foreground mt-2">
          {formatTimeForSocial(parentMessage?.timestamp || new Date())}
        </div>
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-sm font-medium text-foreground mb-3">Replies</div>
        {threadMessages.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-8">
            No replies yet. Start the conversation!
          </div>
        ) : (
          threadMessages.map(message => (
            <div key={message.id} className="bg-card border border-border rounded-lg p-3">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {message.content}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {formatTimeForSocial(message.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Reply to thread..."
            className="flex-1 px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground placeholder:text-muted-foreground"
            onKeyDown={e => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                onSendMessage(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
          />
          <Button
            size="sm"
            onClick={e => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
              if (input && input.value.trim()) {
                onSendMessage(input.value.trim());
                input.value = "";
              }
            }}
          >
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};
