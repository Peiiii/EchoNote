import { type NoteSearchMatch } from "@/common/features/note-search/services/note-search.service";
import { Highlight } from "./search-highlight";
import { formatDistanceToNow } from "date-fns";

interface SearchResultsProps {
  results: NoteSearchMatch[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  onPick: (id: string, channelId: string) => void;
  channelName: (channelId: string) => string;
  q: string;
}

export function SearchResults({
  results,
  activeIndex,
  setActiveIndex,
  onPick,
  channelName,
  q,
}: SearchResultsProps) {
  return (
    <div className="flex-1 py-2">
      {results.map((r, idx) => {
        const isActive = idx === activeIndex;
        const timeAgo = formatDistanceToNow(new Date(r.timestamp), { addSuffix: true });

        return (
        <button
          key={r.id}
          id={r.id}
          type="button"
          role="option"
            aria-selected={isActive}
            className={`relative w-full text-left px-4 py-2.5 rounded transition-colors duration-150 ${
              isActive
                ? "bg-muted/50"
                : "hover:bg-muted/30"
          }`}
          onMouseEnter={() => setActiveIndex(idx)}
          onClick={() => onPick(r.id, r.channelId)}
        >
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground/80">
                  {channelName(r.channelId)}
                </span>
                <span className="text-xs text-foreground/50">·</span>
                <span className="text-xs text-foreground/50">
                  {timeAgo}
                </span>
              </div>
              <div className="text-sm text-foreground/70 leading-relaxed">
                {r.snippet ? <Highlight text={r.snippet} query={q} /> : "(no preview)"}
              </div>
            </div>
        </button>
        );
      })}
    </div>
  );
}
