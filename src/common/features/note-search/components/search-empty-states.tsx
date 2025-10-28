import { Search as SearchIcon } from "lucide-react";

interface EmptyStatesProps {
  q: string;
  scope: "all" | "current";
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function EmptyStates({ q, scope, isRefreshing, onRefresh }: EmptyStatesProps) {
  if (q.trim() === "") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-muted/40 flex items-center justify-center mb-6">
          <SearchIcon className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">Search your notes</h3>
        <p className="text-base text-muted-foreground/80 mb-6 max-w-sm">
          Type to search across {scope === "current" ? "current space" : "all spaces"}
        </p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground/60">
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>Swipe left/right to switch scope</span>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted/40 flex items-center justify-center mb-6">
        <SearchIcon className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">No matches found</h3>
      <p className="text-base text-muted-foreground/80 mb-6 max-w-sm">
        Try different keywords or search in all spaces
      </p>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="px-4 py-2 rounded-xl bg-muted/60 hover:bg-muted/80 text-sm text-muted-foreground hover:text-foreground transition-all duration-200 disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing..." : "Refresh Search"}
      </button>
    </div>
  );
}
