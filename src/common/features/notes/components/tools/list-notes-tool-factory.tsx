import { channelMessageService } from '@/core/services/channel-message.service';
import { ensureChannelMessagesLoaded } from '@/common/features/notes/utils/ensure-channel-messages-loaded';
import { Tool, ToolInvocationStatus } from '@agent-labs/agent-chat';
import { ListNotesToolRender, NoteForDisplay } from './list-notes.tool';

export interface ListNotesToolResult {
    notes: NoteForDisplay[];
}

export interface ListNotesToolArgs {
    limit: number;
}


// Factory function to create the listNotes tool
export function createListNotesTool(channelId: string): Tool<ListNotesToolArgs, ListNotesToolResult> {
    return {
        name: 'listNotes',
        description: 'List all notes/thoughts in the current channel',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of notes/thoughts to return (default: 10)'
                }
            },
            required: []
        },
        // execute: 执行业务逻辑，返回结果给AI
        execute: async (toolCallArgs) => {
            try {
                const { limit = 10 } = toolCallArgs;
                // Ensure messages are loaded for this channel
                await ensureChannelMessagesLoaded(channelId);

                const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
                const notes = channelState?.messages || [];

                const notesForDisplay = notes
                    .slice(0, limit)
                    .map((note) => ({
                        content: note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''),
                        contentLength: note.content.length,
                        timestamp: note.timestamp,
                        timestampReadable: note.timestamp.toLocaleString(),
                        noteId: note.id,
                    }));

                return {
                    notes: notesForDisplay,
                };

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
