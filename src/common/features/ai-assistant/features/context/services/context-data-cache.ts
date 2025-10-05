import { firebaseNotesService } from "@/common/services/firebase/firebase-notes.service";
import type { Message, Channel } from "@/core/stores/notes-data.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";

export type ChannelContextSnapshot = {
  channel?: Channel | null;
  messages: Message[];
  lastFetched: number;
  fetching: boolean;
};

/**
 * Lightweight cache for channel context data. Decoupled from UI message stores.
 * - Fetches directly from Firebase services
 * - Provides sync snapshot for agent contexts; triggers async fetch on first access
 */
export class ContextDataCache {
  private cache = new Map<string, ChannelContextSnapshot>();
  private readonly LIMIT = 50; // fetch up to N recent user messages
  private topIds: string[] = [];
  private topFetched = 0;
  private channelListeners = new Map<string, Set<() => void>>();
  private topListeners = new Set<() => void>();
  // Full index for "all" mode so we don't depend on what the UI has loaded
  private allMetas: Channel[] = [];
  private allFetchedAt = 0;
  private allFetching = false;
  private allListeners = new Set<() => void>();

  getSnapshot(channelId: string): ChannelContextSnapshot {
    const snap = this.cache.get(channelId);
    if (snap) return snap;
    const empty: ChannelContextSnapshot = { channel: null, messages: [], lastFetched: 0, fetching: false };
    this.cache.set(channelId, empty);
    // kick off fetch lazily
    void this.ensureFetched(channelId);
    return empty;
  }

  async ensureFetched(channelId: string) {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;
    const existing = this.cache.get(channelId);
    if (existing?.fetching) return;
    const now = Date.now();
    if (existing && now - existing.lastFetched < 2*60*60*1000) {
      // throttle
      return;
    }
    const next: ChannelContextSnapshot = existing || { channel: null, messages: [], lastFetched: 0, fetching: false };
    next.fetching = true;
    this.cache.set(channelId, next);
    try {
      // fetch channel meta (name, counts)
      const channel = await firebaseNotesService.getChannel(userId, channelId);
      // fetch last N messages (user notes)
      const { messages } = await firebaseNotesService.fetchInitialMessages(userId, channelId, this.LIMIT);
      // sort asc by time for readability
      messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      this.cache.set(channelId, { channel, messages, lastFetched: Date.now(), fetching: false });
      this.notifyChannel(channelId);
    } catch (e) {
      console.warn("[ContextDataCache] ensureFetched failed", e);
      this.cache.set(channelId, { channel: next.channel || null, messages: next.messages || [], lastFetched: Date.now(), fetching: false });
      this.notifyChannel(channelId);
    }
  }

  getTopIdsSnapshot(limit = 5): string[] {
    if (this.topIds.length === 0) return [];
    return this.topIds.slice(0, limit);
  }

  async ensureTopIds(limit = 5): Promise<void> {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;
    try {
      const now = Date.now();
      if (now - this.topFetched < 15_000 && this.topIds.length >= limit) return; // throttle
      const list = await firebaseNotesService.fetchChannels(userId);
      const sorted = [...list].sort((a, b) => (b.messageCount || 0) - (a.messageCount || 0));
      this.topIds = sorted.map(c => c.id);
      this.topFetched = Date.now();
      this.notifyTop();
    } catch (e) {
      console.warn("[ContextDataCache] getTopChannelIdsForAll failed", e);
      // keep previous topIds if any
    }
  }

  /**
   * Return a snapshot of all channel metadata currently known to the cache.
   * This list is independent from UI store and comes from firebaseNotesService.fetchChannels.
   */
  getAllMetasSnapshot(): Channel[] {
    return this.allMetas.slice();
  }

  /**
   * Return a snapshot of all channel ids currently known to the cache.
   */
  getAllIdsSnapshot(): string[] {
    if (!this.allMetas.length) return [];
    return this.allMetas.map(c => c.id);
  }

  /**
   * Ensure we have fetched the full list of channels for the current user.
   * Throttled to avoid excessive reads.
   */
  async ensureAllMetas(): Promise<void> {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;
    const now = Date.now();
    if (this.allFetching) return;
    if (now - this.allFetchedAt < 15_000 && this.allMetas.length) return;

    this.allFetching = true;
    try {
      const list = await firebaseNotesService.fetchChannels(userId);
      // Sort by last active first for more relevant prefetch ordering
      this.allMetas = [...list].sort((a, b) => (b.lastMessageTime?.getTime() || 0) - (a.lastMessageTime?.getTime() || 0));
      this.allFetchedAt = Date.now();
      this.notifyAll();
    } catch (e) {
      console.warn("[ContextDataCache] ensureAllMetas failed", e);
    } finally {
      this.allFetching = false;
    }
  }

  /**
   * Prefetch messages for many channels with simple concurrency control.
   * Use this in "all" mode to progressively hydrate cache without blocking UI.
   */
  async prefetchAllChannelsMessages(concurrency = 4, limit?: number): Promise<void> {
    const ids = this.getAllIdsSnapshot();
    const target = typeof limit === 'number' ? ids.slice(0, Math.max(0, limit)) : ids;
    let index = 0;
    const workers = new Array(Math.min(concurrency, target.length)).fill(0).map(async () => {
      while (index < target.length) {
        const id = target[index++];
        try {
          await this.ensureFetched(id);
        } catch (_e) {
          // ignore individual failures; continue
        }
      }
    });
    await Promise.all(workers);
  }

  onChannelUpdate(channelId: string, cb: () => void): () => void {
    const set = this.channelListeners.get(channelId) || new Set<() => void>();
    set.add(cb);
    this.channelListeners.set(channelId, set);
    return () => {
      const curr = this.channelListeners.get(channelId);
      if (!curr) return;
      curr.delete(cb);
      if (curr.size === 0) this.channelListeners.delete(channelId);
    };
  }

  onTopIdsUpdate(cb: () => void): () => void {
    this.topListeners.add(cb);
    return () => this.topListeners.delete(cb);
  }

  private notifyChannel(channelId: string) {
    const set = this.channelListeners.get(channelId);
    if (!set) return;
    set.forEach(fn => { try { fn(); } catch (_error) { /* ignore errors */ } });
  }

  private notifyTop() {
    this.topListeners.forEach(fn => { try { fn(); } catch (_error) { /* ignore errors */ } });
  }

  private notifyAll() {
    this.allListeners.forEach(fn => { try { fn(); } catch (_error) { /* ignore errors */ } });
  }

  onAllMetasUpdate(cb: () => void): () => void {
    this.allListeners.add(cb);
    return () => this.allListeners.delete(cb);
  }
}

export const contextDataCache = new ContextDataCache();
