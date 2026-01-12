const RECENT_CHANNELS_STORAGE_KEY = "stillroot-recent-channels";
const MAX_RECENT_CHANNELS = 8;

interface RecentChannelEntry {
  channelId: string;
  accessedAt: number;
}

export function addRecentChannel(channelId: string): void {
  try {
    const stored = localStorage.getItem(RECENT_CHANNELS_STORAGE_KEY);
    let recent: RecentChannelEntry[] = stored ? JSON.parse(stored) : [];
    
    recent = recent.filter(entry => entry.channelId !== channelId);
    
    recent.unshift({
      channelId,
      accessedAt: Date.now(),
    });
    
    recent = recent.slice(0, MAX_RECENT_CHANNELS);
    
    localStorage.setItem(RECENT_CHANNELS_STORAGE_KEY, JSON.stringify(recent));
  } catch (error) {
    console.warn("Failed to save recent channel", error);
  }
}

export function getRecentChannelIds(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_CHANNELS_STORAGE_KEY);
    if (!stored) return [];
    
    const recent: RecentChannelEntry[] = JSON.parse(stored);
    return recent.map(entry => entry.channelId);
  } catch (error) {
    console.warn("Failed to load recent channels", error);
    return [];
  }
}

export function removeRecentChannel(channelId: string): void {
  try {
    const stored = localStorage.getItem(RECENT_CHANNELS_STORAGE_KEY);
    if (!stored) return;
    
    const recent: RecentChannelEntry[] = JSON.parse(stored);
    const filtered = recent.filter(entry => entry.channelId !== channelId);
    
    localStorage.setItem(RECENT_CHANNELS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn("Failed to remove recent channel", error);
  }
}

