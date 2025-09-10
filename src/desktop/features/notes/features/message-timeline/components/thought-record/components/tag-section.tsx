import { Tag as TagIcon } from "lucide-react";
import { TagEditorPopover } from "@/common/features/chat/components/tag-editor-popover";
import { TagList } from "@/common/features/chat/components/tag";
import { TagSectionProps } from "../types";

export function TagSection({ tags, onTagsChange, maxTags = 10 }: TagSectionProps) {
    return (
        <div className="flex items-center gap-2">
            <TagEditorPopover
                tags={tags}
                onTagsChange={onTagsChange}
                maxTags={maxTags}
                trigger={
                    <button className="flex items-center gap-1 px-2 py-1 rounded transition-all duration-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800">
                        <TagIcon className="h-3 w-3" />
                        {tags.length > 0 ? `${tags.length} tags` : 'Add tags'}
                    </button>
                }
            />
            
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
        </div>
    );
}
