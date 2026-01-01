import { forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from "react";
import { useAuthStore } from "@/core/stores/auth.store";
import { useConversationState } from "@/common/features/ai-assistant/hooks/use-conversation-state";
import { useContainerMode } from "@/common/hooks/use-container-mode";
import { AIConversationTwoPane } from "./ai-conversation-two-pane";
import { AIConversationSinglePane, SinglePaneRef } from "./ai-conversation-single-pane";
import { AIConversationSkeleton } from "@/common/features/ai-assistant/components/ai-conversation-skeleton";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { Button } from "@/common/components/ui/button";
import {
  ConversationInterfaceProps,
  ConversationInterfaceRef,
} from "@/common/features/ai-assistant/types/conversation.types";

export type AIConversationInterfaceRef = ConversationInterfaceRef;

export const AIConversationInterface = forwardRef<
  ConversationInterfaceRef,
  ConversationInterfaceProps
>(function AIConversationInterface({ channelId, onClose }, ref) {
  const uid = useAuthStore(s => s.currentUser?.uid) ?? null;
  const {
    conversations,
    currentConversationId,
    loading,
    createConversation,
    loadConversations,
    resetForLoggedOut,
  } = useConversationState();

  const containerRef = useRef<HTMLDivElement>(null);
  const { mode, ready } = useContainerMode(containerRef, {
    sidebar: 320,
    chatMin: 520,
    hysteresis: 12,
    debounceMs: 80,
  });
  const isSinglePane = mode === "single-pane";

  const singleRef = useRef<SinglePaneRef>(null);

  const handleCreateConversation = useCallback(() => {
    if (!uid) return;
    // MVP v1: conversations are global; default context is provided by UI (current channel)
    void createConversation(uid, "New Conversation");
  }, [uid, createConversation]);

  useImperativeHandle(
    ref,
    () => ({
      showList: () => singleRef.current?.showList(),
      showChat: () => singleRef.current?.showChat(),
      createNew: () => handleCreateConversation(),
      isSinglePane: () => isSinglePane,
    }),
    [isSinglePane, handleCreateConversation]
  );

  useEffect(() => {
    if (!uid) {
      resetForLoggedOut();
      return;
    }
    loadConversations(uid);
  }, [uid, loadConversations, resetForLoggedOut]);

  if (!uid) {
    return (
      <div ref={containerRef} className="h-full flex items-center justify-center p-6">
        <div className="text-sm text-muted-foreground text-center space-y-3">
          <div>登录后可使用对话列表与云端对话能力。</div>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
              onClick={() => openLoginModal({ title: "登录以使用对话能力" })}
            >
              去登录
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !ready) {
    return (
      <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible")}>
        <AIConversationSkeleton />
      </div>
    );
  }
  return (
    <div ref={containerRef} className={"h-full flex " + (ready ? "" : "invisible")}>
      {mode === "two-pane" ? (
        <AIConversationTwoPane
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          channelId={channelId}
          onClose={onClose}
        />
      ) : (
        <AIConversationSinglePane
          ref={singleRef}
          conversations={conversations}
          currentConversationId={currentConversationId}
          loading={loading}
          channelId={channelId}
          onClose={onClose}
        />
      )}
    </div>
  );
});
