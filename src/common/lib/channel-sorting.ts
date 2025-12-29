import type { Channel } from "@/core/stores/notes-data.store";

/**
 * Get activity timestamp for a channel
 * Priority: lastMessageTime > updatedAt > createdAt
 */
export function getChannelActivity(channel: Channel): number {
  const t1 = channel.lastMessageTime?.getTime();
  const t2 = channel.updatedAt?.getTime();
  const t3 = channel.createdAt?.getTime?.() ? channel.createdAt.getTime() : 0;
  return t1 ?? t2 ?? t3 ?? 0;
}

/**
 * Sort channels by activity in descending order (most recent first)
 * This is the unified sorting logic used across all channel lists
 */
export function sortChannelsByActivity(channels: Channel[]): Channel[] {
  return [...channels].sort((a, b) => getChannelActivity(b) - getChannelActivity(a));
}

/**
 * Sort channels with current channel first, then by activity
 * Useful for dropdown selectors where current channel should be highlighted
 */
export function sortChannelsWithCurrentFirst(
  channels: Channel[],
  currentChannelId: string
): Channel[] {
  const sortedChannels = sortChannelsByActivity(channels);
  
  // Move current channel to the front if it exists
  const currentChannelIndex = sortedChannels.findIndex(c => c.id === currentChannelId);
  if (currentChannelIndex > 0) {
    const [currentChannel] = sortedChannels.splice(currentChannelIndex, 1);
    sortedChannels.unshift(currentChannel);
  }
  
  return sortedChannels;
}
