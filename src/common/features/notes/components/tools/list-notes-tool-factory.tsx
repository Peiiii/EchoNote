import { Tool, ToolInvocationStatus } from '@agent-labs/agent-chat';
import { ListNotesToolRender, NoteForDisplay } from './list-notes.tool';
import { firebaseNotesService } from '@/common/services/firebase/firebase-notes.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';

export interface ListNotesToolResult {
    notes: NoteForDisplay[];
}

export interface ListNotesToolArgs {
    limit: number;
    order?: 'asc' | 'desc';
}


// Factory function to create the listNotes tool
export function createListNotesTool(channelId: string): Tool<ListNotesToolArgs, ListNotesToolResult> {
    return {
        name: 'listNotes',
        description: 'List notes/thoughts in the current channel, optionally sorted by time',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of notes/thoughts to return (default: 10)'
                },
                order: {
                    type: 'string',
                    enum: ['asc', 'desc'],
                    description: 'Sort order by timestamp (default: desc)'
                }
            },
            required: []
        },
        // execute: 直接通过底层 service 拉取数据，避免缓存导致的顺序问题
        execute: async (toolCallArgs) => {
            try {
                console.log("🔔 [listNotesTool][execute][toolCallArgs]:", toolCallArgs);
                const { limit = 10, order = 'desc' } = toolCallArgs;
                const { userId } = useNotesDataStore.getState();
                if (!userId) throw new Error('User not signed in');

                const { messages } = await firebaseNotesService.fetchInitialMessagesAllSenders(
                    userId,
                    channelId,
                    limit
                );

                console.log("🔔 [listNotesTool][execute][messages]:", messages);

                const sorted = order === 'asc'
                    ? [...messages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                    : [...messages].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

                const notesForDisplay: NoteForDisplay[] = sorted.map((note) => ({
                    content: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''),
                    contentLength: note.content.length,
                    timestamp: note.timestamp,
                    timestampReadable: note.timestamp.toLocaleString(),
                    noteId: note.id,
                }));

                return { notes: notesForDisplay };

            } catch (error) {
                console.error("🔔 [listNotesTool][execute][error]:", error);
                throw new Error(`Failed to list notes: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },
        // render: Enhanced rendering with better UI
        render: (toolInvocation) => {
            if (!toolInvocation.parsedArgs) {
                return <div>
                    {toolInvocation.args}
                </div>
            }

            const args = toolInvocation.parsedArgs;
            const { limit = 10 } = args;

            // Show loading state during execution
            if (toolInvocation.status === ToolInvocationStatus.CALL) {
                return (
                    <ListNotesToolRender
                        limit={limit}
                        channelId={channelId}
                        isLoading={true}
                    />
                );
            }

            // Show results after execution
            if (toolInvocation.status === ToolInvocationStatus.RESULT) {
                try {
                    const result = toolInvocation.result;

                    // Extract the actual notes array from the result
                    const notesArray: NoteForDisplay[] = result?.notes || [];

                    return (
                        <ListNotesToolRender
                            limit={limit}
                            channelId={channelId}
                            notes={notesArray}
                        />
                    );
                } catch (error) {
                    console.error("🔔 [listNotesTool][render][error]:", error);
                    return (
                        <ListNotesToolRender
                            limit={limit}
                            channelId={channelId}
                            error="Failed to parse notes data"
                        />
                    );
                }
            }

            // Default state
            return (
                <ListNotesToolRender
                    limit={limit}
                    channelId={channelId}
                />
            );
        }
    };
}
