import { useRef, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchHeaderProps {
  q: string;
  setQ: (q: string) => void;
  scope: "all" | "current";
  setScope: (scope: "all" | "current") => void;
  indexing: boolean;
}

export function SearchHeader({
  q,
  setQ,
  scope,
  setScope,
  indexing,
}: SearchHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const showProgress = indexing && scope === "all";

  return (
    <div className="sticky top-0 z-10 bg-background shrink-0">
      <div className="h-[env(safe-area-inset-top)] sm:hidden" />

      <div className="px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            <input
              ref={inputRef}
              type="text"
              placeholder={scope === "current" ? "Search current space…" : "Search all spaces…"}
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full h-auto py-2 pl-7 pr-9 bg-transparent border-0 text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 transition-all duration-200"
            />
            {q && (
              <button
                className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-0.5 rounded-md bg-muted/30 p-0.5 shrink-0">
            <button
              role="radio"
              aria-checked={scope === "current"}
              className={`px-2 py-0.5 text-sm font-medium rounded transition-all duration-150 ${
                scope === "current"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setScope("current")}
            >
              Current
            </button>
            <button
              role="radio"
              aria-checked={scope === "all"}
              className={`px-2 py-0.5 text-sm font-medium rounded transition-all duration-150 ${
                scope === "all"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setScope("all")}
            >
              All
            </button>
          </div>
        </div>

        {showProgress && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: "30%" }} />
            </div>
            <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
              Indexing…
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
