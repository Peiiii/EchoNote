import { memo, useMemo, useState } from "react";
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
import { Pin, MoreVertical, Trash2, ExternalLink, AlertCircle } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";
import { motion } from "framer-motion";

interface StudioRecentItemProps {
  item: StudioContentItem;
  onOpen: (item: StudioContentItem) => void;
  onDelete: (item: StudioContentItem) => void;
  onTogglePin: (item: StudioContentItem) => void;
}

export const StudioRecentItem = memo(function StudioRecentItem({
  item,
  onOpen,
  onDelete,
  onTogglePin,
}: StudioRecentItemProps) {
  const module = getStudioModule(item.moduleId);
  const Icon = module?.icon;
  const [isHovered, setIsHovered] = useState(false);

  const displayTitle = useMemo(() => {
    if (item.moduleId === "wiki-card" && item.status === "completed") {
      const data = item.data as { cards?: unknown[] } | undefined;
      const cardCount = data?.cards?.length ?? 0;
      return cardCount > 0 ? `${item.title} (${cardCount})` : item.title;
    }
    return item.title;
  }, [item.title, item.moduleId, item.status, item.data]);

  const disabledReason = useMemo(() => {
    if (item.status === "generating") return "Still generating";
    if (item.status === "error") return item.errorMessage || "Generation failed";
    return null;
  }, [item.status, item.errorMessage]);


  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative mx-3 mb-2 last:mb-0 transition-all duration-200",
        disabledReason
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer"
      )}
      onClick={() => {
        if (!disabledReason) onOpen(item);
      }}
    >
      <div
        className={cn(
          "relative rounded-lg border transition-all duration-200 overflow-hidden",
          "backdrop-blur-sm bg-card/50",
          "border-border/40 hover:border-border/60",
          !disabledReason && "hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5",
          disabledReason && "bg-muted/20"
        )}
      >
        <div className="relative flex items-center gap-3 p-3">
          {Icon && (
            <div className={cn(
              "flex-shrink-0 flex items-center justify-center transition-all duration-200",
              !disabledReason && "group-hover:scale-105"
            )}>
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  item.status === "generating"
                    ? "text-muted-foreground/40 animate-[breath_2.5s_ease-in-out_infinite]"
                    : item.status === "error"
                    ? "text-destructive"
                    : module?.iconColorClass || "text-muted-foreground/70"
                )}
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div
                  className={cn(
                    "text-sm font-medium truncate transition-colors",
                    disabledReason 
                      ? "text-muted-foreground/60" 
                      : "text-foreground group-hover:text-foreground/90"
                  )}
                >
                  {displayTitle}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <div className="text-[11px] text-muted-foreground/60 font-normal">
                    {formatTimeForSocial(new Date(item.updatedAt))}
                  </div>
                  {item.status === "error" && (
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>Failed</span>
                    </div>
                  )}
                  {item.status === "generating" && (
                    <div className="flex items-center gap-1 text-[11px] text-primary/70">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                      <span>Generating...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!disabledReason && (
            <div
              className={cn(
                "flex items-center gap-0.5 transition-opacity duration-200 flex-shrink-0",
                isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                title={item.pinned ? "Unpin" : "Pin"}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(item);
                }}
              >
                {item.pinned ? (
                  <Pin className="w-3.5 h-3.5 text-primary fill-primary" />
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
        
        {!disabledReason && (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        )}
      </div>
    </motion.div>
  );
});
