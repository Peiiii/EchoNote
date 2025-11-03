import { memo, useMemo, useState, KeyboardEvent } from "react";
import { cn } from "@/common/lib/utils";
import { formatTimeForSocial } from "@/common/lib/time-utils";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { getStudioModule } from "../modules/registry";
import { Pin, MoreVertical, Pencil, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";

interface StudioRecentItemProps {
  item: StudioContentItem;
  onOpen: (item: StudioContentItem) => void;
  onDelete: (item: StudioContentItem) => void;
  onTogglePin: (item: StudioContentItem) => void;
  onRename: (item: StudioContentItem, title: string) => void;
}

export const StudioRecentItem = memo(function StudioRecentItem({
  item,
  onOpen,
  onDelete,
  onTogglePin,
  onRename,
}: StudioRecentItemProps) {
  const module = getStudioModule(item.moduleId);
  const Icon = module?.icon;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(item.title);
  const [isHovered, setIsHovered] = useState(false);

  const disabledReason = useMemo(() => {
    if (item.status === "generating") return "Still generating";
    if (item.status === "error") return item.errorMessage || "Generation failed";
    return null;
  }, [item.status, item.errorMessage]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim() && value !== item.title) {
        onRename(item, value.trim());
      }
      setEditing(false);
    }
    if (e.key === "Escape") {
      setEditing(false);
      setValue(item.title);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative px-3 py-2 border-b border-border/40 last:border-0 transition-colors",
        disabledReason
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer hover:bg-accent/30"
      )}
      onClick={() => {
        if (!disabledReason && !editing) onOpen(item);
      }}
    >
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon
              className={cn(
                "w-4 h-4",
                item.status === "generating"
                  ? "text-muted-foreground/40 animate-[breath_2.5s_ease-in-out_infinite]"
                  : module?.iconColorClass || "text-muted-foreground/70"
              )}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={() => {
                setEditing(false);
                setValue(item.title);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-background px-2 py-0.5 rounded text-sm outline-none border border-border focus:border-primary"
            />
          ) : (
            <div
              className={cn(
                "text-sm truncate",
                disabledReason ? "text-muted-foreground/60" : "text-foreground"
              )}
            >
              {item.title}
            </div>
          )}

          <div className="flex items-center gap-2 mt-0.5">
            <div className="text-[11px] text-muted-foreground/60">
              {formatTimeForSocial(new Date(item.updatedAt))}
            </div>
            {item.status === "error" && (
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            )}
          </div>
        </div>

        {/* Keep actions mounted to avoid Radix menu closing when hover leaves the row */}
        {!disabledReason && (
          <div
            className={cn(
              "flex items-center gap-0.5 transition-opacity",
              (isHovered || editing) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              title={item.pinned ? "Unpin" : "Pin"}
              onClick={() => onTogglePin(item)}
            >
              {item.pinned ? (
                <Pin className="w-3.5 h-3.5 text-foreground fill-foreground" />
              ) : (
                <Pin className="w-3.5 h-3.5 text-muted-foreground/60" />
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-7 w-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-3.5 h-3.5 text-muted-foreground/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 p-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(item);
                  }} 
                  className="cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditing(true);
                  }} 
                  className="cursor-pointer"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  className="text-destructive cursor-pointer focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
});
