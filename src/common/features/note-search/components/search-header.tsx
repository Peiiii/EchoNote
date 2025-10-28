import { useRef, useEffect } from "react";
import { Input } from "@/common/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchHeaderProps {
  q: string;
  setQ: (q: string) => void;
  scope: "all" | "current";
  setScope: (scope: "all" | "current") => void;
  indexing: boolean;
  indexStats: { totalDocs: number; indexedChannelIds: string[] };
  currentChannelId?: string;
  channelName: (channelId: string) => string;
  onClose: () => void;
}

export function SearchHeader({
  q,
  setQ,
  scope,
  setScope,
  indexing,
  indexStats,
  currentChannelId,
  channelName,
  onClose,
}: SearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  return (
    <div className="sticky top-0 z-10 bg-background shrink-0">
      {/* Mobile: Status bar spacer */}
      <div className="h-[env(safe-area-inset-top)] sm:hidden" />

      {/* Search header */}
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        {/* Row 1: Search input (left) + Exit (right) */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={scope === "current" ? "Search current space…" : "Search all spaces…"}
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-12 pr-12 h-12 text-base sm:h-11 sm:text-sm w-full bg-background border border-border transition-all duration-200 placeholder:text-muted-foreground/60"
            />
            {q && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground transition-all duration-200"
                onClick={() => setQ("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
            onClick={onClose}
          >
            Exit
          </button>
        </div>

        {/* Row 2: Status (left) + Scope toggle (right) */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground text-center sm:text-left sm:flex-1 sm:min-w-0">
            {scope === "all" ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
                {indexing ? "Indexing all spaces… " : "Indexed: "}
                {indexStats.totalDocs} docs in {indexStats.indexedChannelIds.length} spaces
              </span>
            ) : (
              <span className="text-muted-foreground/80">
                Searching in{" "}
                <span className="font-medium text-foreground">
                  {channelName(currentChannelId || "") || "current space"}
                </span>
              </span>
            )}
          </div>
          <div className="flex justify-center sm:justify-end sm:shrink-0">
            <div
              role="radiogroup"
              aria-label="Search scope"
              className="inline-flex items-center rounded-lg bg-muted/50 p-0.5"
            >
              <button
                role="radio"
                aria-checked={scope === "current"}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  scope === "current"
                    ? "bg-background text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setScope("current")}
              >
                Current
              </button>
              <button
                role="radio"
                aria-checked={scope === "all"}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  scope === "all"
                    ? "bg-background text-foreground font-medium"
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
  );
}
