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
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
          <SearchIcon className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground/70">
          Search {scope === "current" ? "current space" : "all spaces"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
        <SearchIcon className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <p className="text-sm text-muted-foreground/70 mb-4">
        No results found
      </p>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
      >
        {isRefreshing ? "Refreshing..." : "Refresh index"}
      </button>
    </div>
  );
}
