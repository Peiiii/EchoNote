import { useChatDataStore } from "@/core/stores/chat-data.store";

export class ChannelContextManager {
  /**
   * Get channel context for AI - provides simple channel data
   */
  getChannelContext(channelId: string): {
    description: string;
    value: string;
  } {
    // Get channel and message data
    const state = useChatDataStore.getState();
    const channel = state.channels.find(ch => ch.id === channelId);
    const messages = state.messages.filter(msg => msg.channelId === channelId);
    
    if (!channel) {
      return {
        description: 'Channel Context',
        value: JSON.stringify({
          error: 'Channel not found',
          channelId,
          timestamp: new Date().toISOString()
        })
      };
    }

    // Simple context with just notes list
    const simpleContext = {
      channel: {
        id: channel.id,
        name: channel.name,
        description: channel.description || ''
      },
      notes: messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        sender: msg.sender
      })),
      totalNotes: messages.length,
      timestamp: new Date().toISOString()
    };

    return {
      description: `Channel Context for "${channel.name}" - ${messages.length} notes`,
      value: JSON.stringify(simpleContext)
    };
  }
}

export const channelContextManager = new ChannelContextManager();
