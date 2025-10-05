import { useEffect, useMemo } from "react";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { sessionContextManager } from "../services/session-context-manager";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";
import { ConversationContextMode } from "@/common/types/ai-conversation";

interface UseContextStatusProps {
  conversationId: string;
  fallbackChannelId: string;
  contexts?: ConversationContextConfig | null;
  getChannelName: (id: string) => string;
}

function getChannelIds(
  mode: ConversationContextMode,
  contexts: ConversationContextConfig | null | undefined,
  fallbackChannelId: string,
  channels: Array<{ id: string; name: string }>
): string[] {
  if (mode === ConversationContextMode.AUTO) {
    return [fallbackChannelId];
  } else if (mode === ConversationContextMode.NONE) {
    return [];
  } else if (mode === ConversationContextMode.CHANNELS) {
    const ids = contexts?.channelIds || [];
    return ids.length > 0 ? ids : [fallbackChannelId];
  } else {
    // ALL mode
    return channels.map(c => c.id);
  }
}

function generateTooltip(
  channelIds: string[],
  channelStates: Record<string, { loading?: boolean }>,
  getChannelName: (id: string) => string
): string {
  if (channelIds.length === 0) return '';
  
  const parts = channelIds.map(id => {
    const channelState = channelStates[id];
    const name = getChannelName(id);
    const status = channelState?.loading ? 'loading' : 'ready';
    return `${name}(${status})`;
  });
  
  return parts.join(', ');
}

export function useContextStatus({
  conversationId,
  fallbackChannelId,
  contexts,
  getChannelName
}: UseContextStatusProps) {
  const channelStates = channelMessageService.dataContainer.use();
  const { channels } = useNotesDataStore();

  // Trigger loading for channels that need it using centralized method
  useEffect(() => {
    sessionContextManager.ensureContextsLoaded(contexts || null, fallbackChannelId);
  }, [conversationId, fallbackChannelId, contexts]);

  const { anyLoading, tooltip } = useMemo(() => {
    const mode: ConversationContextMode = contexts ? contexts.mode : ConversationContextMode.AUTO;
    const channelIds = getChannelIds(mode, contexts, fallbackChannelId, channels);
    
    const loadingStates = channelIds.map(id => 
      channelStates.messageByChannel[id]?.loading || false
    );
    
    const anyLoading = loadingStates.some(loading => loading);
    const tooltip = generateTooltip(channelIds, channelStates.messageByChannel, getChannelName);
    
    return { anyLoading, tooltip };
  }, [contexts, fallbackChannelId, channels, channelStates, getChannelName]);

  return {
    anyLoading,
    tooltip
  };
}
