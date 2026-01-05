import { memo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Download, ArrowLeft, Copy } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";
import { useTranslation } from "react-i18next";
import { ReportData } from "../types";
import { MarkdownContent } from "@/common/components/markdown/markdown-content";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ReportDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

function downloadText(filename: string, text: string, mimeType: string) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const ReportDetail = memo(function ReportDetail({ item, onClose }: ReportDetailProps) {
  const { t } = useTranslation();
  const data = item.data as ReportData | undefined;
  const markdown = data?.reportMarkdown || "";

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          title={t("common.copy")}
          disabled={!data || !markdown}
          onClick={async () => {
            if (!data) return;
            await navigator.clipboard.writeText(data.reportMarkdown || "");
            toast(t("common.copied"));
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7" disabled={!data}>
              <Download className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                if (!data) return;
                downloadText(
                  `${data.title || "report"}.md`,
                  data.reportMarkdown || "",
                  "text/markdown"
                );
              }}
            >
              {t("studio.report.downloadMarkdown")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                if (!data) return;
                downloadText(
                  `${data.title || "report"}.json`,
                  JSON.stringify(data, null, 2),
                  "application/json"
                );
              }}
            >
              {t("studio.report.downloadJSON")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4">
          <div className="text-sm text-muted-foreground mb-4">
            {t("studio.report.basedOnSources", { count: item.contextChannelIds.length })}
          </div>

          {item.status === "error" ? (
            <div className="text-sm text-destructive">
              {item.errorMessage || t("common.unknownError")}
            </div>
          ) : markdown ? (
            <MarkdownContent content={markdown} />
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("studio.report.contentPlaceholder")}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});
