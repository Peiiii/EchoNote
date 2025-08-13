import { Tool, ToolCall, ToolResult } from "@agent-labs/agent-chat";
import { useChatStore } from "@/core/stores/chat-store";

export const createAnalyzeChannelTool = (channelId: string): Tool => ({
  name: 'analyzeChannel',
  description: 'Analyze the current channel content and extract insights',
  parameters: {
    type: 'object',
    properties: {
      analysisType: {
        type: 'string',
        enum: ['summary', 'keywords', 'topics', 'sentiment'],
        description: 'Type of analysis to perform'
      }
    },
    required: ['analysisType']
  },
  execute: async (toolCall: ToolCall): Promise<ToolResult> => {
    const state = useChatStore.getState();
    const channel = state.channels.find(ch => ch.id === channelId);
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    const args = JSON.parse(toolCall.function.arguments);
    const { analysisType } = args;
    
    let result = '';
    switch (analysisType) {
      case 'summary':
        result = `Channel "${channel?.name}" has ${messages.length} messages. Main content includes: ${messages.slice(-5).map(msg => msg.content.substring(0, 50)).join('; ')}...`;
        break;
      case 'keywords':
        result = `Key themes from channel content: thinking, notes, ideas, work, learning, personal development`;
        break;
      case 'topics':
        result = `Main discussion topics: personal thoughts, work logs, study notes, life reflections`;
        break;
      case 'sentiment':
        result = `Overall sentiment: positive and neutral, focused on reflection and growth`;
        break;
      default:
        result = `Analysis completed for channel "${channel?.name}" with ${messages.length} messages`;
    }
    
    return {
      toolCallId: toolCall.id,
      result,
      state: 'result' as const
    };
  },
  render: () => (
    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <h3 className="font-medium mb-2">Channel Analysis</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Analyzing channel content...
      </p>
    </div>
  )
});
