import type { Note, SearchIndex, SearchOptions, NoteSearchMatch } from '../search.types';

export class InMemorySearchIndex implements SearchIndex {
  private docs = new Map<string, Note>();
  private byChannelCount = new Map<string, number>();

  indexNotes(notes: Note[]): void {
    this.docs.clear();
    this.byChannelCount.clear();
    
    for (const note of notes) {
      if (!note.isDeleted) {
        this.docs.set(note.id, note);
        this.byChannelCount.set(
          note.channelId, 
          (this.byChannelCount.get(note.channelId) || 0) + 1
        );
      }
    }
  }

  upsertNote(note: Note): void {
    const previous = this.docs.get(note.id);
    
    if (!note.isDeleted) {
      this.docs.set(note.id, note);
      if (!previous) {
        this.byChannelCount.set(
          note.channelId, 
          (this.byChannelCount.get(note.channelId) || 0) + 1
        );
      }
    } else {
      this.docs.delete(note.id);
      if (previous) {
        const count = (this.byChannelCount.get(previous.channelId) || 1) - 1;
        if (count > 0) {
          this.byChannelCount.set(previous.channelId, count);
        } else {
          this.byChannelCount.delete(previous.channelId);
        }
      }
    }
  }

  upsertNotes(notes: Note[]): void {
    for (const note of notes) {
      this.upsertNote(note);
    }
  }

  search(query: string, options?: SearchOptions): NoteSearchMatch[] {
    const searchQuery = (query || '').trim().toLowerCase();
    if (!searchQuery) return [];

    const channelsFilter = options?.channelIds ? new Set(options.channelIds) : null;
    const results: NoteSearchMatch[] = [];

    for (const note of this.docs.values()) {
      if (channelsFilter && !channelsFilter.has(note.channelId)) continue;

      const match = this.scoreNote(note, searchQuery);
      if (match.score > 0) {
        results.push(match);
      }
    }

    results.sort((a, b) => 
      b.score - a.score || b.timestamp.getTime() - a.timestamp.getTime()
    );

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  getChannelDocCount(channelId: string): number {
    return this.byChannelCount.get(channelId) || 0;
  }

  getIndexedChannelIds(): string[] {
    return Array.from(this.byChannelCount.keys());
  }

  getTotalDocs(): number {
    return this.docs.size;
  }

  private scoreNote(note: Note, query: string): NoteSearchMatch {
    const matchedFields: NoteSearchMatch['matchedFields'] = [];
    let score = 0;

    const content = (note.content || '').toLowerCase();
    const contentHits = this.countOccurrences(content, query);
    if (contentHits > 0) {
      matchedFields.push('content');
      score += contentHits * 10;
    }

    const tags = (note.tags || []).map((tag: string) => tag.toLowerCase());
    const tagsHits = tags.filter((tag: string) => tag.includes(query)).length;
    if (tagsHits > 0) {
      matchedFields.push('tags');
      score += tagsHits * 6;
    }

    const keywords = (note.aiAnalysis?.keywords || []).map((keyword: string) => keyword.toLowerCase());
    const keywordsHits = keywords.filter((keyword: string) => keyword.includes(query)).length;
    if (keywordsHits > 0) {
      matchedFields.push('keywords');
      score += keywordsHits * 5;
    }

    const summary = (note.aiAnalysis?.summary || '').toLowerCase();
    const summaryHits = this.countOccurrences(summary, query);
    if (summaryHits > 0) {
      matchedFields.push('summary');
      score += summaryHits * 3;
    }

    return {
      id: note.id,
      channelId: note.channelId,
      score,
      snippet: this.buildSnippet(note.content, query),
      matchedFields,
      timestamp: note.timestamp,
    };
  }

  private countOccurrences(text: string, needle: string): number {
    if (!text || !needle) return 0;
    
    let count = 0;
    let index = 0;
    
    while ((index = text.indexOf(needle, index)) !== -1) {
      count++;
      index += needle.length;
    }
    
    return count;
  }

  private buildSnippet(content: string, query: string): string | undefined {
    const text = content || '';
    const lower = text.toLowerCase();
    const queryIndex = lower.indexOf(query);
    
    if (queryIndex === -1) return undefined;
    
    const start = Math.max(0, queryIndex - 30);
    const end = Math.min(text.length, queryIndex + query.length + 30);
    
    const snippet = text.slice(start, end);
    const prefix = start > 0 ? '…' : '';
    const suffix = end < text.length ? '…' : '';
    
    return prefix + snippet + suffix;
  }
}
