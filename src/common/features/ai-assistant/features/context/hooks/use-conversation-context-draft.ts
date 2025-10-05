import { useCallback, useEffect, useState } from "react";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { sessionContextManager } from "../services/session-context-manager";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";
import { ConversationContextMode } from "@/common/types/ai-conversation";

interface UseConversationContextDraftProps {
  conversationId: string;
  fallbackChannelId: string;
  onActiveToolChannelChange?: (id: string | null) => void;
  activeToolChannelId?: string | null;
}

export function useConversationContextDraft({
  conversationId,
  fallbackChannelId,
  onActiveToolChannelChange,
  activeToolChannelId
}: UseConversationContextDraftProps) {
  const conv = useConversationStore(s => s.conversations.find(c => c.id === conversationId));
  const updateConversation = useConversationStore(s => s.updateConversation);
  const { userId } = useNotesDataStore();

  const [draftMode, setDraftMode] = useState<ConversationContextMode>(
    conv?.contexts ? conv.contexts.mode : ConversationContextMode.AUTO
  );
  const [draftChannelIds, setDraftChannelIds] = useState<string[]>(
    conv?.contexts?.mode === ConversationContextMode.CHANNELS
      ? (conv?.contexts?.channelIds || [fallbackChannelId])
      : [fallbackChannelId]
  );

  // Keep local draft in sync when switching conversations or when contexts updated externally
  useEffect(() => {
    setDraftMode(conv?.contexts ? conv.contexts.mode : ConversationContextMode.AUTO);
    setDraftChannelIds(
      conv?.contexts?.mode === ConversationContextMode.CHANNELS
        ? (conv?.contexts?.channelIds || [fallbackChannelId])
        : [fallbackChannelId]
    );
  }, [conversationId, conv?.contexts, fallbackChannelId]);

  const toggleChannel = useCallback((id: string) => {
    setDraftChannelIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const apply = useCallback(async () => {
    if (!userId || !conv) return;

    if (draftMode === ConversationContextMode.AUTO) {
      await updateConversation(userId, conv.id, { contexts: { mode: ConversationContextMode.AUTO } });
      return;
    }

    let next: ConversationContextConfig | undefined;
    if (draftMode === ConversationContextMode.NONE) {
      next = { mode: ConversationContextMode.NONE };
    } else if (draftMode === ConversationContextMode.ALL) {
      next = { mode: ConversationContextMode.ALL };
    } else {
      const ids = draftChannelIds.length ? draftChannelIds : [fallbackChannelId];
      next = { mode: ConversationContextMode.CHANNELS, channelIds: ids };

      if (onActiveToolChannelChange) {
        const ensure = (activeToolChannelId && ids.includes(activeToolChannelId))
          ? activeToolChannelId
          : ids[0];
        onActiveToolChannelChange(ensure);
      }
    }

    await updateConversation(userId, conv.id, { contexts: next });

    // Trigger loading for contexts after apply using centralized method
    sessionContextManager.ensureContextsLoaded(next, fallbackChannelId);
  }, [userId, conv, draftMode, draftChannelIds, fallbackChannelId, onActiveToolChannelChange, activeToolChannelId, updateConversation]);

  return {
    draftMode,
    setDraftMode,
    draftChannelIds,
    toggleChannel,
    apply,
    isSelectedMode: draftMode === ConversationContextMode.CHANNELS
  };
}
