import { AlertTriangle, FileText } from "lucide-react";
import { ReadNoteRenderProps, ReadNoteRenderArgs, ReadNoteRenderResult } from "../types";
import { DisplayToolPanel } from "@/common/lib/agent-tools-ui";
import { getParsedArgs } from "../utils/invocation-utils";
import { NoteContent } from "@/common/features/agent-tools";
import { ErrorMessage } from "@/common/lib/agent-tools-ui";
import { useTranslation } from "react-i18next";

export function ReadNoteToolRenderer({ invocation }: ReadNoteRenderProps) {
  const { t } = useTranslation();
  const args = getParsedArgs<ReadNoteRenderArgs>(invocation);
  const noteId = args?.noteId;

  return (
    <DisplayToolPanel<ReadNoteRenderArgs, ReadNoteRenderResult>
      invocation={invocation}
      icon={<FileText className="h-5 w-5 text-blue-600" />}
      title={t("agentTools.readNote.title")}
      loadingText={t("agentTools.readNote.loading", { noteId: noteId?.substring(0, 8) || t("common.unknown") })}
      successIcon={<FileText className="h-5 w-5 text-green-600" />}
      errorIcon={<AlertTriangle className="w-5 h-5 text-red-600" />}
      successStatusText={() => t("agentTools.readNote.success")}
      errorStatusText={error => {
        if (error && typeof error === "object" && "found" in error && !error.found) {
          return t("agentTools.readNote.notFound");
        }
        return t("agentTools.readNote.failed");
      }}
      readyStatusText={t("agentTools.readNote.preparing")}
      contentScrollable={true}
      headerCardClassName="border-blue-200 dark:border-blue-900"
      contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
    >
      {(_args, result, error) => {
        if (error) {
          return (
            <ErrorMessage
              error={error}
              fallbackMessage={t("agentTools.readNote.errorOccurred")}
            />
          );
        }

        if (!result?.found) {
          return <ErrorMessage error={t("agentTools.readNote.notFound")} fallbackMessage={t("agentTools.readNote.notFound")} />;
        }

        return (
          <NoteContent
            content={result.content}
            variant="detail"
            showMetadata={true}
            metadata={{
              noteId: result.noteId,
              timestamp: result.timestampReadable,
              contentLength: result.contentLength,
            }}
          />
        );
      }}
    </DisplayToolPanel>
  );
}
