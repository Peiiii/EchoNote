import { useMemo } from "react";
import type { ConversationContextConfig } from "@/common/types/ai-conversation";

interface UseContextDisplayProps {
  contexts?: ConversationContextConfig | null;
  fallbackChannelId: string;
  getChannelName: (id: string) => string;
  channelsLength: number;
}

export function useContextDisplay({
  contexts,
  fallbackChannelId,
  getChannelName,
  channelsLength
}: UseContextDisplayProps) {
  const label = useMemo(() => {
    const ctx = contexts;
    if (!ctx) return `Auto (${getChannelName(fallbackChannelId)})`;
    if (ctx.mode === 'none') return 'No Context';
    if (ctx.mode === 'all') return 'All Channels';
    const ids = ctx.channelIds || [];
    if (ids.length === 0) return 'No Context';
    if (ids.length === 1) return getChannelName(ids[0]);
    // Only render the first name in the truncated label; we will render +N as a separate badge to avoid truncation hiding it
    return getChannelName(ids[0]);
  }, [contexts, fallbackChannelId, getChannelName]);

  const otherCount = useMemo(() => {
    const ctx = contexts;
    if (!ctx || ctx.mode !== 'channels') return 0;
    const ids = ctx.channelIds || [];
    return Math.max(0, ids.length - 1);
  }, [contexts]);

  const totalCount = useMemo(() => {
    const ctx = contexts;
    if (!ctx) return 1; // Auto -> current channel
    if (ctx.mode === 'none') return 0;
    if (ctx.mode === 'all') return channelsLength;
    const ids = ctx.channelIds || [];
    return ids.length;
  }, [contexts, channelsLength]);

  return {
    label,
    otherCount,
    totalCount
  };
}
