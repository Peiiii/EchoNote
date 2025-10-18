import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/common/components/ui/input";
import { Badge } from "@/common/components/ui/badge";
import { Search as SearchIcon, X } from "lucide-react";
import {
  noteSearchService,
  type NoteSearchMatch,
} from "@/common/features/note-search/services/note-search.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { useValueFromObservable } from "@/common/features/note-search/hooks/use-value-from-observable";

interface QuickSearchContentProps {
  onClose: () => void;
}

export function QuickSearchContent({ onClose }: QuickSearchContentProps) {
  const { currentChannelId } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);

  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "current">("current");
  const [results, setResults] = useState<NoteSearchMatch[]>([]);
  const [indexing, setIndexing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const channelIds = useMemo(
    () => (scope === "current" && currentChannelId ? [currentChannelId] : undefined),
    [scope, currentChannelId]
  );

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  // When switching to All scope and modal is open, proactively build global index
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (scope !== "all") return;
      setIndexing(true);
      await noteSearchService.updateAllData();
      await noteSearchService.preIndexData();
      if (!cancelled) setIndexing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [scope]);

  // When using Current scope, ensure the current channel data is available and pre-indexed
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (scope !== "current") return;
      if (!currentChannelId) return;
      console.debug("[QuickSearch] current scope pre-index start", { currentChannelId });
      setIndexing(true);
      await noteSearchService.updateChannelData(currentChannelId);
      await noteSearchService.preIndexChannel(currentChannelId);
      const stats = noteSearchService.getIndexStats();
      console.debug("[QuickSearch] current scope pre-index done", { stats });
      if (!cancelled) setIndexing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [scope, currentChannelId]);

  // Keyboard navigation: ArrowUp/ArrowDown/Enter/Escape/Tab
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, Math.max(0, results.length - 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(i => Math.max(0, i - 1));
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        setScope(s => (s === "current" ? "all" : "current"));
        return;
      }
      if (e.key === "Enter") {
        if (results[activeIndex]) {
          e.preventDefault();
          const r = results[activeIndex];
          handlePick(r.id, r.channelId);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, activeIndex, onClose]);

  // Mobile: Handle swipe gestures for scope switching
  useEffect(() => {
    let startY = 0;
    let startX = 0;
    let isSwipe = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      isSwipe = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipe) {
        const deltaY = Math.abs(e.touches[0].clientY - startY);
        const deltaX = Math.abs(e.touches[0].clientX - startX);
        isSwipe = deltaX > deltaY && deltaX > 10;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isSwipe) {
        const deltaX = e.changedTouches[0].clientX - startX;
        if (Math.abs(deltaX) > 50) {
          e.preventDefault();
          setScope(s => (s === "current" ? "all" : "current"));
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Subscribe to index stats to show lightweight progress
  const indexStats = useValueFromObservable(noteSearchService.getIndexStats$(), {
    totalDocs: 0,
    indexedChannelIds: [],
  });

  const searchResults$ = useMemo(
    () => noteSearchService.search(q, { channelIds }),
    [q, channelIds]
  );
  const obsResults = useValueFromObservable(searchResults$, [] as NoteSearchMatch[]);
  useEffect(() => {
    setResults(obsResults);
    setActiveIndex(0);
    if (q) {
      console.debug("[QuickSearch] search results", {
        q,
        scope,
        channelIds,
        count: obsResults.length,
      });
    }
  }, [obsResults, q, scope, channelIds]);

  // Keep the active item in view when navigating
  useEffect(() => {
    const id = results[activeIndex]?.id;
    if (!id) return;
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, results]);

  const channelName = (id: string) => channels.find(c => c.id === id)?.name || id;

  const handlePick = (noteId: string, channelId: string) => {
    onClose();
    rxEventBusService.requestJumpToMessage$.emit({ channelId, messageId: noteId });
  };

  // Mobile: Handle pull-to-refresh for search results
  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await noteSearchService.updateAllData();
      await noteSearchService.preIndexData();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex flex-col w-screen max-w-none h-svh sm:max-w-2xl sm:h-auto sm:max-h-[80vh]">
      {/* Mobile: Full-screen header with safe area */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        {/* Mobile: Status bar spacer */}
        <div className="h-[env(safe-area-inset-top)] sm:hidden" />

        {/* Search header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {/* Row 1: Search input (left) + Exit (right) */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                placeholder={scope === "current" ? "Search current space…" : "Search all spaces…"}
                value={q}
                onChange={e => setQ(e.target.value)}
                className="pl-10 pr-10 h-10 text-sm sm:h-9 sm:text-sm w-full"
              />
              {q && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground transition-colors"
                  onClick={() => setQ("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              Exit
            </button>
          </div>

          {/* Row 2: Status (left) + Scope toggle (right) */}
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="text-xs text-muted-foreground">
              {scope === "all" ? (
                <span>
                  <span className="inline-block w-2 h-2 mr-2 align-middle rounded-full bg-primary animate-pulse" />
                  {indexing ? "Indexing all spaces… " : "Indexed: "}
                  {indexStats.totalDocs} docs in {indexStats.indexedChannelIds.length} spaces
                </span>
              ) : (
                <span className="text-muted-foreground/90">
                  Searching in{" "}
                  <span className="font-medium text-foreground">
                    {channelName(currentChannelId || "") || "current space"}
                  </span>
                </span>
              )}
            </div>
            <div className="shrink-0">
              <div
                role="radiogroup"
                aria-label="Search scope"
                className="inline-flex items-center rounded-md border bg-muted p-0.5"
              >
                <button
                  role="radio"
                  aria-checked={scope === "current"}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all duration-200 ${
                    scope === "current"
                      ? "bg-background shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setScope("current")}
                >
                  Current
                </button>
                <button
                  role="radio"
                  aria-checked={scope === "all"}
                  className={`px-3 py-1.5 text-xs rounded-sm transition-all duration-200 ${
                    scope === "all"
                      ? "bg-background shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setScope("all")}
                >
                  All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results area - Always fill remaining space */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto overscroll-contain flex flex-col"
        role="listbox"
        aria-activedescendant={results[activeIndex]?.id}
      >
        {!q ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <SearchIcon className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-base font-medium text-foreground mb-2">Search your notes</p>
            <p className="text-sm text-muted-foreground mb-4">
              Type to search across {scope === "current" ? "current space" : "all spaces"}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>Swipe left/right to switch scope</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <SearchIcon className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-base font-medium text-foreground mb-2">No matches found</p>
            <p className="text-sm text-muted-foreground mb-4">
              Try different keywords or search in all spaces
            </p>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-xs px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing..." : "Refresh Search"}
            </button>
          </div>
        ) : (
          <div className="flex-1 py-1">
            {results.map((r, idx) => (
              <button
                key={r.id}
                id={r.id}
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                className={`w-full text-left px-4 py-4 hover:bg-accent/50 focus:outline-none transition-all duration-200 border-b border-border/30 last:border-b-0 active:scale-[0.98] ${
                  idx === activeIndex ? "bg-accent/60 shadow-sm" : ""
                }`}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => handlePick(r.id, r.channelId)}
              >
                {/* Header with channel and time */}
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge
                      variant="secondary"
                      className={`shrink-0 text-xs transition-colors ${
                        idx === activeIndex ? "bg-primary/10 text-primary border-primary/20" : ""
                      }`}
                    >
                      {channelName(r.channelId)}
                    </Badge>
                    {r.matchedFields.length > 0 && (
                      <span className="text-xs text-muted-foreground truncate">
                        {r.matchedFields.join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>

                {/* Content preview */}
                <div className="text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                  {r.snippet ? <Highlight text={r.snippet} query={q} /> : "(no preview)"}
                </div>

                {/* Mobile: Add subtle indicator for active item */}
                {idx === activeIndex && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full opacity-60" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="border-t bg-muted/30 px-4 py-2 sm:px-6">
        <div className="text-xs text-muted-foreground text-center sm:text-left">
          <span className="hidden sm:inline">↑/↓ Select • Enter Open • Esc Close</span>
          <span className="sm:hidden">↑/↓ Select • Enter Open</span>
        </div>
      </div>
    </div>
  );
}

// Highlight matched query segments (case-insensitive), similar to Spotlight/Google
function Highlight({ text, query }: { text: string; query: string }) {
  if (!text || !query) return <>{text}</>;
  const safe = escapeRegExp(query);
  try {
    const re = new RegExp(`(${safe})`, "ig");
    const parts = text.split(re);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-yellow-200/80 dark:bg-yellow-600/50 text-foreground rounded px-0.5"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  } catch {
    return <>{text}</>;
  }
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
