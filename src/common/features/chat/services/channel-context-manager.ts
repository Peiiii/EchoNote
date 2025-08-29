import { channelMessageService } from "@/core/services/channel-message.service";
import { useChatDataStore } from "@/core/stores/chat-data.store";

export class ChannelContextManager {
  /**
   * Get channel context for AI - provides simple channel data
   */
  getChannelContext(channelId: string): Array<{
    description: string;
    value: string;
  }> {
    // Get channel and message data
    const state = channelMessageService.dataContainer.get();
    const channelState = state.messageByChannel[channelId];
    const channel = useChatDataStore.getState().channels.find(ch => ch.id === channelId);
    const messages = channelState.messages || [];

    if (!channelState || !channel) {
      return [{
        description: 'Channel Context',
        value: JSON.stringify({
          error: 'Channel not found',
          channelId,
          timestamp: new Date().toISOString()
        })
      }];
    }

    // Simple context with just notes list
    const simpleContext = {
      currentChannel: {
        id: channel.id,
        name: channel.name,
        description: channel.description || '',
        thoughts: messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          sender: msg.sender
        })),
        totalNotes: messages.length,
      },
      timestamp: new Date().toISOString()
    };

    return [
      {
        description: 'System Instructions',
        value: JSON.stringify({
          instructions: [
            "You are EchoNote AI, a specialized assistant for a collaborative note-taking and knowledge management platform.",
            "Your role is to help users organize thoughts, synthesize information, and collaborate effectively within their channels.",
            "You are currently assisting in the channel: " + channel.name,
            "This channel contains " + messages.length + " thought records that represent the collective knowledge and ideas of the team.",
            "Key capabilities:",
            "- Help organize and structure thoughts and ideas",
            "- Provide insights and connections between different notes",
            "- Assist with knowledge synthesis and summarization", 
            "- Support collaborative problem-solving and brainstorming",
            "- Help maintain clear and organized channel content",
            "Important rules:",
            "- DO NOT create notes or thoughts unless explicitly requested by the user",
            "- Focus on analyzing, organizing, and providing insights about existing content",
            "- Suggest improvements and connections, but don't generate new content without permission",
            "Always be concise, actionable, and focused on helping users make the most of their collaborative knowledge space."
          ]
        })
      },
      {
        description: `Channel Context for channel "${channel.name}" - ${messages.length} thoughts`,
        value: JSON.stringify(simpleContext)
      }
    ];
  }
}

export const channelContextManager = new ChannelContextManager();