import { channelContextManager } from "./channel-context-manager";
import { useConversationStore } from "../stores/conversation.store";
import { contextDataCache } from "./context-data-cache";

export class SessionContextManager {
  /**
   * Get conversation-scoped contexts. Fallback to a provided channel when no explicit contexts are set.
   */
  getSessionContexts(conversationId: string, fallbackChannelId: string) {
    const conv = useConversationStore.getState().conversations.find(c => c.id === conversationId);
    if (!conv || !conv.contexts) {
      return channelContextManager.getChannelContext(fallbackChannelId);
    }

    const { mode, channelIds } = conv.contexts;
    if (mode === 'none') {
      return [
        {
          description: 'System Instructions',
          value: JSON.stringify({ instructions: 'No external context is attached to this conversation. Respond based on user input only unless the user explicitly asks to reference notes.' })
        }
      ];
    }

    if (mode === 'channels') {
      const ids = channelIds || [];
      if (ids.length === 0) return [];
      // Concatenate contexts for each selected channel
      return ids.flatMap(id => channelContextManager.getChannelContext(id));
    }

    // mode === 'all'
    // Use snapshot for immediate sync return; ensure background refresh & prefetch
    const snap = contextDataCache.getTopIdsSnapshot(5);
    if (snap.length === 0) {
      // trigger background compute and fall back to current channel for this call
      void contextDataCache.ensureTopIds(5).then(() => {
        const ids = contextDataCache.getTopIdsSnapshot(5);
        ids.forEach(id => void contextDataCache.ensureFetched(id));
      });
      return channelContextManager.getChannelContext(fallbackChannelId);
    }
    // prefetch contexts in background
    snap.forEach(id => void contextDataCache.ensureFetched(id));
    return snap.flatMap(id => channelContextManager.getChannelContext(id));
  }
}

export const sessionContextManager = new SessionContextManager();
