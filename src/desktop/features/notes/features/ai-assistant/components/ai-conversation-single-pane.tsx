import { forwardRef, useImperativeHandle, useState } from "react";
import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { AIConversationChat } from "@/common/features/ai-assistant/components/ai-conversation-chat";
import { AIConversationEmptyPane } from "@/common/features/ai-assistant/components/ai-conversation-empty-pane";
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
      return <AIConversationEmptyPane onCreate={onCreate} />;
    }

  };

  return (
    <div className="relative flex-1">
      <div className={"absolute inset-0 flex flex-col " + (view === "list" ? "" : "hidden")}>{renderListView()}</div>
      <div className={"absolute inset-0 flex flex-col " + (view === "chat" ? "" : "hidden")}>{renderChatView()}</div>
    </div>
  );
});

