import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { Badge } from "@/common/components/ui/badge";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { DeleteNoteRenderArgs, DeleteNoteRenderResult, InteractiveToolProps } from "../types";
import { getParsedArgs } from "../utils/invocation-utils";
import { InteractiveToolPanel } from "@/common/lib/agent-tools-ui";
import { NoteContent } from "@/common/features/agent-tools";
import { useTranslation } from "react-i18next";

export function DeleteNoteToolRenderer({
  invocation,
  onResult,
}: InteractiveToolProps<DeleteNoteRenderArgs, DeleteNoteRenderResult>) {
  const { t } = useTranslation();
  const [noteContent, setNoteContent] = useState<string>("");
  const args = getParsedArgs<DeleteNoteRenderArgs>(invocation);
  const noteId = args?.noteId || "";
  const channelId = args?.channelId || "";

  React.useEffect(() => {
    try {
      const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
      const note = channelState?.messages.find(msg => msg.id === noteId);
      if (note) setNoteContent(note.content);
    } catch (err) {
      console.error("Failed to fetch note content:", err);
    }
  }, [noteId, channelId]);

  return (
    <InteractiveToolPanel<DeleteNoteRenderArgs, DeleteNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<Trash2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      title={t("agentTools.deleteNote.title")}
      loadingText={t("agentTools.deleteNote.preparing")}
      callStatusText={t("agentTools.deleteNote.ready")}
      preview={() => (
        <div className="space-y-4 w-full">
          <Alert variant="destructive">
            <AlertDescription>
              <strong>{t("agentTools.deleteNote.warning")}</strong> {t("agentTools.deleteNote.warningDescription")}
            </AlertDescription>
          </Alert>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId || t("common.loading")}
            </Badge>
          </div>
          <NoteContent
            content={noteContent}
            variant="preview"
            showMetadata={false}
            maxHeight="max-h-32"
            placeholder={t("agentTools.deleteNote.loadingContent")}
          />
        </div>
      )}
      confirm={async () => {
        await channelMessageService.deleteMessage({
          messageId: noteId,
          channelId: useNotesViewStore.getState().currentChannelId!,
        });
        // Keep UX similar to others: slight delay to show transition
        return {
          status: "deleted",
          message: t("agentTools.deleteNote.success"),
        } as DeleteNoteRenderResult;
      }}
      confirmLabel={t("agentTools.deleteNote.confirm")}
      confirmIcon={<Trash2 className="h-4 w-4" />}
      confirmVariant="destructive"
      resultStatusText={() => t("agentTools.deleteNote.resultSuccess")}
      resultContent={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId}
            </Badge>
          </div>
          <NoteContent
            content={noteContent}
            variant="error"
            showMetadata={false}
            placeholder={t("agentTools.deleteNote.deletedContent")}
          />
        </div>
      )}
    />
  );
}
