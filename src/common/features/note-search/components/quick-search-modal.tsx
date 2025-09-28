import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/common/components/ui/dialog';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
import { Button } from '@/common/components/ui/button';
import { Search as SearchIcon, X } from 'lucide-react';
import { noteSearchService, type NoteSearchMatch } from '@/common/features/note-search/services/note-search.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';
import { useNotesViewStore } from '@/core/stores/notes-view.store';
import { READ_MORE_SELECTORS } from '@/common/features/read-more/core/dom-constants';
import { useQuickSearchModalStore } from './quick-search-modal.store';
import { useValueFromObservable } from '@/common/features/note-search/hooks/use-value-from-observable';

export function QuickSearchModal() {
  const open = useQuickSearchModalStore(s => s.open);
  const setOpen = useQuickSearchModalStore(s => s.setOpen);
  const { currentChannelId, setCurrentChannel } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);

  const [q, setQ] = useState('');
  const [scope, setScope] = useState<'all' | 'current'>('current');
  const [results, setResults] = useState<NoteSearchMatch[]>([]);
  const [indexing, setIndexing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const channelIds = useMemo(() => scope === 'current' && currentChannelId ? [currentChannelId] : undefined, [scope, currentChannelId]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
    if (!open) {
      setQ('');
      setResults([]);
      setIndexing(false);
    }
  }, [open]);

  // When switching to All scope and modal is open, proactively build global index
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!open) return;
      if (scope !== 'all') return;
      setIndexing(true);
      // Fetch all channels + messages into local cache and index them.
      await noteSearchService.updateAllData();
      await noteSearchService.preIndexData();
      if (!cancelled) setIndexing(false);
    })();
    return () => { cancelled = true; };
  }, [open, scope]);

  // When using Current scope, ensure the current channel data is available and pre-indexed
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!open) return;
      if (scope !== 'current') return;
      if (!currentChannelId) return;
      console.debug('[QuickSearch] current scope pre-index start', { currentChannelId });
      setIndexing(true);
      await noteSearchService.updateChannelData(currentChannelId);
      await noteSearchService.preIndexChannel(currentChannelId);
      const stats = noteSearchService.getIndexStats();
      console.debug('[QuickSearch] current scope pre-index done', { stats });
      if (!cancelled) setIndexing(false);
    })();
    return () => { cancelled = true; };
  }, [open, scope, currentChannelId]);

  // Subscribe to index stats to show lightweight progress
  const indexStats = useValueFromObservable(() => noteSearchService.getIndexStats$(), { totalDocs: 0, indexedChannelIds: [] });

  const searchResults$ = useMemo(() => noteSearchService.search(q, { channelIds }), [q, channelIds]);
  const obsResults = useValueFromObservable(() => searchResults$, [] as NoteSearchMatch[]);
  useEffect(() => {
    setResults(obsResults);
    if (q) {
      console.debug('[QuickSearch] search results', { q, scope, channelIds, count: obsResults.length });
    }
  }, [obsResults, q, scope, channelIds]);

  const channelName = (id: string) => channels.find(c => c.id === id)?.name || id;

  const handlePick = (noteId: string, channelId: string) => {
    setOpen(false);
    if (channelId && currentChannelId !== channelId) {
      setCurrentChannel(channelId);
      setTimeout(() => scrollToNote(noteId), 300);
    } else {
      scrollToNote(noteId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
      <DialogContent showCloseButton={false} className="p-0 w-[96vw] sm:max-w-xl">
        <div className="px-3 pt-3 pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={scope === 'current' ? 'Search in current space…' : 'Search all spaces…'}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-8 pr-8 h-9"
              />
              {q && (
                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground" onClick={() => setQ('')}>
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="shrink-0 inline-flex items-center gap-1">
              <Button variant={scope === 'current' ? 'default' : 'outline'} size="sm" onClick={() => setScope('current')}>Current</Button>
              <Button variant={scope === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setScope('all')}>All</Button>
            </div>
          </div>
          {scope === 'all' && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>
                {indexing ? 'Indexing all spaces… ' : 'Indexed: '}
                {indexStats.totalDocs} docs in {indexStats.indexedChannelIds.length} spaces
              </span>
            </div>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {!q ? (
            <div className="text-xs text-muted-foreground px-3 py-6">Type to search notes…</div>
          ) : results.length === 0 ? (
            <div className="text-xs text-muted-foreground px-3 py-6">No matches</div>
          ) : (
            results.map(r => (
              <button key={r.id} className="w-full text-left px-3 py-2 hover:bg-accent/50" onClick={() => handlePick(r.id, r.channelId)}>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <Badge variant="secondary" className="shrink-0">{channelName(r.channelId)}</Badge>
                  <span>{new Date(r.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-sm text-foreground/90 line-clamp-2 mt-0.5">{r.snippet || '(no preview)'}</div>
                {r.matchedFields.length > 0 && (
                  <div className="mt-1 text-[10px] text-muted-foreground">{r.matchedFields.join(', ')}</div>
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function scrollToNote(noteId: string) {
  try {
    const selector = READ_MORE_SELECTORS.messageById(noteId);
    const el = document.querySelector(selector);
    if (el) (el as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (_e) {
    // ignore
  }
}
