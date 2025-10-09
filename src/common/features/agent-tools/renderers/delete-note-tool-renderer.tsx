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

export function DeleteNoteToolRenderer({
  invocation,
  onResult,
}: InteractiveToolProps<DeleteNoteRenderArgs, DeleteNoteRenderResult>) {
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
      title="Delete Note"
      loadingText="Preparing parameters..."
      callStatusText="Ready to delete"
      preview={() => (
        <div className="space-y-4 w-full">
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Warning:</strong> This action will permanently delete the note. This cannot be
              undone.
            </AlertDescription>
          </Alert>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">
              {noteId || "Loading..."}
            </Badge>
          </div>
          <NoteContent
            content={noteContent}
            variant="preview"
            showMetadata={false}
            maxHeight="max-h-32"
            placeholder="Loading note content..."
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
          message: "Note deleted successfully",
        } as DeleteNoteRenderResult;
      }}
      confirmLabel="Delete Note"
      confirmIcon={<Trash2 className="h-4 w-4" />}
      confirmVariant="destructive"
      resultStatusText={() => "Note Deleted Successfully!"}
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
            placeholder="Deleted note content"
          />
        </div>
      )}
    />
  );
}
