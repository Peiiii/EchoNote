import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { channelMessageService } from '@/core/services/channel-message.service';
import { ToolInvocationStatus } from '@agent-labs/agent-chat';
import { CheckCircle, FileText, XCircle } from 'lucide-react';
import { CreateNoteRenderArgs, CreateNoteRenderResult, InteractiveToolProps } from '../types';
import { getParsedArgs } from '../utils/invocation-utils';
import { useConfirmAction } from '../utils/use-confirm-action';
import { ConfirmFooter } from './confirm-footer';
import { ToolPanel } from './tool-panel';

export function CreateNoteConfirmUI({ invocation, onResult, channelId }: InteractiveToolProps<CreateNoteRenderArgs, CreateNoteRenderResult>) {
  const args = getParsedArgs<CreateNoteRenderArgs>(invocation);
  const content = args?.content || '';
  const { isLoading, error, handleConfirm, handleCancel } = useConfirmAction<CreateNoteRenderArgs, CreateNoteRenderResult>({
    invocation,
    onResult,
    confirm: async () => {
      const newNoteId = await channelMessageService.sendMessage({ channelId, content, sender: 'user' });
      return { noteId: newNoteId, status: 'created', message: 'Note created successfully' };
    },
    cancelResult: { status: 'cancelled', message: 'Note creation cancelled' },
  });

  if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
    return (
      <ToolPanel
        icon={<FileText className="h-5 w-5 text-blue-600" />}
        title="Create Note"
        status="loading"
        statusText="准备参数中..."

        headerCardClassName="border-blue-200"
        contentCardClassName="border-gray-200 mt-2"
      >
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-md border border-blue-200 p-3">
            <p className="text-sm whitespace-pre-wrap">{content || 'Loading content...'}</p>
          </div>
        </div>
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.CALL) {
    return (
      <ToolPanel
        icon={<FileText className="h-5 w-5 text-amber-600" />}
        title="Create Note"
        status="ready"
        statusText="Ready to create"
        forceExpanded={true}

        headerCardClassName="border-amber-200"
      >
        <div className="space-y-4 w-full">
          <div className="bg-gray-50 rounded-md border p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ConfirmFooter
            confirmLabel="Create Note"
            loadingLabel="Creating..."
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
            confirmIcon={<CheckCircle className="h-4 w-4" />}
          />
        </div>
      </ToolPanel>
    );
  }

  if (invocation.status === ToolInvocationStatus.RESULT) {
    return (
      <ToolPanel
        icon={<FileText className="h-5 w-5 text-green-600" />}
        title="Create Note"
        status="success"
        statusText="Note Created Successfully!"

        headerCardClassName="border-green-200 bg-green-50"
        contentCardClassName="border-gray-200 mt-2"
      >
        <div className="space-y-3">
          <div className="bg-green-50 rounded-md border border-green-200 p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          <p className="text-sm text-green-600">Your note has been saved to the channel.</p>
        </div>
      </ToolPanel>
    );
  }

}
