import {
  BehaviorSubject,
  Observable,
  combineLatest,
  firstValueFrom,
  map,
  debounceTime,
  distinctUntilChanged,
} from "rxjs";
import type { Note, NoteFilters, NoteSearchMatch } from "../search.types";
import { localDataManager } from "./local-data-manager.service";
import { InMemorySearchIndex } from "./search-index.service";

// Simple configuration constants
const SEARCH_CONFIG = {
  scoring: {
    contentWeight: 10,
    tagsWeight: 6,
    keywordsWeight: 5,
    summaryWeight: 3,
  },
  limits: {
    defaultPerChannel: 120,
    maxChannels: 32,
    maxResults: 50,
  },
  cache: {
    staleTimeMs: 60 * 60 * 1000, // 1 hour
  },
  ui: {
    debounceMs: 150,
    minQueryLength: 1,
  },
} as const;

export class NoteSearchService {
  private searchIndex: InMemorySearchIndex;
  private searchQuery$ = new BehaviorSubject<string>("");
  private searchFilters$ = new BehaviorSubject<NoteFilters>({});
  private indexStats$ = new BehaviorSubject<{ totalDocs: number; indexedChannelIds: string[] }>({
    totalDocs: 0,
    indexedChannelIds: [],
  });
  private indexedDataHash = "";
  private isIndexing = false;

  constructor() {
    this.searchIndex = new InMemorySearchIndex();
    this.initializeIndex();
  }

  search(query: string, filters?: NoteFilters): Observable<NoteSearchMatch[]> {
    this.searchQuery$.next(query);
    if (filters) {
      this.searchFilters$.next(filters);
    }

    return combineLatest([
      localDataManager.getNotes(this.searchFilters$.value),
      this.searchQuery$.pipe(debounceTime(SEARCH_CONFIG.ui.debounceMs), distinctUntilChanged()),
    ]).pipe(
      map(([notes, searchQuery]) => {
        if (!searchQuery || searchQuery.trim().length < SEARCH_CONFIG.ui.minQueryLength) {
          return [];
        }

        this.updateIndexIfNeeded(notes);
        return this.searchIndex.search(searchQuery, {
          channelIds: this.searchFilters$.value.channelIds,
          limit: SEARCH_CONFIG.limits.maxResults,
        });
      })
    );
  }

  async updateAllData(): Promise<void> {
    await localDataManager.updateAll();
  }

  async updateChannelData(channelId: string): Promise<void> {
    await localDataManager.updateChannel(channelId);
  }

  async preIndexData(): Promise<void> {
    if (this.isIndexing) return;

    this.isIndexing = true;
    try {
      const notes = await firstValueFrom(localDataManager.getNotes());

      if (notes) {
        this.searchIndex.indexNotes(notes);
        this.indexedDataHash = this.calculateDataHash(notes);
        this.updateIndexStats();
      }
    } finally {
      this.isIndexing = false;
    }
  }

  async preIndexChannel(channelId: string): Promise<void> {
    if (this.isIndexing) return;

    this.isIndexing = true;
    try {
      const notes = await firstValueFrom(localDataManager.getNotes({ channelIds: [channelId] }));

      if (notes) {
        this.searchIndex.upsertNotes(notes);
        const allNotes = await firstValueFrom(localDataManager.getNotes());
        this.indexedDataHash = this.calculateDataHash(allNotes);
        this.updateIndexStats();
      }
    } finally {
      this.isIndexing = false;
    }
  }

  getIndexStats() {
    return {
      totalDocs: this.searchIndex.getTotalDocs(),
      indexedChannelIds: this.searchIndex.getIndexedChannelIds(),
    };
  }

  getIndexStats$() {
    return this.indexStats$.asObservable();
  }

  private initializeIndex(): void {
    localDataManager.getNotes().subscribe(notes => {
      this.updateIndexIfNeeded(notes);
      const stats = this.getIndexStats();
      if (typeof window !== "undefined") {
        console.debug("[NoteSearchService] notes updated, index stats", stats);
      }
    });
  }

  private updateIndexIfNeeded(notes: unknown[]): void {
    const currentHash = this.calculateDataHash(notes);
    if (currentHash !== this.indexedDataHash) {
      this.searchIndex.indexNotes(notes as Note[]);
      this.indexedDataHash = currentHash;
      this.updateIndexStats();
    }
  }

  private updateIndexStats(): void {
    this.indexStats$.next({
      totalDocs: this.searchIndex.getTotalDocs(),
      indexedChannelIds: this.searchIndex.getIndexedChannelIds(),
    });
  }

  private calculateDataHash(notes: unknown[]): string {
    const dataString = JSON.stringify(
      notes.map((note: unknown) => {
        const n = note as {
          id: string;
          content: string;
          tags: string[];
          aiAnalysis?: { summary?: string; keywords?: string[] };
          timestamp: Date;
        };
        return {
          id: n.id,
          content: n.content,
          tags: n.tags,
          aiAnalysis: n.aiAnalysis,
          timestamp: n.timestamp,
        };
      })
    );

    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}

export const noteSearchService = new NoteSearchService();

export type {
  NoteSearchMatch,
  NoteSearchQuery,
  SearchBootstrapOptions,
  NoteFilters,
} from "../search.types";
