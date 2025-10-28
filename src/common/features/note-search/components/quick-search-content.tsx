import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  noteSearchService,
  type NoteSearchMatch,
} from "@/common/features/note-search/services/note-search.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useValueFromObservable } from "@/common/features/note-search/hooks/use-value-from-observable";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { SearchHeader } from "./search-header";
import { SearchResults } from "./search-results";
import { EmptyStates } from "./search-empty-states";

interface QuickSearchContentProps {
  onClose: () => void;
}

export function QuickSearchContent({ onClose }: QuickSearchContentProps) {
  const { currentChannelId } = useNotesViewStore();
  const channels = useNotesDataStore(s => s.channels);
  const presenter = useCommonPresenterContext();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<"all" | "current">("current");
  const [results, setResults] = useState<NoteSearchMatch[]>([]);
  const [indexing, setIndexing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const channelIds = useMemo(
    () => (scope === "current" && currentChannelId ? [currentChannelId] : undefined),
    [scope, currentChannelId]
  );

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

  const channelName = (id: string) => channels.find(c => c.id === id)?.name || id;

  const handlePick = useCallback((noteId: string, channelId: string) => {
    onClose();
    presenter.rxEventBus.requestJumpToMessage$.emit({ channelId, messageId: noteId });
  }, [onClose, presenter.rxEventBus.requestJumpToMessage$]);

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
  }, [results, activeIndex, onClose, handlePick]);

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
    <div className="flex flex-col w-full h-full min-h-0">
      <SearchHeader
        q={q}
        setQ={setQ}
        scope={scope}
        setScope={setScope}
        indexing={indexing}
        indexStats={indexStats}
        currentChannelId={currentChannelId || undefined}
        channelName={channelName}
        onClose={onClose}
      />

      {/* Results area - Always fill remaining space */}
      <div
        ref={listRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col"
        role="listbox"
        aria-activedescendant={results[activeIndex]?.id}
      >
        {q.trim() === "" || results.length === 0 ? (
          <EmptyStates
            q={q}
            scope={scope}
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        ) : (
          <SearchResults
            results={results}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            onPick={handlePick}
            channelName={channelName}
            q={q}
          />
        )}
      </div>

      {/* Footer with keyboard shortcuts */}
      <div className="bg-muted/20 px-6 py-4 sm:px-8 sm:py-3 shrink-0">
        <div className="text-sm text-muted-foreground/70 text-center sm:text-left">
          <span className="hidden sm:inline">↑/↓ Select • Enter Open • Esc Close</span>
          <span className="sm:hidden">↑/↓ Select • Enter Open</span>
        </div>
      </div>
    </div>
  );
}

