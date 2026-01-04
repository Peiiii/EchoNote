import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStatesProps {
  q: string;
  scope: "all" | "current";
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function EmptyStates({ q, scope, isRefreshing, onRefresh }: EmptyStatesProps) {
  const { t } = useTranslation();
  if (q.trim() === "") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
          <SearchIcon className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm text-muted-foreground/70">
          {scope === "current" ? t('noteSearch.emptyStates.searchCurrent') : t('noteSearch.emptyStates.searchAll')}
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
        {t('noteSearch.emptyStates.noResults')}
      </p>
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors disabled:opacity-50"
      >
        {isRefreshing ? t('noteSearch.emptyStates.refreshing') : t('noteSearch.emptyStates.refreshIndex')}
      </button>
    </div>
  );
}
