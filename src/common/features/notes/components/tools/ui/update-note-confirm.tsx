//
import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Badge } from '@/common/components/ui/badge';
import { Edit, CheckCircle, XCircle } from 'lucide-react';
import { useNoteContent } from '@/common/features/notes/hooks/use-note-content';
import { useNotesDataStore } from '@/core/stores/notes-data.store';
import { ToolPanel } from './tool-panel';
import { InteractiveToolProps, UpdateNoteRenderArgs, UpdateNoteRenderResult } from '../types';
import { ToolInvocationStatus } from '@agent-labs/agent-chat';
import { getParsedArgs } from '../utils/invocation-utils';
import { useConfirmAction } from '../utils/use-confirm-action';
import { ConfirmFooter } from './confirm-footer';
import { channelMessageService } from '@/core/services/channel-message.service';

export function UpdateNoteConfirmUI({ invocation, onResult, channelId }: InteractiveToolProps<UpdateNoteRenderArgs, UpdateNoteRenderResult>) {
  const parsed = getParsedArgs<UpdateNoteRenderArgs>(invocation);
  const noteId = parsed?.noteId || '';
  const content = parsed?.content || '';
  const originalContent = useNoteContent(noteId, channelId);

  // original content fetched via hook


  const { isLoading, error, handleConfirm, handleCancel } = useConfirmAction<UpdateNoteRenderArgs, UpdateNoteRenderResult>({
    invocation,
    onResult,
    confirm: async () => {
      await channelMessageService.updateMessage({ messageId: noteId, channelId, updates: { content }, userId: useNotesDataStore.getState().userId! });
      return { noteId, status: 'updated', message: 'Note updated successfully' };
    },
    cancelResult: { status: 'cancelled', message: 'Note update cancelled' },
  });

  if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
    const args = invocation.parsedArgs;
    if (!args) {
      return <div>
        {invocation.args}
      </div>
    }
    const previewContent = (args?.content as string) || '';

    return (
      <ToolPanel
        icon={<Edit className="h-5 w-5 text-blue-600" />}
        title="Update Note"
        status="loading"
        statusText="准备参数中..."

        headerCardClassName="border-blue-200"
        contentCardClassName="border-gray-200 mt-2"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">{noteId || 'Loading...'}</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap text-gray-600">
                {originalContent || 'Loading original content...'}
              </p>
            </div>
            {previewContent && (
              <div className="bg-blue-50 rounded-md border border-blue-200 p-3">
                <p className="text-sm whitespace-pre-wrap">{previewContent}</p>
              </div>
            )}
          </div>
        </div>
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.CALL) {
    return (
      <ToolPanel
        icon={<Edit className="h-5 w-5 text-amber-600" />}
        title="Update Note"
        status="ready"
        statusText="Ready to update"
        forceExpanded={true}

        headerCardClassName="border-amber-200"
      >
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap text-gray-600">
                {originalContent || 'Loading original content...'}
              </p>
            </div>
            <div className="bg-blue-50 rounded-md border border-blue-200 p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
          </div>
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ConfirmFooter
            confirmLabel="Update Note"
            loadingLabel="Updating..."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
            confirmIcon={<Edit className="h-4 w-4" />}
          />
        </div>
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.RESULT) {
    return (
      <ToolPanel
        icon={<Edit className="h-5 w-5 text-green-600" />}
        title="Update Note"
        status="success"
        statusText="Note Updated Successfully!"

        headerCardClassName="border-green-200 bg-green-50"
        contentCardClassName="border-gray-200 mt-2"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-md border p-3">
              <p className="text-sm whitespace-pre-wrap text-gray-600">
                {originalContent || 'Original content'}
              </p>
            </div>
            <div className="bg-green-50 rounded-md border border-green-200 p-3">
              <p className="text-sm whitespace-pre-wrap">{content}</p>
            </div>
          </div>
        </div>
      </ToolPanel>
    );
  }

  return (
    <ToolPanel
      icon={<Edit className="h-5 w-5 text-amber-600" />}
      title="Update Note"
      status={isLoading ? 'loading' : 'ready'}
      statusText={isLoading ? 'Updating...' : 'Ready to update'}

      headerCardClassName="border-amber-200"
    >
      <div className="space-y-4 w-full">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
        </div>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-md border p-3">
            <p className="text-sm whitespace-pre-wrap text-gray-600">
              {originalContent || 'Loading original content...'}
            </p>
          </div>
          <div className="bg-blue-50 rounded-md border border-blue-200 p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <ConfirmFooter
          confirmLabel="Update Note"
          loadingLabel="Updating..."
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          isLoading={isLoading}
          confirmIcon={<CheckCircle className="h-4 w-4" />}
        />
      </div>
    </ToolPanel>
  );
}
