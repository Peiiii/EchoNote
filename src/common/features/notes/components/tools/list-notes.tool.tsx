import { channelMessageService } from '@/core/services/channel-message.service';
import { Tool, ToolCall, ToolResult } from '@agent-labs/agent-chat';
import { List } from 'lucide-react';

// Render component - 极简设计，大道至简
interface ListNotesToolRenderProps {
    limit: number;
    channelId: string;
}

export function ListNotesToolRender({ limit, channelId }: ListNotesToolRenderProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <List className="w-4 h-4" />
            <span>Listing {limit} notes from channel {channelId}</span>
        </div>
    );
}

// Factory function to create the listNotes tool
export function createListNotesTool(channelId: string): Tool {
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
        execute: async (toolCall: ToolCall): Promise<ToolResult> => {
            try {
                const args = JSON.parse(toolCall.function.arguments);
                const { limit = 10 } = args;

                const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
                const notes = channelState?.messages || [];
                
                console.log("🔔 [listNotesTool][notes]:", { notes, channelId, args, limit, channelState });
                
                const notesForDisplay = notes.map((note) => ({
                    content: note.content.substring(0, 60) + (note.content.length > 60 ? '...' : ''),
                    contentLength: note.content.length,
                    timestamp: note.timestamp,
                    timestampReadable: note.timestamp.toLocaleString(),
                    noteId: note.id,
                }));

                return {
                    toolCallId: toolCall.id,
                    result: JSON.stringify(notesForDisplay),
                    state: 'result' as const
                };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                return {
                    toolCallId: toolCall.id,
                    result: `Error: ${errorMessage}`,
                    state: 'result' as const
                };
            }
        },
        // render: 极简展示
        render: (toolInvocation) => {
            const args = toolInvocation.args as { limit?: number };
            const { limit = 10 } = args;

            return (
                <ListNotesToolRender
                    limit={limit}
                    channelId={channelId}
                />
            );
        }
    };
}
