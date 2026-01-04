import { Badge } from "@/common/components/ui/badge";
import { useNoteContent } from "@/common/features/notes/hooks/use-note-content";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { CheckCircle, Edit } from "lucide-react";
import { InteractiveToolProps, UpdateNoteRenderArgs, UpdateNoteRenderResult } from "../types";
import { getParsedArgs } from "../utils/invocation-utils";
import { InteractiveToolPanel } from "@/common/lib/agent-tools-ui";
import { ComparisonLayout } from "@/common/lib/agent-tools-ui";
import { useTranslation } from "react-i18next";

export function UpdateNoteToolRenderer({
  invocation,
  onResult,
}: InteractiveToolProps<UpdateNoteRenderArgs, UpdateNoteRenderResult>) {
  const { t } = useTranslation();
  const parsed = getParsedArgs<UpdateNoteRenderArgs>(invocation);
  const noteId = parsed?.noteId || "";
  const content = parsed?.content || "";
  const channelId = parsed?.channelId || "";
  const originalContent = useNoteContent(noteId, channelId);

  return (
    <InteractiveToolPanel<UpdateNoteRenderArgs, UpdateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<Edit className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      title={t("agentTools.updateNote.title")}
      loadingText={t("agentTools.updateNote.preparing")}
      callStatusText={t("agentTools.updateNote.ready")}
      // Avoid double scroll: only inner content cards scroll
      contentScrollable={false}
      stickyFooter={false}
      preview={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId || t("common.loading")}
            </Badge>
          </div>
          <ComparisonLayout
            original={{
              content: originalContent || "",
              label: t("agentTools.updateNote.original"),
              placeholder: t("agentTools.updateNote.loadingOriginal"),
            }}
            updated={{
              content,
              label: t("agentTools.updateNote.updated"),
              placeholder: t("agentTools.updateNote.loadingUpdated"),
            }}
            showLabels={true}
          />
        </div>
      )}
      confirm={async () => {
        await channelMessageService.updateMessage({
          messageId: noteId,
          channelId,
          updates: { content },
          userId: useNotesDataStore.getState().userId!,
        });
        return { status: "updated", message: t("agentTools.updateNote.success") };
      }}
      confirmLabel={t("agentTools.updateNote.confirm")}
      confirmIcon={<CheckCircle className="h-4 w-4" />}
      resultStatusText={() => t("agentTools.updateNote.resultSuccess")}
      resultContent={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId}
            </Badge>
          </div>
          <ComparisonLayout
            original={{
              content: originalContent || "",
              label: t("agentTools.updateNote.original"),
              placeholder: t("agentTools.updateNote.originalContent"),
            }}
            updated={{
              content,
              label: t("agentTools.updateNote.updated"),
              placeholder: t("agentTools.updateNote.updatedContent"),
            }}
            showLabels={true}
          />
        </div>
      )}
      cancelStatusText={t("agentTools.updateNote.cancelled")}
    />
  );
}
