export interface NoteSearchQuery {
  q: string;
  channelIds?: string[];
  limit?: number;
}

export interface NoteSearchMatch {
  id: string;
  channelId: string;
  score: number;
  snippet?: string;
  matchedFields: Array<'content' | 'tags' | 'keywords' | 'summary'>;
  timestamp: Date;
}

export interface INoteSearchEngine {
  search(query: NoteSearchQuery): Promise<NoteSearchMatch[]>;
  bootstrap(options: SearchBootstrapOptions): Promise<void>;
}

export interface SearchIndex {
  indexNotes(notes: Note[]): void;
  upsertNote(note: Note): void;
  upsertNotes(notes: Note[]): void;
  search(query: string, options?: SearchOptions): NoteSearchMatch[];
  getChannelDocCount(channelId: string): number;
  getIndexedChannelIds(): string[];
  getTotalDocs(): number;
}

export interface SearchOptions {
  channelIds?: string[];
  limit?: number;
}

export interface Note {
  id: string;
  channelId: string;
  content: string;
  tags: string[];
  aiAnalysis?: {
    summary?: string;
    keywords?: string[];
  };
  timestamp: Date;
  sender: string;
  isDeleted?: boolean;
}

export interface DataSource {
  listChannels(userId: string): Promise<Channel[]>;
  fetchRecentNotes(userId: string, channelId: string, limit: number): Promise<Note[]>;
}

export interface Channel {
  id: string;
  name: string;
}

export interface ChannelMetadata {
  refreshedAt: number;
  [key: string]: unknown;
}

export interface CacheService {
  saveNotes(notes: Note[], channelId?: string): Promise<void>;
  loadNotes(channelId?: string): Promise<Note[]>;
  saveChannelMetadata(channelId: string, metadata: ChannelMetadata): Promise<void>;
  loadChannelMetadata(): Promise<Map<string, ChannelMetadata>>;
  isChannelFresh(channelId: string): boolean;
  markChannelRefreshed(channelId: string): Promise<void>;
}

export interface SearchProgress {
  onStart?: (total: number) => void;
  onStep?: (done: number, total: number) => void;
}

export interface SearchBootstrapOptions {
  perChannelLimit?: number;
  channelLimit?: number;
  onStart?: (total: number) => void;
  onStep?: (done: number, total: number) => void;
}

export interface NoteFilters {
  channelIds?: string[];
  tags?: string[];
  sender?: string;
  dateRange?: {
    start: number;
    end: number;
  };
}

export interface ChannelFilters {
  ids?: string[];
  name?: string;
}
