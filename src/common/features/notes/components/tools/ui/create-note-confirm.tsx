import { channelMessageService } from '@/core/services/channel-message.service';
import { CheckCircle, FileText } from 'lucide-react';
import { CreateNoteRenderArgs, CreateNoteRenderResult, InteractiveToolProps } from '../types';
import { getParsedArgs } from '../utils/invocation-utils';
import { ToolInvocationPanel } from './tool-invocation-panel';

export function CreateNoteConfirmUI({ invocation, onResult, channelId }: InteractiveToolProps<CreateNoteRenderArgs, CreateNoteRenderResult>) {
  const args = getParsedArgs<CreateNoteRenderArgs>(invocation);
  const content = args?.content || '';
  return (
    <ToolInvocationPanel<CreateNoteRenderArgs, CreateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<FileText className="h-5 w-5 text-amber-600" />}
      title="Create Note"
      loadingText="准备参数中..."
      callStatusText="Ready to create"
      preview={() => (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-md border p-3">
            <p className="text-sm whitespace-pre-wrap">{content || 'Loading content...'}</p>
          </div>
        </div>
      )}
      confirm={async () => {
        await channelMessageService.sendMessage({ channelId, content, sender: 'user' });
        return { status: 'created', message: 'Note created successfully' };
      }}
      confirmLabel="Create Note"
      confirmIcon={<CheckCircle className="h-4 w-4" />}
      resultStatusText={() => 'Note Created Successfully!'}
      resultContent={() => (
        <div className="space-y-3">
          <div className="bg-green-50 rounded-md border border-green-200 p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          <p className="text-sm text-green-600">Your note has been saved to the channel.</p>
        </div>
      )}
      cancelStatusText="Creation Cancelled"
    />
  );
}
