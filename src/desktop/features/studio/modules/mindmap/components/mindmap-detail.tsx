import { memo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Download, ArrowLeft } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";

interface MindmapDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const MindmapDetail = memo(function MindmapDetail({ item, onClose }: MindmapDetailProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-medium flex-1 truncate">{item.title}</div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Download className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-4">Mindmap Visualization</div>
          <div className="w-full h-96 border border-border/40 rounded-lg bg-muted/20 flex items-center justify-center">
            <div className="text-muted-foreground">Mindmap content will be rendered here</div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

