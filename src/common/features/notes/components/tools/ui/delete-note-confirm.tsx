import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Badge } from '@/common/components/ui/badge';
import { channelMessageService } from '@/core/services/channel-message.service';
import { useNotesViewStore } from '@/core/stores/notes-view.store';
import { ToolInvocationStatus } from '@agent-labs/agent-chat';
import { AlertTriangle, Trash2, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { DeleteNoteRenderArgs, DeleteNoteRenderResult, InteractiveToolProps } from '../types';
import { getParsedArgs } from '../utils/invocation-utils';
import { useConfirmAction } from '../utils/use-confirm-action';
import { ConfirmFooter } from './confirm-footer';
import { ToolPanel } from './tool-panel';

export function DeleteNoteConfirmUI({ invocation, onResult, channelId }: InteractiveToolProps<DeleteNoteRenderArgs, DeleteNoteRenderResult>) {
    const [noteContent, setNoteContent] = useState<string>('');
    const args = getParsedArgs<DeleteNoteRenderArgs>(invocation);
    const noteId = args?.noteId || '';

    React.useEffect(() => {
        const fetchNoteContent = async () => {
            try {
                const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
                const note = channelState?.messages.find(msg => msg.id === noteId);
                if (note) {
                    setNoteContent(note.content);
                }
            } catch (err) {
                console.error('Failed to fetch note content:', err);
            }
        };

        fetchNoteContent();
    }, [noteId, channelId]);

    const { isLoading, error, handleConfirm, handleCancel } = useConfirmAction<DeleteNoteRenderArgs, DeleteNoteRenderResult>({
        invocation,
        onResult,
        confirm: async () => {
            await channelMessageService.deleteMessage({
                messageId: noteId,
                channelId: useNotesViewStore.getState().currentChannelId!

            })
            return { status: 'deleted', message: 'Note deleted successfully' } as DeleteNoteRenderResult;
        },
        cancelResult: { status: 'cancelled', message: 'Note deletion cancelled' },
    });

    if (invocation.status === ToolInvocationStatus.PARTIAL_CALL) {
        return (
            <ToolPanel
                icon={<Trash2 className="h-5 w-5 text-blue-600" />}
                title="Delete Note"
                status="loading"
                statusText="准备参数中..."

                headerCardClassName="border-blue-200"
                contentCardClassName="border-gray-200 mt-2"
            >
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">{noteId || 'Loading...'}</Badge>
                    </div>
                    <div className="bg-red-50 rounded-md border border-red-200 p-3">
                        <p className="text-sm whitespace-pre-wrap text-gray-600">
                            {noteContent || 'Loading note content...'}
                        </p>
                    </div>
                </div>
            </ToolPanel>
        );
    }

  if (invocation.status === ToolInvocationStatus.CALL) {
    return (
      <ToolPanel
        icon={<Trash2 className="h-5 w-5 text-amber-600" />}
        title="Delete Note"
        status="ready"
        statusText="Ready to delete"
        forceExpanded={true}
        
        headerCardClassName="border-amber-200"
      >
        <div className="space-y-4 w-full">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> This action will permanently delete the note.
                            This cannot be undone.
                        </AlertDescription>
                    </Alert>
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
                    </div>
                    <div className="bg-gray-50 rounded-md border max-h-32 overflow-y-auto p-3">
                        <p className="text-sm whitespace-pre-wrap text-gray-600">
                            {noteContent || 'Loading note content...'}
                        </p>
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <ConfirmFooter
                        confirmLabel="Delete Note"
                        loadingLabel="Deleting..."
                        variant="destructive"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        isLoading={isLoading}
                        confirmIcon={<Trash2 className="h-4 w-4" />}
                    />
                </div>
            </ToolPanel>
        );
    }

    if (invocation.status === ToolInvocationStatus.RESULT) {
        return (
            <ToolPanel
                icon={<Trash2 className="h-5 w-5 text-green-600" />}
                title="Delete Note"
                status="success"
                statusText="Note Deleted Successfully!"

                headerCardClassName="border-green-200 bg-green-50"
                contentCardClassName="border-gray-200 mt-2"
            >
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="font-mono text-xs">{noteId}</Badge>
                    </div>
                    <div className="bg-red-50 rounded-md border border-red-200 p-3">
                        <p className="text-sm whitespace-pre-wrap text-gray-600">
                            {noteContent || 'Deleted note content'}
                        </p>
                    </div>
                    <p className="text-sm text-green-600">The note has been moved to trash.</p>
                </div>
            </ToolPanel>
        );
    }

}
