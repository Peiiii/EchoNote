import { channelMessageService } from '@/core/services/channel-message.service';
import { CheckCircle, FileText } from 'lucide-react';
import { CreateNoteRenderArgs, CreateNoteRenderResult, InteractiveToolProps } from '../types';
import { getParsedArgs } from '../utils/invocation-utils';
import { InteractiveToolPanel } from '../panels/interactive-tool-panel';

export function CreateNoteToolRenderer({ invocation, onResult, channelId }: InteractiveToolProps<CreateNoteRenderArgs, CreateNoteRenderResult>) {
  const args = getParsedArgs<CreateNoteRenderArgs>(invocation);
  const content = args?.content || '';
  return (
    <InteractiveToolPanel<CreateNoteRenderArgs, CreateNoteRenderResult>
      invocation={invocation}
      onResult={onResult}
      icon={<FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
      title="Create Note"
      loadingText="Preparing parameters..."
      callStatusText="Ready to create"
      preview={() => (
        <div className="space-y-3">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md border dark:border-gray-800 p-3">
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
          <div className="bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-900 p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">Your note has been saved to the channel.</p>
        </div>
      )}
      cancelStatusText="Creation Cancelled"
    />
  );
}
