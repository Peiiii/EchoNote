import { memo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Download, ArrowLeft } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";

interface ReportDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const ReportDetail = memo(function ReportDetail({ item, onClose }: ReportDetailProps) {
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
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <h1>{item.title}</h1>
            <p className="text-sm text-muted-foreground">Based on {item.contextChannelIds.length} source(s)</p>
            <div className="mt-6">
              <p>Report content will be displayed here in a structured format.</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
});

