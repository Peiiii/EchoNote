import { forwardRef, useImperativeHandle, useState } from "react";
import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { AIConversationChat } from "@/common/features/ai-assistant/components/ai-conversation-chat";
import { AIConversationEmptyPane } from "@/common/features/ai-assistant/components/ai-conversation-empty-pane";
import { AIConversation } from "@/common/types/ai-conversation";
import { Button } from "@/common/components/ui/button";
import { Plus, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";

export type MobileConversationRef = {
  showList: () => void;
  showChat: () => void;
  createNew: () => void;
  isListView: () => boolean;
};

interface Props {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  channelId: string;
  onClose?: () => void;
}

export const AIConversationMobile = forwardRef<MobileConversationRef, Props>(function AIConversationMobile({ 
  conversations, 
  currentConversationId, 
  loading, 
  onSelect, 
  onCreate, 
  channelId, 
  onClose 
}, ref) {
  const [view, setView] = useState<"list" | "chat">("chat");
  const hasConversations = conversations.length > 0;

  useImperativeHandle(ref, () => ({
    showList: () => setView("list"),
    showChat: () => setView("chat"),
    createNew: () => {
      onCreate();
      setView("chat");
    },
    isListView: () => view === "list",
  }), [onCreate, view]);

  const renderListView = () => (
    <AIConversationList
      conversations={conversations}
      currentConversationId={currentConversationId}
      loading={loading}
      onSelect={(id) => { onSelect(id); setView("chat"); }}
      withHeader={false}
    />
  );

  const renderChatView = () => {
    if (currentConversationId) {
      return <AIConversationChat conversationId={currentConversationId} channelId={channelId} onClose={onClose} />;
    } else if(loading) {
      return <div className="relative flex-1 flex flex-col">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>
    } else if (hasConversations) {
      return <div className="flex-1" />;
    } else {
      return <AIConversationEmptyPane onCreate={onCreate} />;
    }
  };

  return (
    <div className="relative flex-1 flex flex-col">
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {view === "chat" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("list")}
              aria-label="Show conversations"
              className="h-8 w-8 flex-shrink-0"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          )}
          {view === "list" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView("chat")}
              aria-label="Back to chat"
              className="h-8 w-8 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h3 className="font-semibold text-foreground truncate">
            {view === "list" ? "Conversations" : "AI Chat"}
          </h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 pr-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onCreate();
              setView("chat");
            }}
            aria-label="New conversation"
            className="h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex-1">
        <div className={"absolute inset-0 flex flex-col " + (view === "list" ? "" : "hidden")}>{renderListView()}</div>
        <div className={"absolute inset-0 flex flex-col " + (view === "chat" ? "" : "hidden")}>{renderChatView()}</div>
      </div>
    </div>
  );
});
