import { useCallback, useEffect, useState } from "react";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { contextDataCache } from "../services/context-data-cache";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";

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

  const [draftMode, setDraftMode] = useState<'auto' | ConversationContextConfig["mode"]>(
    conv?.contexts ? conv.contexts.mode : 'auto'
  );
  const [draftChannelIds, setDraftChannelIds] = useState<string[]>(
    conv?.contexts?.mode === 'channels' 
      ? (conv?.contexts?.channelIds || [fallbackChannelId]) 
      : [fallbackChannelId]
  );

  // Keep local draft in sync when switching conversations or when contexts updated externally
  useEffect(() => {
    setDraftMode(conv?.contexts ? conv.contexts.mode : 'auto');
    setDraftChannelIds(
      conv?.contexts?.mode === 'channels' 
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
    
    if (draftMode === 'auto') {
      await updateConversation(userId, conv.id, { contexts: null });
      return;
    }

    let next: ConversationContextConfig | undefined;
    if (draftMode === 'none') {
      next = { mode: 'none' };
    } else if (draftMode === 'all') {
      next = { mode: 'all' };
    } else {
      const ids = draftChannelIds.length ? draftChannelIds : [fallbackChannelId];
      next = { mode: 'channels', channelIds: ids };
      
      if (onActiveToolChannelChange) {
        const ensure = (activeToolChannelId && ids.includes(activeToolChannelId)) 
          ? activeToolChannelId 
          : ids[0];
        onActiveToolChannelChange(ensure);
      }
    }

    await updateConversation(userId, conv.id, { contexts: next });

    // Prefetch contexts after apply
    if (next?.mode === 'channels' && next.channelIds) {
      next.channelIds.forEach(id => void contextDataCache.ensureFetched(id));
    }
    if (next?.mode === 'all') {
      void contextDataCache.ensureAllMetas().then(() => {
        const ids = contextDataCache.getAllIdsSnapshot();
        ids.forEach(id => void contextDataCache.ensureFetched(id));
      });
    }
  }, [userId, conv, draftMode, draftChannelIds, fallbackChannelId, onActiveToolChannelChange, activeToolChannelId, updateConversation]);

  return {
    draftMode,
    setDraftMode,
    draftChannelIds,
    toggleChannel,
    apply,
    isSelectedMode: draftMode === 'channels'
  };
}
