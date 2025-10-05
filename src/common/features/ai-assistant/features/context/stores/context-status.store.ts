import { create } from "zustand";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { ConversationContextMode } from "@/common/types/ai-conversation";

type Status = 'idle' | 'loading' | 'ready' | 'error';

export interface ChannelStatus {
  status: Status;
  messageCount?: number;
  channelName?: string;
}

interface SessionStatusState {
  sessions: Record<string, {
    mode: ConversationContextMode;
    channelIds: string[];
    resolvedChannelIds: string[];
    byChannel: Record<string, ChannelStatus>;
    topStatus: Status;
  }>;
}

interface Actions {
  observeSession: (params: {
    conversationId: string;
    mode: ConversationContextMode;
    channelIds?: string[];
    fallbackChannelId: string;
  }) => () => void;
}

export const useContextStatusStore = create<SessionStatusState & Actions>((set, get) => ({
  sessions: {},

  observeSession: ({ conversationId, mode, channelIds, fallbackChannelId }) => {
    // Determine target IDs
    let ids: string[] = [];

    const updateFromChannelService = () => {
      const current = get().sessions[conversationId];
      const byChannel: Record<string, ChannelStatus> = { ...(current?.byChannel || {}) };
      const channelStates = channelMessageService.dataContainer.get().messageByChannel;
      const { channels } = useNotesDataStore.getState();
      
      for (const id of ids) {
        const channelState = channelStates[id];
        const channel = channels.find(c => c.id === id);
        
        // Consider a channel as ready when it has messages loaded (not loading)
        const isReady = channelState && !channelState.loading && channelState.messages.length >= 0;
        byChannel[id] = {
          status: isReady ? 'ready' : 'loading',
          messageCount: channelState?.messages?.length || 0,
          channelName: channel?.name,
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
            // In 'all' mode, only mark 'ready' when all channels are loaded
            topStatus: mode === ConversationContextMode.ALL
              ? (ids.length && ids.every(id => byChannel[id]?.status === 'ready') ? 'ready' : 'loading')
              : 'idle',
          },
        },
      }));
    };

    if (mode === ConversationContextMode.AUTO) {
      ids = [fallbackChannelId];
    } else if (mode === ConversationContextMode.NONE) {
      ids = [];
    } else if (mode === ConversationContextMode.CHANNELS) {
      ids = (channelIds && channelIds.length ? channelIds : [fallbackChannelId]);
    } else {
      // all: use all channels from notes data store
      const { channels } = useNotesDataStore.getState();
      ids = channels.map(c => c.id);
    }

    // Trigger loading for channels that need it
    ids.forEach(id => {
      const channelState = channelMessageService.dataContainer.get().messageByChannel[id];
      if (!channelState) {
        // Request loading if not already loaded
        channelMessageService.requestLoadInitialMessages$.next({ channelId: id });
      }
    });

    // Subscribe to channel loading state changes
    const unsubs: Array<() => void> = [];
    ids.forEach(id => {
      // Use ChannelMessageService's loading state observation
      const loadingState$ = channelMessageService.getIsAnyChannelLoading$([id]);
      const sub = loadingState$.subscribe(() => updateFromChannelService());
      unsubs.push(() => sub.unsubscribe());
    });

    // Initial update
    updateFromChannelService();

    return () => {
      unsubs.forEach(fn => fn());
    };
  },
}));
