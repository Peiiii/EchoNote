import { Badge } from "@/common/components/ui/badge";
import { useNoteContent } from "@/common/features/notes/hooks/use-note-content";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { CheckCircle, Edit } from "lucide-react";
import { InteractiveToolProps, UpdateNoteRenderArgs, UpdateNoteRenderResult } from "../types";
import { getParsedArgs } from "../utils/invocation-utils";
import { InteractiveToolPanel } from "../panels/interactive-tool-panel";
import { ComparisonLayout } from "../components";

export function UpdateNoteToolRenderer({
  invocation,
  onResult,
  channelId,
}: InteractiveToolProps<UpdateNoteRenderArgs, UpdateNoteRenderResult>) {
  const parsed = getParsedArgs<UpdateNoteRenderArgs>(invocation);
  const noteId = parsed?.noteId || "";
  const content = parsed?.content || "";
  const originalContent = useNoteContent(noteId, channelId);

  return (
    <InteractiveToolPanel<UpdateNoteRenderArgs, UpdateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<Edit className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      title="Update Note"
      loadingText="Preparing parameters..."
      callStatusText="Ready to update"
      contentScrollable={false}
      stickyFooter={false}
      preview={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId || "Loading..."}
            </Badge>
          </div>
          <ComparisonLayout
            original={{
              content: originalContent || "",
              label: "Original",
              placeholder: "Loading original content...",
            }}
            updated={{
              content,
              label: "Updated",
              placeholder: "Loading updated content...",
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
        return { status: "updated", message: "Note updated successfully" };
      }}
      confirmLabel="Update Note"
      confirmIcon={<CheckCircle className="h-4 w-4" />}
      resultStatusText={() => "Note Updated Successfully!"}
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
              label: "Original",
              placeholder: "Original content",
            }}
            updated={{
              content,
              label: "Updated",
              placeholder: "Updated content",
            }}
            showLabels={true}
          />
        </div>
      )}
      cancelStatusText="Update Cancelled"
    />
  );
}
