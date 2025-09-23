import { Button } from "@/common/components/ui/button";
import { AIConversationChat } from "@/common/features/ai-assistant/components/ai-conversation-chat";
import { AIConversationEmptyPane } from "@/common/features/ai-assistant/components/ai-conversation-empty-pane";
import { AIConversationList } from "@/common/features/ai-assistant/components/ai-conversation-list";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { AIConversation } from "@/common/types/ai-conversation";
import { ArrowLeft, Loader2, MessageSquare, Plus } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";

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
  onCreate: () => void;
  channelId: string;
  onClose?: () => void;
}

export const AIConversationMobile = forwardRef<MobileConversationRef, Props>(
  function AIConversationMobile(
    {
      conversations,
      currentConversationId,
      loading,
      onCreate,
      channelId,
      onClose,
    },
    ref
  ) {
    const view = useConversationStore((s) => s.uiView);
    const showList = useConversationStore((s) => s.showList);
    const showChat = useConversationStore((s) => s.showChat);
    const hasConversations = conversations.length > 0;
    useImperativeHandle(
      ref,
      () => ({
        showList: () => showList(),
        showChat: () => showChat(),
        createNew: () => {
          onCreate();
          showChat();
        },
        isListView: () => view === "list",
      }),
      [onCreate, showList, showChat, view]
    );

    const renderListView = () => (
      <AIConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        loading={loading}
        withHeader={false}
      />
    );

    const renderChatView = () => {
      if (currentConversationId) {
        return (
          <AIConversationChat
            conversationId={currentConversationId}
            channelId={channelId}
            onClose={onClose}
          />
        );
      } else if (loading) {
        return (
          <div className="relative flex-1 flex flex-col">
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        );
      } else if (hasConversations) {
        return <div className="flex-1" />;
      } else {
        return <AIConversationEmptyPane onCreate={onCreate} />;
      }
    };

    // Derive the active conversation's title for header display
    const activeConversation = currentConversationId
      ? conversations.find(c => c.id === currentConversationId)
      : undefined;
    const titleGeneratingMap = useConversationStore(s => s.titleGeneratingMap);
    const headerTitle = view === "list"
      ? "Conversations"
      : activeConversation
        ? (titleGeneratingMap[activeConversation.id] ? "Generating title..." : (activeConversation.title || "AI Chat"))
        : "AI Chat";

    return (
      <div className="relative flex-1 flex flex-col">
        {/* Header Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-background">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {view === "chat" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => showList()}
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
                onClick={() => showChat()}
                aria-label="Back to chat"
                className="h-8 w-8 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h3 className="font-semibold text-foreground truncate">
              {headerTitle}
            </h3>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 pr-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onCreate();
                showChat();
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
          <div
            className={
              "absolute inset-0 flex flex-col " +
              (view === "list" ? "" : "hidden")
            }
          >
            {renderListView()}
          </div>
          <div
            className={
              "absolute inset-0 flex flex-col " +
              (view === "chat" ? "" : "hidden")
            }
          >
            {renderChatView()}
          </div>
        </div>
      </div>
    );
  }
);
