import { Tool } from '@agent-labs/agent-chat';
import { ListNotesToolRenderer, NoteForDisplay, ListNotesToolArgs, ListNotesToolResult } from './renderers/list-notes-tool-renderer';
import { firebaseNotesService } from '@/common/services/firebase/firebase-notes.service';
import { useNotesDataStore } from '@/core/stores/notes-data.store';


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
        // render: Use the new DisplayToolPanel-based component
        render: (toolInvocation) => {
            return <ListNotesToolRenderer invocation={toolInvocation} />;
        }
    };
}
