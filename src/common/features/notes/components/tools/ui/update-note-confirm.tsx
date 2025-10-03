import { Badge } from '@/common/components/ui/badge';
import { useNoteContent } from '@/common/features/notes/hooks/use-note-content';
import { channelMessageService } from '@/core/services/channel-message.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';
import { CheckCircle, Edit } from 'lucide-react';
import { InteractiveToolProps, UpdateNoteRenderArgs, UpdateNoteRenderResult } from '../types';
import { getParsedArgs } from '../utils/invocation-utils';
import { ToolInvocationPanel } from './tool-invocation-panel';

export function UpdateNoteConfirmUI({ invocation, onResult, channelId }: InteractiveToolProps<UpdateNoteRenderArgs, UpdateNoteRenderResult>) {
  const parsed = getParsedArgs<UpdateNoteRenderArgs>(invocation);
  const noteId = parsed?.noteId || '';
  const content = parsed?.content || '';
  const originalContent = useNoteContent(noteId, channelId);

  return (
    <ToolInvocationPanel<UpdateNoteRenderArgs, UpdateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<Edit className="h-5 w-5 text-amber-600" />}
      title="Update Note"
      loadingText="准备参数中..."
      callStatusText="Ready to update"
      preview={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">{noteId || 'Loading...'}</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap text-gray-600">{originalContent || 'Loading original content...'}</p>
            </div>
            <div className="bg-blue-50 rounded-md border border-blue-200 p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        </div>
      )}
      confirm={async () => {
        await channelMessageService.updateMessage({ messageId: noteId, channelId, updates: { content }, userId: useNotesDataStore.getState().userId! });
        return { status: 'updated', message: 'Note updated successfully' };
      }}
      confirmLabel="Update Note"
      confirmIcon={<CheckCircle className="h-4 w-4" />}
      resultStatusText={() => 'Note Updated Successfully!'}
      resultContent={() => (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap text-gray-600">{originalContent || 'Original content'}</p>
            </div>
            <div className="bg-green-50 rounded-md border border-green-200 p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        </div>
      )}
      cancelStatusText="Update Cancelled"
    />
  );
}
