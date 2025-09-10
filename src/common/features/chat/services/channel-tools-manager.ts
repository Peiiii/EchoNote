import { Tool } from "@agent-labs/agent-chat";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
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
     * Create a new note/thought
     */
    private createNoteTool(channelId: string): Tool {
        return {
            name: 'createNote',
            description: 'Create a new note/thought in the current channel. ONLY use this tool when the user explicitly requests to create a note or thought.',
            parameters: {
                type: 'object',
                properties: {
                    content: {
                        type: 'string',
                        description: 'Content of the note/thought'
                    }
                },
                required: ['content']
            },
            execute: async (toolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { content } = args;

                try {
                    await channelMessageService.sendMessage({
                        content,
                        sender: 'user',
                        channelId
                    });

                    return {
                        toolCallId: toolCall.id,
                        result: `Successfully created note: ${content.substring(0, 50)}...`,
                        state: 'result' as const
                    };
                } catch (error) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Failed to create note: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        state: 'result' as const
                    };
                }
            }
        };
    }

    /**
     * Read a specific note/thought by ID
     */
    private readNoteTool(channelId: string): Tool {
        return {
            name: 'readNote',
            description: 'Read a specific note/thought by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note/thought to read'
                    }
                },
                required: ['noteId']
            },
            execute: async (toolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId } = args;

                try {
                    const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
                    const note = channelState?.messages.find(msg => msg.id === noteId);

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
                } catch (error) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Failed to read note: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        state: 'result' as const
                    };
                }
            }
        };
    }

    /**
     * Update an existing note/thought
     */
    private updateNoteTool(channelId: string): Tool {
        return {
            name: 'updateNote',
            description: 'Update an existing note/thought by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note/thought to update'
                    },
                    content: {
                        type: 'string',
                        description: 'New content for the note/thought'
                    }
                },
                required: ['noteId', 'content']
            },
            execute: async (toolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId, content } = args;

                try {
                    const { userId } = useNotesDataStore.getState();
                    if (!userId) {
                        return {
                            toolCallId: toolCall.id,
                            result: `User not authenticated`,
                            state: 'result' as const
                        };
                    }

                    await channelMessageService.updateMessage({
                        messageId: noteId,
                        channelId,
                        updates: { content },
                        userId
                    });

                    return {
                        toolCallId: toolCall.id,
                        result: `Successfully updated note ${noteId}: ${content.substring(0, 50)}...`,
                        state: 'result' as const
                    };
                } catch (error) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Failed to update note: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        state: 'result' as const
                    };
                }
            }
        };
    }

    /**
     * Delete a note/thought by ID
     */
    private deleteNoteTool(channelId: string): Tool {
        return {
            name: 'deleteNote',
            description: 'Delete a note/thought by its ID',
            parameters: {
                type: 'object',
                properties: {
                    noteId: {
                        type: 'string',
                        description: 'ID of the note/thought to delete'
                    }
                },
                required: ['noteId']
            },
            execute: async (toolCall) => {
                const args = JSON.parse(toolCall.function.arguments);
                const { noteId } = args;

                try {
                    await channelMessageService.deleteMessage({
                        messageId: noteId,
                        channelId,
                        hardDelete: false
                    });

                    return {
                        toolCallId: toolCall.id,
                        result: `Successfully deleted note ${noteId}`,
                        state: 'result' as const
                    };
                } catch (error) {
                    return {
                        toolCallId: toolCall.id,
                        result: `Failed to delete note: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        state: 'result' as const
                    };
                }
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
