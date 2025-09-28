import { useEffect, useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/common/components/ui/dialog';
import { Input } from '@/common/components/ui/input';
import { Badge } from '@/common/components/ui/badge';
// import { Button } from '@/common/components/ui/button';
import { Search as SearchIcon, X } from 'lucide-react';
import { noteSearchService, type NoteSearchMatch } from '@/common/features/note-search/services/note-search.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';
import { useNotesViewStore } from '@/core/stores/notes-view.store';
// import { READ_MORE_SELECTORS } from '@/common/features/read-more/core/dom-constants';
import { rxEventBusService } from '@/common/services/rx-event-bus.service';
import { useQuickSearchModalStore } from './quick-search-modal.store';
import { useValueFromObservable } from '@/common/features/note-search/hooks/use-value-from-observable';

export function QuickSearchModal() {
  const open = useQuickSearchModalStore(s => s.open);
  const setOpen = useQuickSearchModalStore(s => s.setOpen);
  const { currentChannelId } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);

  const [q, setQ] = useState('');
  const [scope, setScope] = useState<'all' | 'current'>('current');
  const [results, setResults] = useState<NoteSearchMatch[]>([]);
  const [indexing, setIndexing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const channelIds = useMemo(() => scope === 'current' && currentChannelId ? [currentChannelId] : undefined, [scope, currentChannelId]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0);
    if (!open) {
      setQ('');
      setResults([]);
      setIndexing(false);
      setActiveIndex(0);
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

  // Keyboard navigation: ArrowUp/ArrowDown/Enter/Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, Math.max(0, results.length - 1))); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(0, i - 1)); return; }
      if (e.key === 'Tab') { e.preventDefault(); setScope(s => s === 'current' ? 'all' : 'current'); return; }
      if (e.key === 'Enter') { if (results[activeIndex]) { e.preventDefault(); const r = results[activeIndex]; handlePick(r.id, r.channelId); } }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, activeIndex]);

  // Subscribe to index stats to show lightweight progress
  const indexStats = useValueFromObservable(noteSearchService.getIndexStats$(), { totalDocs: 0, indexedChannelIds: [] });

  const searchResults$ = useMemo(() => noteSearchService.search(q, { channelIds }), [q, channelIds]);
  const obsResults = useValueFromObservable(searchResults$, [] as NoteSearchMatch[]);
  useEffect(() => {
    setResults(obsResults);
    setActiveIndex(0);
    if (q) {
      console.debug('[QuickSearch] search results', { q, scope, channelIds, count: obsResults.length });
    }
  }, [obsResults, q, scope, channelIds]);

  // Keep the active item in view when navigating
  useEffect(() => {
    const id = results[activeIndex]?.id;
    if (!id) return;
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, results]);

  const channelName = (id: string) => channels.find(c => c.id === id)?.name || id;

  const handlePick = (noteId: string, channelId: string) => {
    setOpen(false);
    rxEventBusService.requestJumpToMessage$.emit({ channelId, messageId: noteId });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
      <DialogContent showCloseButton={false} className="p-0 w-[96vw] sm:max-w-2xl sm:top-[12vh] sm:translate-y-0">
        <div className="px-4 pt-4 pb-3 border-b">
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
            <div className="shrink-0 inline-flex items-center">
              <div role="radiogroup" aria-label="Scope" className="inline-flex items-center rounded-md border bg-muted p-0.5">
                <button
                  role="radio"
                  aria-checked={scope === 'current'}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${scope === 'current' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setScope('current')}
                >
                  Current
                </button>
                <button
                  role="radio"
                  aria-checked={scope === 'all'}
                  className={`px-3 py-1.5 text-xs rounded-md transition-colors ${scope === 'all' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setScope('all')}
                >
                  All
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 h-5 text-xs text-muted-foreground flex items-center gap-2">
            {scope === 'all' ? (
              <>
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>
                  {indexing ? 'Indexing all spaces… ' : 'Indexed: '} 
                  {indexStats.totalDocs} docs in {indexStats.indexedChannelIds.length} spaces
                </span>
              </>
            ) : (
              <span className="text-muted-foreground/90">Searching in <span className="font-medium">{channelName(currentChannelId || '') || 'current space'}</span>. Press Tab to switch.</span>
            )}
          </div>
        </div>
        <div ref={listRef} className="max-h-[56vh] overflow-y-auto py-2" role="listbox" aria-activedescendant={results[activeIndex]?.id}>
          {!q ? (
            <div className="text-xs text-muted-foreground px-4 py-6">Type to search notes…</div>
          ) : results.length === 0 ? (
            <div className="text-xs text-muted-foreground px-4 py-6">No matches</div>
          ) : (
            results.map((r, idx) => (
              <button
                key={r.id}
                id={r.id}
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                className={`w-full text-left px-4 py-2 hover:bg-accent/50 focus:outline-none transition-colors ${idx === activeIndex ? 'bg-accent/60' : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handlePick(r.id, r.channelId)}
              >
                <div className="text-xs text-muted-foreground flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant="secondary" className="shrink-0">{channelName(r.channelId)}</Badge>
                    <span className="truncate">{r.matchedFields.join(', ')}</span>
                  </div>
                  <span className="whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-foreground/90 line-clamp-2 mt-0.5">{r.snippet ? <Highlight text={r.snippet} query={q} /> : '(no preview)'}</div>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">↑/↓ Select • Enter Open • Esc Close</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// reserved: handled by NotesPage via rxEventBusService.requestJumpToMessage$

// Highlight matched query segments (case-insensitive), similar to Spotlight/Google
function Highlight({ text, query }: { text: string; query: string }) {
  if (!text || !query) return <>{text}</>;
  const safe = escapeRegExp(query);
  try {
    const re = new RegExp(`(${safe})`, 'ig');
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) => (
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200/80 dark:bg-yellow-600/50 text-foreground rounded px-0.5">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        ))}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
