import { create } from "zustand";
import { contextDataCache } from "@/common/features/ai-assistant/services/context-data-cache";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";

type Status = 'idle' | 'loading' | 'ready' | 'error';

export interface ChannelStatus {
  status: Status;
  lastFetched?: number;
  messageCount?: number;
  channelName?: string;
}

interface SessionStatusState {
  sessions: Record<string, {
    mode: 'auto' | ConversationContextConfig['mode'];
    channelIds: string[];
    resolvedChannelIds: string[];
    byChannel: Record<string, ChannelStatus>;
    topStatus: Status;
  }>;
}

interface Actions {
  observeSession: (params: {
    conversationId: string;
    mode: 'auto' | ConversationContextConfig['mode'];
    channelIds?: string[];
    fallbackChannelId: string;
  }) => () => void;
}

export const useContextStatusStore = create<SessionStatusState & Actions>((set, get) => ({
  sessions: {},

  observeSession: ({ conversationId, mode, channelIds, fallbackChannelId }) => {
    // Determine target IDs
    let ids: string[] = [];
    let topUnsub: (() => void) | null = null;

    const updateFromCache = () => {
      const current = get().sessions[conversationId];
      const byChannel: Record<string, ChannelStatus> = { ...(current?.byChannel || {}) };
      for (const id of ids) {
        const snap = contextDataCache.getSnapshot(id);
        // Consider a channel as ready when it has been fetched at least once (lastFetched > 0),
        // regardless of message count (empty channel is still valid and "ready").
        const isReady = !snap.fetching && snap.lastFetched > 0;
        byChannel[id] = {
          status: isReady ? 'ready' : 'loading',
          lastFetched: snap.lastFetched,
          messageCount: snap.messages?.length,
          channelName: snap.channel?.name,
        };
      }
      set(s => ({
        sessions: {
          ...s.sessions,
          [conversationId]: {
            mode,
            channelIds: channelIds || [],
            resolvedChannelIds: ids,
            byChannel,
            // In 'all' mode, only mark 'ready' when all channels are fetched at least once
            topStatus: mode === 'all'
              ? (ids.length && ids.every(id => byChannel[id]?.status === 'ready') ? 'ready' : 'loading')
              : 'idle',
          },
        },
      }));
    };

    if (mode === 'auto') {
      ids = [fallbackChannelId];
    } else if (mode === 'none') {
      ids = [];
    } else if (mode === 'channels') {
      ids = (channelIds && channelIds.length ? channelIds : [fallbackChannelId]);
    } else {
      // all: use the full index so status reflects truly all channels
      ids = contextDataCache.getAllIdsSnapshot();
      contextDataCache.ensureAllMetas().then(() => {
        ids = contextDataCache.getAllIdsSnapshot();
        ids.forEach(id => void contextDataCache.ensureFetched(id));
        updateFromCache();
      });
      topUnsub = contextDataCache.onAllMetasUpdate(() => updateFromCache());
    }

    // Prefetch and subscribe per-channel updates
    const unsubs: Array<() => void> = [];
    ids.forEach(id => {
      void contextDataCache.ensureFetched(id);
      const off = contextDataCache.onChannelUpdate(id, () => updateFromCache());
      unsubs.push(off);
    });
    updateFromCache();

    return () => {
      unsubs.forEach(fn => fn());
      if (topUnsub) topUnsub();
    };
  },
}));
