import { type NoteSearchMatch } from "@/common/features/note-search/services/note-search.service";
import { Highlight } from "./search-highlight";

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
      {results.map((r, idx) => (
        <button
          key={r.id}
          id={r.id}
          type="button"
          role="option"
          aria-selected={idx === activeIndex}
          className={`w-full text-left px-6 py-5 hover:bg-muted/40 focus:outline-none transition-all duration-200 ${
            idx === activeIndex ? "bg-muted/50" : ""
          }`}
          onMouseEnter={() => setActiveIndex(idx)}
          onClick={() => onPick(r.id, r.channelId)}
        >
          {/* Header with channel and time */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-sm font-semibold transition-colors ${
                idx === activeIndex ? "text-primary" : "text-foreground"
              }`}>
                {channelName(r.channelId)}
              </span>
              {r.matchedFields.length > 0 && (
                <span className="text-sm text-muted-foreground/70 truncate">
                  {r.matchedFields.join(", ")}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground/60 whitespace-nowrap">
              {new Date(r.timestamp).toLocaleDateString()}
            </span>
          </div>

          {/* Content preview */}
          <div className="text-base text-foreground/90 line-clamp-2 leading-relaxed">
            {r.snippet ? <Highlight text={r.snippet} query={q} /> : "(no preview)"}
          </div>

          {/* Mobile: Active indicator */}
          {idx === activeIndex && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full sm:hidden" />
          )}
        </button>
      ))}
    </div>
  );
}
