import { Tag as TagIcon } from "lucide-react";
import { TagEditorPopover } from "@/common/features/notes/components/tag-editor-popover";
import { TagList } from "@/common/features/notes/components/tag";
import { TagSectionProps } from "../types";

export function TagSection({ tags, onTagsChange, maxTags = 10 }: TagSectionProps) {
  return (
    <div className="flex items-center gap-2">
      {tags.length > 0 && (
        <TagList
          tags={tags}
          variant="footer"
          size="sm"
          maxTags={2}
          truncate={true}
          maxWidth="80px"
        />
      )}

      <TagEditorPopover
        tags={tags}
        onTagsChange={onTagsChange}
        maxTags={maxTags}
        trigger={
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-1.5 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
            title={tags.length > 0 ? `${tags.length} tags` : "Add tags"}
            aria-label={tags.length > 0 ? `${tags.length} tags` : "Add tags"}
          >
            <TagIcon className="h-3 w-3" />
          </button>
        }
      />
    </div>
  );
}
