import { Alert, AlertDescription } from '@/common/components/ui/alert';
import { Badge } from '@/common/components/ui/badge';
import { Clock, FileText, Hash, List } from 'lucide-react';
import { DisplayToolPanel } from './ui/display-tool-panel';
import { ToolInvocation } from '@agent-labs/agent-chat';

export interface NoteForDisplay {
    noteId: string;
    content: string;
    contentLength: number;
    timestamp: Date;
    timestampReadable: string;
}

export interface ListNotesToolArgs {
    limit?: number;
    order?: 'asc' | 'desc';
}

export interface ListNotesToolResult {
    notes: Array<NoteForDisplay>;
}

interface ListNotesToolRenderProps {
    invocation: ToolInvocation<ListNotesToolArgs, ListNotesToolResult>;
}

export function ListNotesToolRender({ invocation }: ListNotesToolRenderProps) {
    const args = invocation.parsedArgs || {};
    const limit = args.limit || 10;

    return (
        <DisplayToolPanel<ListNotesToolArgs, ListNotesToolResult>
            invocation={invocation}
            icon={<List className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            title="List Notes"
            loadingText="Loading notes from channel..."
            successStatusText={(result) => `Found ${result?.notes?.length || 0} note${(result?.notes?.length || 0) !== 1 ? 's' : ''}`}
            errorStatusText={(_error) => 'Failed to load notes'}
            readyStatusText="Preparing to list notes..."
            contentScrollable={true}
            headerCardClassName="border-blue-200 dark:border-blue-800"
            contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
        >
            {(_args, result, error) => {
                if (error) {
                    return (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {typeof error === 'string' ? error : 'An error occurred while loading notes'}
                            </AlertDescription>
                        </Alert>
                    );
                }

                if (!result?.notes || !Array.isArray(result.notes) || result.notes.length === 0) {
                    return (
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">No notes found in this channel</span>
                        </div>
                    );
                }

                return (
                    <div className="space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Showing up to {limit} notes from the channel
                        </div>
                        {result.notes.map((note, index) => (
                            <div key={note.noteId || index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border dark:border-gray-800">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                                        <Badge variant="outline" className="text-xs font-mono">
                                            {note.noteId?.substring(0, 8)}...
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        <span>{note.timestampReadable}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                    {note.content}
                                </p>
                                {note.contentLength > 60 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        ({note.contentLength} characters total)
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }}
        </DisplayToolPanel>
    );
}
