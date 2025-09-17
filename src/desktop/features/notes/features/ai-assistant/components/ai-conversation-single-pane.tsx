import { forwardRef, useImperativeHandle, useState } from "react";
import { AIConversationList } from "./ai-conversation-list";
import { AIConversationChat } from "./ai-conversation-chat";
import { AIConversation } from "@/common/types/ai-conversation";

export type SinglePaneRef = {
  showList: () => void;
  showChat: () => void;
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

export const AIConversationSinglePane = forwardRef<SinglePaneRef, Props>(function AIConversationSinglePane({ conversations, currentConversationId, loading, onSelect, onCreate, channelId, onClose }, ref) {
  const [view, setView] = useState<"list" | "chat">("chat");
  const hasConversations = conversations.length > 0;

  useImperativeHandle(ref, () => ({
    showList: () => setView("list"),
    showChat: () => setView("chat"),
  }), []);

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
    } else if (hasConversations) {
      return <div className="flex-1" />;
    } else {
      return <EmptyPane onCreate={onCreate} />;
    }

  };

  return (
    <div className="relative flex-1">
      <div className={"absolute inset-0 flex flex-col " + (view === "list" ? "" : "hidden")}>{renderListView()}</div>
      <div className={"absolute inset-0 flex flex-col " + (view === "chat" ? "" : "hidden")}>{renderChatView()}</div>
    </div>
  );
});

function EmptyPane({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
        <p className="text-muted-foreground mb-4">Create a new conversation to start chatting</p>
        <button onClick={onCreate} className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90">
          Create Conversation
        </button>
      </div>
    </div>
  );
}
