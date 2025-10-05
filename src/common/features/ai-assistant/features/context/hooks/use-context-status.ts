import { useEffect, useMemo } from "react";
import { useContextStatusStore } from "../stores/context-status.store";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";

interface UseContextStatusProps {
  conversationId: string;
  fallbackChannelId: string;
  contexts?: ConversationContextConfig | null;
  getChannelName: (id: string) => string;
}

export function useContextStatus({
  conversationId,
  fallbackChannelId,
  contexts,
  getChannelName
}: UseContextStatusProps) {
  const observe = useContextStatusStore(s => s.observeSession);
  const session = useContextStatusStore(s => s.sessions[conversationId]);

  useEffect(() => {
    const mode: 'auto' | 'none' | 'all' | 'channels' = contexts ? contexts.mode : 'auto';
    const ids = contexts?.mode === 'channels' ? (contexts.channelIds || []) : undefined;
    const off = observe({ conversationId, mode, channelIds: ids, fallbackChannelId });
    return () => off();
  }, [conversationId, fallbackChannelId, contexts, observe]);

  const anyLoading = useMemo(() => {
    const s = session;
    if (!s) return false;
    if (s.topStatus === 'loading') return true;
    return s.resolvedChannelIds.some(id => s.byChannel[id]?.status === 'loading');
  }, [session]);

  const tooltip = useMemo(() => {
    const s = session;
    if (!s) return '';
    if (s.mode === 'channels') {
      const parts = s.resolvedChannelIds.map(id => {
        const st = s.byChannel[id];
        const name = st?.channelName || getChannelName(id);
        const stat = st?.status || 'idle';
        return `${name}(${stat})`;
      });
      return parts.join(', ');
    }
    return '';
  }, [session, getChannelName]);

  return {
    anyLoading,
    tooltip
  };
}
