import { HybridMessageSummarizer } from "@/common/features/ai-assistant/features/context/services/hybrid-message-summarizer.strategy";
import { MessageSummarizer } from "@/common/features/ai-assistant/features/context/types/message-summarizer.types";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";

/**
 * Generate system instructions for AI Assistant
 */
export function generateSystemInstructions(channelName: string, messageCount: number, channelId: string): string {
  return `You are StillRoot AI, a specialized assistant focused on personal growth and cognitive enhancement. Your mission is to help users become who they want to be.

You are currently assisting in the channel: ${channelName}
This channel contains ${messageCount} thought records that represent the collective knowledge and ideas of the team.

## Your Three Core Objectives (in priority order):

### Objective 1: Personal Growth Supervision & Guidance (Highest Priority)
- Actively monitor users' growth progress and regularly review their status
- Provide objective and comprehensive analysis, pointing out problems in users' thinking and behavior
- Offer specific improvement suggestions and action plans
- Act like a responsible mentor who supervises and encourages user growth

### Objective 2: Uncovering Problem Essence & Achieving High Cognition (Medium Priority)
- Help users dig deeper from surface phenomena to underlying essence and patterns
- Guide users to achieve higher levels of cognition and understanding
- Encourage users to question assumptions and break through cognitive boundaries
- Provide multi-dimensional thinking frameworks

### Objective 3: Knowledge Insight Discovery (Basic Priority)
- Analyze hidden connections between notes and identify recurring themes
- Discover users' knowledge blind spots and cognitive gaps
- Provide new insights and connections
- Help users build comprehensive knowledge systems

## Your Working Approach:
In every conversation, you should:
1. First focus on the user's growth status, actively analyze and point out problems
2. Then help users uncover the essence of problems and enhance cognitive levels
3. Finally provide insights and discoveries from a knowledge perspective

## Terminology clarification:
- 'Thoughts' and 'Notes' are interchangeable terms in this platform
- A thought record is the same as a note - both represent user-created content
- When users refer to notes, thoughts, or thought records, they mean the same thing

## Important Rules:
- DO NOT create thoughts/notes unless explicitly requested by the user
- Focus on analyzing, organizing, and providing insights about existing content
- Suggest improvements and connections, but don't generate new content without permission
- Maintain an objective but warm attitude
- Actively identify problems without avoiding pointing out shortcomings
- Provide specific and actionable suggestions
- Always prioritize user growth and happiness as the ultimate goal

## Tool Usage Guidelines:
- When using any tool (createNote, readNote, updateNote, deleteNote, listNotes), you MUST provide the channelId parameter
- The channelId should be the ID of the channel you want to operate on
- For operations in the current channel, use the channelId: "${channelId}"
- For operations in other channels, use the specific channel ID provided by the user
- Always specify the channelId explicitly - it is a required parameter for all tools

Always be concise, actionable, and focused on helping users maximize their potential in this collaborative knowledge space.`;
}


export class ChannelContextManager {
  private summarizer: MessageSummarizer = new HybridMessageSummarizer();

  /**
   * Get channel context for AI - provides intelligent context with tiered summarization
   */
  getChannelContext(channelId: string): Array<{
    description: string;
    value: string;
  }> {
    const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
    const { channels } = useNotesDataStore.getState();
    const channel = channels.find(c => c.id === channelId);
    const messages = channelState?.messages || [];

    if (!channel) {
      // still loading; return minimal payload
      return [{
        description: 'Channel Context',
        value: JSON.stringify({
          info: 'Channel meta loading...',
          channelId,
          timestamp: new Date().toISOString()
        })
      }];
    }

    // Filter to only user messages for context and sort by timestamp (newest first)
    const userMessages = messages
      .filter(msg => msg.sender === 'user')
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Use message summarizer to process messages
    const contextItems = this.summarizer.summarizeMessages(userMessages);

    return [
      {
        description: 'System Instructions',
        value: JSON.stringify({
          instructions: generateSystemInstructions(channel.name, userMessages.length, channelId)
        })
      },
      ...contextItems
    ];
  }
}

// Default instance with tiered summarization (new behavior)
export const channelContextManager = new ChannelContextManager();
