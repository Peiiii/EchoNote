import { FileText, List } from 'lucide-react';
import { DisplayToolPanel } from '@/common/lib/agent-tools-ui';
import { ToolInvocation } from '@agent-labs/agent-chat';
import { EmptyState, ErrorMessage } from '@/common/lib/agent-tools-ui';
import { NoteListItem } from '@/common/features/agent-tools';

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
    channelId: string;
}

export interface ListNotesToolResult {
    notes: Array<NoteForDisplay>;
}

interface ListNotesToolRendererProps {
    invocation: ToolInvocation<ListNotesToolArgs, ListNotesToolResult>;
}

export function ListNotesToolRenderer({ invocation }: ListNotesToolRendererProps) {
    const args = invocation.parsedArgs || {};
    const limit = (args as ListNotesToolArgs).limit || 10;

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
                        <ErrorMessage 
                            error={error}
                            fallbackMessage="An error occurred while loading notes"
                            variant="alert"
                        />
                    );
                }

                if (!result?.notes || !Array.isArray(result.notes) || result.notes.length === 0) {
                    return (
                        <EmptyState 
                            icon={FileText}
                            message="No notes found in this channel"
                        />
                    );
                }

                return (
                    <div className="space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Showing up to {limit} notes from the channel
                        </div>
                        {result.notes.map((note, index) => (
                            <NoteListItem
                                key={note.noteId || index}
                                noteId={note.noteId}
                                content={note.content}
                                contentLength={note.contentLength}
                                timestampReadable={note.timestampReadable}
                            />
                        ))}
                    </div>
                );
            }}
        </DisplayToolPanel>
    );
}
