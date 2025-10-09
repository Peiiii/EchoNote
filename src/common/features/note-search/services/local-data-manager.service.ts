import { BehaviorSubject, Observable, map } from "rxjs";
import { firebaseNotesService } from "@/common/services/firebase/firebase-notes.service";
import { firebaseAuthService } from "@/common/services/firebase/firebase-auth.service";
import type { Note, Channel, NoteFilters, ChannelFilters } from "../search.types";

interface DataStatus {
  isUpdating: boolean;
  lastUpdateTime: number;
  error?: string;
}

interface ChannelUpdateStatus {
  [channelId: string]: {
    lastUpdateTime: number;
    isUpdating: boolean;
  };
}

export class LocalDataManagerService {
  public readonly notes$ = new BehaviorSubject<Note[]>([]);
  public readonly channels$ = new BehaviorSubject<Channel[]>([]);
  public readonly updateStatus$ = new BehaviorSubject<DataStatus>({
    isUpdating: false,
    lastUpdateTime: 0,
  });
  public readonly channelUpdateStatus$ = new BehaviorSubject<ChannelUpdateStatus>({});
  // Basic freshness window to avoid refetching everything too often
  private static readonly STALE_MS = 60 * 60 * 1000; // 1 hour

  constructor() {
    this.loadFromCache();
  }

  getNotes(filters?: NoteFilters): Observable<Note[]> {
    return this.notes$.pipe(map(notes => this.filterNotes(notes, filters)));
  }

  getChannels(filters?: ChannelFilters): Observable<Channel[]> {
    return this.channels$.pipe(map(channels => this.filterChannels(channels, filters)));
  }

  getNoteById(id: string): Observable<Note | null> {
    return this.notes$.pipe(map(notes => notes.find(note => note.id === id) || null));
  }

  getUpdateStatus(): Observable<DataStatus> {
    return this.updateStatus$;
  }

  getChannelUpdateStatus(
    channelId: string
  ): Observable<{ lastUpdateTime: number; isUpdating: boolean } | null> {
    return this.channelUpdateStatus$.pipe(map(status => status[channelId] || null));
  }

  async updateAll(): Promise<void> {
    this.setUpdateStatus({ isUpdating: true, lastUpdateTime: 0 });
    try {
      const user = await firebaseAuthService.getCurrentUser();
      const userId = user?.uid;
      if (!userId) return;

      // Skip network if cache is fresh and we already have cached data
      const lastFullUpdate = this.getLastFullUpdateTime();
      const cacheFresh =
        lastFullUpdate && Date.now() - lastFullUpdate < LocalDataManagerService.STALE_MS;
      if (cacheFresh) {
        // Ensure cache is loaded into memory
        if (this.notes$.value.length === 0 || this.channels$.value.length === 0) {
          await this.loadFromCache();
        }
        this.setUpdateStatus({ isUpdating: false, lastUpdateTime: lastFullUpdate });
        return;
      }

      const channels = await firebaseNotesService.fetchChannels(userId);
      // Start from existing in-memory notes, or fall back to cached notes, to avoid "dropping to partial" during refresh
      let notes: Note[] = [];
      if (this.notes$.value.length > 0) {
        notes = [...this.notes$.value];
      } else {
        const cached = await this.loadFromIndexedDB();
        notes = [...cached.notes];
      }
      console.debug("[NoteSearch][updateAll] start", { channels: channels.length });

      for (const channel of channels) {
        // Per-channel freshness and presence check: only fetch missing or stale channels
        const lastUpdate = this.getChannelLastUpdateTime(channel.id);
        const channelFresh =
          lastUpdate && Date.now() - lastUpdate < LocalDataManagerService.STALE_MS;
        const hasChannelNotes = notes.some(n => n.channelId === channel.id);
        if (channelFresh && hasChannelNotes) {
          continue; // skip refresh for this channel
        }

        // Include both user and AI messages. Fall back to user-only if query/index not ready.
        let channelMessages: unknown[] = [];
        try {
          const channelNotes = await firebaseNotesService.fetchInitialMessagesAllSenders(
            userId,
            channel.id,
            1000
          );
          console.debug("[NoteSearch][updateAll] channel fetched (all senders)", {
            channelId: channel.id,
            count: channelNotes.messages.length,
          });
          channelMessages = channelNotes.messages as unknown[];
        } catch (err) {
          console.warn("[NoteSearch][updateAll] all-senders fetch failed, fallback to user-only", {
            channelId: channel.id,
            err,
          });
          const userOnly = await firebaseNotesService.fetchInitialMessages(
            userId,
            channel.id,
            1000
          );
          channelMessages = userOnly.messages as unknown[];
        }
        const convertedNotes = channelMessages.map((msg: unknown) => {
          const m = msg as {
            id: string;
            channelId: string;
            content: string;
            tags?: string[];
            aiAnalysis?: { summary?: string; keywords?: string[] };
            timestamp: Date;
            sender: string;
            isDeleted?: boolean;
          };
          return {
            id: m.id,
            channelId: m.channelId,
            content: m.content,
            tags: m.tags || [],
            aiAnalysis: m.aiAnalysis,
            timestamp: m.timestamp,
            sender: m.sender,
            isDeleted: m.isDeleted || false,
          };
        });
        // Upsert channel notes into the working set based on previous (cached) notes
        notes = notes.filter(n => n.channelId !== channel.id).concat(convertedNotes);
        this.notes$.next([...notes]); // incremental emission
        this.setChannelLastUpdateTime(channel.id, Date.now());
      }

      this.notes$.next(notes);
      this.channels$.next(channels);
      await this.saveToCache(notes, channels);
      this.setLastFullUpdateTime(Date.now());

      this.setUpdateStatus({ isUpdating: false, lastUpdateTime: Date.now() });
    } catch (error) {
      console.warn("[NoteSearch][updateAll] failed", error);
      this.setUpdateStatus({
        isUpdating: false,
        lastUpdateTime: Date.now(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async updateChannel(channelId: string): Promise<void> {
    this.setChannelUpdateStatus(channelId, { isUpdating: true, lastUpdateTime: 0 });
    try {
      const user = await firebaseAuthService.getCurrentUser();
      const userId = user?.uid;
      if (!userId) return;

      // Skip network if channel cache is fresh and we have some notes for this channel
      const lastUpdate = this.getChannelLastUpdateTime(channelId);
      const cacheFresh = lastUpdate && Date.now() - lastUpdate < LocalDataManagerService.STALE_MS;
      if (cacheFresh) {
        if (this.notes$.value.length === 0) await this.loadFromCache();
        const hasChannelNotes = this.notes$.value.some(n => n.channelId === channelId);
        if (hasChannelNotes) {
          this.setChannelUpdateStatus(channelId, { isUpdating: false, lastUpdateTime: lastUpdate });
          return;
        }
      }

      // Include both user and AI messages, fallback to user-only if needed
      console.debug("[NoteSearch][updateChannel] start", { channelId });
      let channelMessages: unknown[] = [];
      try {
        const channelNotes = await firebaseNotesService.fetchInitialMessagesAllSenders(
          userId,
          channelId,
          1000
        );
        console.debug("[NoteSearch][updateChannel] fetched (all senders)", {
          channelId,
          count: channelNotes.messages.length,
        });
        channelMessages = channelNotes.messages;
      } catch (err) {
        console.warn(
          "[NoteSearch][updateChannel] all-senders fetch failed, fallback to user-only",
          { channelId, err }
        );
        const userOnly = await firebaseNotesService.fetchInitialMessages(userId, channelId, 1000);
        channelMessages = userOnly.messages as unknown[];
      }
      const notes = channelMessages.map((msg: unknown) => {
        const m = msg as {
          id: string;
          channelId: string;
          content: string;
          tags?: string[];
          aiAnalysis?: { summary?: string; keywords?: string[] };
          timestamp: Date;
          sender: string;
          isDeleted?: boolean;
        };
        return {
          id: m.id,
          channelId: m.channelId,
          content: m.content,
          tags: m.tags || [],
          aiAnalysis: m.aiAnalysis,
          timestamp: m.timestamp,
          sender: m.sender,
          isDeleted: m.isDeleted || false,
        };
      });
      const currentNotes = this.notes$.value;
      const updatedNotes = currentNotes.filter(note => note.channelId !== channelId).concat(notes);

      this.notes$.next(updatedNotes);
      await this.saveNotesToCache(updatedNotes);
      this.setChannelLastUpdateTime(channelId, Date.now());

      this.setChannelUpdateStatus(channelId, { isUpdating: false, lastUpdateTime: Date.now() });
    } catch (_error) {
      console.warn("[NoteSearch][updateChannel] failed", _error);
      this.setChannelUpdateStatus(channelId, {
        isUpdating: false,
        lastUpdateTime: 0,
      });
    }
  }

  async forceUpdate(): Promise<void> {
    await this.updateAll();
  }

  private filterNotes(notes: Note[], filters?: NoteFilters): Note[] {
    if (!filters) return notes;

    return notes.filter(note => {
      if (filters.channelIds && !filters.channelIds.includes(note.channelId)) {
        return false;
      }
      if (filters.tags && !filters.tags.some(tag => note.tags.includes(tag))) {
        return false;
      }
      if (filters.sender && note.sender !== filters.sender) {
        return false;
      }
      if (filters.dateRange) {
        const noteDate = new Date(note.timestamp).getTime();
        if (filters.dateRange.start && noteDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && noteDate > filters.dateRange.end) {
          return false;
        }
      }
      return true;
    });
  }

  private filterChannels(channels: Channel[], filters?: ChannelFilters): Channel[] {
    if (!filters) return channels;

    return channels.filter(channel => {
      if (filters.ids && !filters.ids.includes(channel.id)) {
        return false;
      }
      if (filters.name && !channel.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  private setUpdateStatus(status: DataStatus): void {
    this.updateStatus$.next(status);
  }

  private setChannelUpdateStatus(
    channelId: string,
    status: { isUpdating: boolean; lastUpdateTime: number }
  ): void {
    const current = this.channelUpdateStatus$.value;
    this.channelUpdateStatus$.next({
      ...current,
      [channelId]: status,
    });
  }

  private async loadFromCache(): Promise<void> {
    try {
      const cachedData = await this.loadFromIndexedDB();
      if (cachedData.notes.length > 0) {
        this.notes$.next(cachedData.notes);
      }
      if (cachedData.channels.length > 0) {
        this.channels$.next(cachedData.channels);
      }
    } catch (error) {
      console.warn("Failed to load from cache:", error);
    }
  }

  private async saveToCache(notes: Note[], channels: Channel[]): Promise<void> {
    try {
      await this.saveToIndexedDB({ notes, channels });
    } catch (error) {
      console.warn("Failed to save to cache:", error);
    }
  }

  private async saveNotesToCache(notes: Note[]): Promise<void> {
    try {
      const current = await this.loadFromIndexedDB();
      await this.saveToIndexedDB({ ...current, notes });
    } catch (error) {
      console.warn("Failed to save notes to cache:", error);
    }
  }

  private async loadFromIndexedDB(): Promise<{ notes: Note[]; channels: Channel[] }> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("echonote_data", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("channels")) {
          db.createObjectStore("channels", { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["notes", "channels"], "readonly");
        const notesStore = transaction.objectStore("notes");
        const channelsStore = transaction.objectStore("channels");

        const notesRequest = notesStore.getAll();
        const channelsRequest = channelsStore.getAll();

        Promise.all([
          new Promise<Note[]>((res, rej) => {
            notesRequest.onsuccess = () => res(notesRequest.result);
            notesRequest.onerror = () => rej(notesRequest.error);
          }),
          new Promise<Channel[]>((res, rej) => {
            channelsRequest.onsuccess = () => res(channelsRequest.result);
            channelsRequest.onerror = () => rej(channelsRequest.error);
          }),
        ])
          .then(([notes, channels]) => {
            db.close();
            resolve({ notes, channels });
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async saveToIndexedDB(data: { notes: Note[]; channels: Channel[] }): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("echonote_data", 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("channels")) {
          db.createObjectStore("channels", { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(["notes", "channels"], "readwrite");
        const notesStore = transaction.objectStore("notes");
        const channelsStore = transaction.objectStore("channels");

        notesStore.clear();
        channelsStore.clear();

        data.notes.forEach(note => notesStore.add(note));
        data.channels.forEach(channel => channelsStore.add(channel));

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      };

      request.onerror = () => reject(request.error);
    });
  }

  // ---- Simple freshness tracking via localStorage (keeps module independent) ----
  private getLastFullUpdateTime(): number | null {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem("echonote_search_last_full_update");
    return v ? Number(v) : null;
  }

  private setLastFullUpdateTime(ts: number): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("echonote_search_last_full_update", String(ts));
  }

  private getChannelLastUpdateTime(channelId: string): number | null {
    if (typeof window === "undefined") return null;
    const v = window.localStorage.getItem(`echonote_search_channel_update_${channelId}`);
    return v ? Number(v) : null;
  }

  private setChannelLastUpdateTime(channelId: string, ts: number): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`echonote_search_channel_update_${channelId}`, String(ts));
  }
}

export const localDataManager = new LocalDataManagerService();

// Export getter methods for hooks
export const getUpdateStatus = () => localDataManager.getUpdateStatus();
export const getChannelUpdateStatus = (channelId: string) =>
  localDataManager.getChannelUpdateStatus(channelId);
export const getNotes = (filters?: NoteFilters) => localDataManager.getNotes(filters);
export const getChannels = (filters?: ChannelFilters) => localDataManager.getChannels(filters);
