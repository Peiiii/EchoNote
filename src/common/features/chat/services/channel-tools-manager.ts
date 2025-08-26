import { Tool } from "@agent-labs/agent-chat";
import { useChatDataStore } from "@/core/stores/chat-data.store";
import { createListNotesTool } from "@/common/features/chat/components/tools/list-notes.tool";

export class ChannelToolsManager {
    /**
     * Get channel-specific CRUD tools
     */
    getChannelTools(channelId: string): Tool[] {
        return [
            this.createNoteTool(channelId),
            this.readNoteTool(channelId),
            this.updateNoteTool(channelId),
            this.deleteNoteTool(channelId),
            this.listNotesTool(channelId)
        ];
    }

    /**
     * Create a new note
     */
    private createNoteTool(channelId: string): Tool {
        return {
            name: 'createNote',
            description: 'Create a new note in the current channel',
            parameters: {
                type: 'object',
                properties: {
                    content: {
                        type: 'string',
                        description: 'Content of the note'
                    }
                },
                required: ['content']
            },
            execute: async (toolCall) => {
                const state = useChatDataStore.getState();
                const args = JSON.parse(toolCall.function.arguments);
                const { content } = args;

                // Create new note
                const newNote = {
                    id: `note_${Date.now()}`,
                    content,
                    timestamp: new Date().toISOString(),
                    sender: 'user' as const,
                    channelId
                };

                // Add to store
                state.addMessage(newNote);

                return {
                    toolCallId: toolCall.id,
                    result: `Successfully created note: ${content.substring(0, 50)}...`,
                    state: 'result' as const
                };
            }
        };
    }

    /**
     * Read a specific note by ID
     */
    private readNoteTool(channelId: string): Tool {
        return {
            name: 'readNote',
            description: 'Read a specific note by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note to read'
                    }
                },
                required: ['noteId']
            },
            execute: async (toolCall) => {
                const state = useChatDataStore.getState();
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId } = args;

                const note = state.messages.find(msg => msg.id === noteId && msg.channelId === channelId);

                if (!note) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Note with ID ${noteId} not found`,
                        state: 'result' as const
                    };
                }

                return {
                    toolCallId: toolCall.id,
                    result: `Note: ${note.content}`,
                    state: 'result' as const
                };
            }
        };
    }

    /**
     * Update an existing note
     */
    private updateNoteTool(channelId: string): Tool {
        return {
            name: 'updateNote',
            description: 'Update an existing note by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note to update'
                    },
                    content: {
                        type: 'string',
                        description: 'New content for the note'
                    }
                },
                required: ['noteId', 'content']
            },
            execute: async (toolCall) => {
                const state = useChatDataStore.getState();
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId, content } = args;

                const noteIndex = state.messages.findIndex(msg => msg.id === noteId && msg.channelId === channelId);

                if (noteIndex === -1) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Note with ID ${noteId} not found`,
                        state: 'result' as const
                    };
                }

                // Update the note
                state.messages[noteIndex].content = content;

                return {
                    toolCallId: toolCall.id,
                    result: `Successfully updated note ${noteId}: ${content.substring(0, 50)}...`,
                    state: 'result' as const
                };
            }
        };
    }

    /**
     * Delete a note by ID
     */
    private deleteNoteTool(channelId: string): Tool {
        return {
            name: 'deleteNote',
            description: 'Delete a note by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note to delete'
                    }
                },
                required: ['noteId']
            },
            execute: async (toolCall) => {
                const state = useChatDataStore.getState();
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId } = args;

                const noteIndex = state.messages.findIndex(msg => msg.id === noteId && msg.channelId === channelId);

                if (noteIndex === -1) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Note with ID ${noteId} not found`,
                        state: 'result' as const
                    };
                }

                // Remove the note
                state.messages.splice(noteIndex, 1);

                return {
                    toolCallId: toolCall.id,
                    result: `Successfully deleted note ${noteId}`,
                    state: 'result' as const
                };
            }
        };
    }

    /**
     * List all notes in the channel
     */
    private listNotesTool(channelId: string): Tool {
        return createListNotesTool(channelId);
    }
}

export const channelToolsManager = new ChannelToolsManager();
