import { channelContextManager } from "./channel-context-manager";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
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
    // Architecture-level improvement:
    // - Build a global channels index so the agent "knows" all channels up-front
    // - Prefetch all channel contexts progressively (concurrency-limited) without blocking
    // - Return a blended context: global index + a few hydrated channels for immediate quality

    const metas = contextDataCache.getAllMetasSnapshot();
    if (metas.length === 0) {
      // Kick off background fetch of the full index and then hydrate
      void contextDataCache.ensureAllMetas().then(() => {
        void contextDataCache.prefetchAllChannelsMessages(4);
      });
      // Fallback to current channel context while global index hydrates
      return channelContextManager.getChannelContext(fallbackChannelId);
    }

    // Start progressive hydration in background
    void contextDataCache.prefetchAllChannelsMessages(4);

    // Provide a compact global index so the agent is aware of all channels immediately
    const index = metas.map(m => ({ id: m.id, name: m.name, messageCount: m.messageCount }));
    const indexContext = [{
      description: 'Available Channels Index',
      value: JSON.stringify({ total: metas.length, channels: index })
    }];

    // Include detailed context for channels that have been fetched at least once.
    // Order by last active first (metas is already sorted that way in cache).
    const readyIds = metas
      .map(m => m.id)
      .filter(id => {
        const snap = contextDataCache.getSnapshot(id);
        return !snap.fetching && snap.lastFetched > 0; // fetched at least once
      });
    if (readyIds.length === 0) {
      // No hydrated channels yet; return index + fallback channel so the model has some concrete context
      return [...indexContext, ...channelContextManager.getChannelContext(fallbackChannelId)];
    }
    const detailed = readyIds.flatMap(id => channelContextManager.getChannelContext(id));
    return [...indexContext, ...detailed];
  }
}

export const sessionContextManager = new SessionContextManager();
