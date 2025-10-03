import { CreateNoteConfirmUI, DeleteNoteConfirmUI, ReadNoteRenderUI, UpdateNoteConfirmUI } from "@/common/features/notes/components/tools/interactive-note-tools.ui";
import { createListNotesTool } from "@/common/features/notes/components/tools/list-notes-tool-factory";
import { ReadNoteRenderArgs, ReadNoteRenderResult } from "@/common/features/notes/components/tools/types";
import { channelMessageService } from "@/core/services/channel-message.service";
import { ensureChannelMessagesLoaded } from "@/common/features/notes/utils/ensure-channel-messages-loaded";
import { Tool } from "@agent-labs/agent-chat";
import * as React from "react"; // for createElement in renderers

export class ChannelToolsManager {
    /**
     * Get channel-specific CRUD tools
     */
    getChannelTools(channelId: string): Tool[] {
        console.log("🔔 [ChannelToolsManager][getChannelTools] creating tools for channel:", channelId);
        const tools = [
            this.createNoteTool(channelId),
            this.readNoteTool(channelId),
            this.updateNoteTool(channelId),
            this.deleteNoteTool(channelId),
            this.listNotesTool(channelId)
        ];
        console.log("🔔 [ChannelToolsManager][getChannelTools] created tools:", tools.map(t => ({ name: t.name, description: t.description })));
        return tools;
    }

    /**
     * Create a new note/thought
     */
    private createNoteTool(channelId: string): Tool {
        // Switch to User-Interaction pattern: require explicit user confirmation
        return {
            name: 'createNote',
            description: 'Create a new note/thought in the current channel (requires user confirmation).',
            parameters: {
                type: 'object',
                properties: {
                    content: { type: 'string', description: 'Content of the note/thought' },
                },
                required: ['content'],
            },
            // No execute: we will do actual creation inside the confirm UI
            render: (invocation, onResult) =>
                React.createElement(CreateNoteConfirmUI, { invocation, onResult, channelId }),
        };
    }

    /**
     * Read a specific note/thought by ID
     */
    private readNoteTool(channelId: string): Tool<ReadNoteRenderArgs, ReadNoteRenderResult> {
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
            execute: async (toolCallArgs) => {
                const { noteId } = toolCallArgs;
                try {
                    // Ensure messages loaded before searching
                    await ensureChannelMessagesLoaded(channelId);

                    const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
                    const note = channelState?.messages.find(msg => msg.id === noteId);

                    console.log("🔔 [readNoteTool][result]:", {
                        noteId,
                        note: note ? { id: note.id, content: note.content.substring(0, 50) + '...' } : null,
                        channelState: channelState ? { messagesCount: channelState.messages?.length || 0 } : null
                    });

                    if (!note) {
                        throw new Error(`Note with ID ${noteId} not found`);
                    }

                    return {
                        found: true,
                        noteId: note.id,
                        content: note.content,
                        timestamp: note.timestamp,
                        timestampReadable: note.timestamp.toLocaleString(),
                        contentLength: note.content.length

                    };
                } catch (error) {
                    console.error("🔔 [readNoteTool][error]:", error);
                    throw new Error(`Failed to read note: ${error instanceof Error ? error.message : 'Unknown error'}`);

                }
            },
            render: (invocation) => {
                return React.createElement(ReadNoteRenderUI, {
                    invocation,
                    channelId
                });
            }
        };
    }

    /**
     * Update an existing note/thought
     */
    private updateNoteTool(channelId: string): Tool {
        // Switch to User-Interaction pattern: require explicit user confirmation
        return {
            name: 'updateNote',
            description: 'Update an existing note/thought by its ID (requires user confirmation).',
            parameters: {
                type: 'object',
                properties: {
                    noteId: { type: 'string', description: 'ID of the note/thought to update' },
                    content: { type: 'string', description: 'New content for the note/thought' },
                },
                required: ['noteId', 'content'],
            },
            // No execute: we will do actual update inside the confirm UI
            render: (invocation, onResult) =>
                React.createElement(UpdateNoteConfirmUI, { invocation, onResult, channelId }),
        };
    }

    /**
     * Delete a note/thought by ID
     */
    private deleteNoteTool(channelId: string): Tool {
        // Switch to User-Interaction pattern: require explicit user confirmation
        return {
            name: 'deleteNote',
            description: 'Delete a note/thought by its ID (requires user confirmation).',
            parameters: {
                type: 'object',
                properties: {
                    noteId: { type: 'string', description: 'ID of the note/thought to delete' },
                },
                required: ['noteId'],
            },
            // No execute: we will do actual deletion inside the confirm UI
            render: (invocation, onResult) =>
                React.createElement(DeleteNoteConfirmUI, { invocation, onResult, channelId }),
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
