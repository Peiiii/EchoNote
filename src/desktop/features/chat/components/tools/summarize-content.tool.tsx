import { Tool, ToolCall, ToolResult } from "@agent-labs/agent-chat";
import { useChatDataStore } from "@/core/stores/chat-data.store";

export const createSummarizeContentTool = (channelId: string): Tool => ({
  name: 'summarizeContent',
  description: 'Summarize channel content based on time range',
  parameters: {
    type: 'object',
    properties: {
      timeRange: {
        type: 'string',
        enum: ['today', 'week', 'month', 'all'],
        description: 'Time range for summarization'
      }
    },
    required: ['timeRange']
  },
  execute: async (toolCall: ToolCall): Promise<ToolResult> => {
    const state = useChatDataStore.getState();
    const channel = state.channels.find(ch => ch.id === channelId);
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    const args = JSON.parse(toolCall.function.arguments);
    const { timeRange } = args;
    
    let filteredMessages = messages;
    const now = new Date();
    
    switch (timeRange) {
      case 'today': {
        filteredMessages = messages.filter(msg => {
          const msgDate = new Date(msg.timestamp);
          return msgDate.toDateString() === now.toDateString();
        });
        break;
      }
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filteredMessages = messages.filter(msg => 
          new Date(msg.timestamp) >= weekAgo
        );
        break;
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filteredMessages = messages.filter(msg => 
          new Date(msg.timestamp) >= monthAgo
        );
        break;
      }
    }
    
    const summary = `Channel "${channel?.name}" has ${filteredMessages.length} messages in ${timeRange} time range. Main content includes: ${filteredMessages.slice(-3).map(msg => msg.content.substring(0, 100)).join('; ')}...`;
    
    return {
      toolCallId: toolCall.id,
      result: summary,
      state: 'result' as const
    };
  },
  render: () => (
    <div className="p-4 border rounded-lg bg-purple-50 dark:bg-purple-900/20">
      <h3 className="font-medium mb-2">Content Summary</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Summarizing channel content...
      </p>
    </div>
  )
});
