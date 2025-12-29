import { memo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Play, Pause, Download, ArrowLeft } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";

interface AudioSummaryDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const AudioSummaryDetail = memo(function AudioSummaryDetail({ item, onClose }: AudioSummaryDetailProps) {
  const isPlaying = false;
  const handlePlay = () => {};

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
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="text-sm text-muted-foreground">Audio Overview Content</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePlay}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

