import { channelMessageService } from "@/core/services/channel-message.service";
import { CheckCircle, FileText } from "lucide-react";
import { CreateNoteRenderArgs, CreateNoteRenderResult, InteractiveToolProps } from "../types";
import { getParsedArgs } from "../utils/invocation-utils";
import { InteractiveToolPanel } from "@/common/lib/agent-tools-ui";
import { NoteContent } from "@/common/features/agent-tools";
import { useTranslation } from "react-i18next";

export function CreateNoteToolRenderer({
  invocation,
  onResult,
}: InteractiveToolProps<CreateNoteRenderArgs, CreateNoteRenderResult>) {
  const { t } = useTranslation();
  const args = getParsedArgs<CreateNoteRenderArgs>(invocation);
  const content = args?.content || "";
  const channelId = args?.channelId || "";
  return (
    <InteractiveToolPanel<CreateNoteRenderArgs, CreateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      title={t("agentTools.createNote.title")}
      loadingText={t("agentTools.createNote.preparing")}
      callStatusText={t("agentTools.createNote.ready")}
      preview={() => <NoteContent content={content} variant="preview" showMetadata={false} />}
      confirm={async () => {
        await channelMessageService.sendMessage({ channelId, content, sender: "user" });
        return { status: "created", message: t("agentTools.createNote.success") };
      }}
      confirmLabel={t("agentTools.createNote.confirm")}
      confirmIcon={<CheckCircle className="h-4 w-4" />}
      resultStatusText={() => t("agentTools.createNote.resultSuccess")}
      resultContent={() => (
        <div className="space-y-3">
          <NoteContent content={content} variant="detail" showMetadata={false} />
          <p className="text-sm text-green-600 dark:text-green-400">
            {t("agentTools.createNote.saved")}
          </p>
        </div>
      )}
      cancelStatusText={t("agentTools.createNote.cancelled")}
    />
  );
}
