import { Tool, ToolCall, ToolResult } from '@agent-labs/agent-chat';
import { List } from 'lucide-react';
import { useChatDataStore } from '@/core/stores/chat-data.store';
import { Message, Channel } from '@/core/stores/chat-data.store';

// Render component - 极简设计，大道至简
interface ListNotesToolRenderProps {
    limit: number;
    channelId: string;
}

export function ListNotesToolRender({ limit, channelId }: ListNotesToolRenderProps) {
    const chatDataStore = useChatDataStore();

    // 获取channel名称
    const channel = chatDataStore.channels.find((ch: Channel) => ch.id === channelId);
    const channelName = channel?.name || channelId;

    return (
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <List className="w-4 h-4" />
            <span>Listing {limit} notes from {channelName}</span>
        </div>
    );
}

// Factory function to create the listNotes tool
export function createListNotesTool(channelId: string): Tool {
    return {
        name: 'listNotes',
        description: 'List all notes in the current channel',
        parameters: {
            type: 'object',
            properties: {
                limit: {
                    type: 'number',
                    description: 'Maximum number of notes to return (default: 10)'
                }
            },
            required: []
        },
        // execute: 执行业务逻辑，返回结果给AI
        execute: async (toolCall: ToolCall): Promise<ToolResult> => {
            try {
                const args = JSON.parse(toolCall.function.arguments);
                const { limit = 10 } = args;

                const chatDataStore = useChatDataStore.getState();

                // 获取channel名称
                const channel = chatDataStore.channels.find((ch: Channel) => ch.id === channelId);
                const channelName = channel?.name || channelId;

                const channelMessages = chatDataStore.messagesByChannel[channelId];
                const notes = channelMessages?.messages || [];
                console.log("🔔 [listNotesTool][notes]:", { notes, channelId, args, limit, channelMessages, channels: chatDataStore.channels, chatDataStore });
                // 简洁的结果格式，使用channel名称
                const resultText = `Found ${notes.length} notes in ${channelName}:\n${notes.map((note: Message) =>
                    `• ${note.content.substring(0, 60)}${note.content.length > 60 ? '...' : ''}`
                ).join('\n')}`;

                return {
                    toolCallId: toolCall.id,
                    result: resultText,
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
