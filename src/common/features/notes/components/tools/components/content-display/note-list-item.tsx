import { Badge } from "@/common/components/ui/badge";
import { Clock, Hash } from "lucide-react";
import { cn } from "@/common/lib/utils";

export interface NoteListItemProps {
  noteId: string;
  content: string;
  contentLength: number;
  timestampReadable: string;
  showIdPrefix?: boolean;
  idPrefixLength?: number;
  showCharCount?: boolean;
  charCountThreshold?: number;
  className?: string;
}

export function NoteListItem({
  noteId,
  content,
  contentLength,
  timestampReadable,
  showIdPrefix = true,
  idPrefixLength = 8,
  showCharCount = true,
  charCountThreshold = 60,
  className,
}: NoteListItemProps) {
  return (
    <div
      className={cn(
        "p-3 bg-gray-50 dark:bg-gray-900 rounded-md border dark:border-gray-800",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500" />
          {showIdPrefix && (
            <Badge variant="outline" className="text-xs font-mono">
              {noteId.substring(0, idPrefixLength)}...
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>{timestampReadable}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{content}</p>
      {showCharCount && contentLength > charCountThreshold && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          ({contentLength} characters total)
        </p>
      )}
    </div>
  );
}
