import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { ConversationContextMode, type ConversationContextConfig } from "@/common/types/ai-conversation";
import { channelMessageService } from "@/core/services/channel-message.service";
import type { Message } from "@/core/stores/notes-data.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { HybridMessageSummarizer } from "./hybrid-message-summarizer.strategy";
import { useNotesViewStore } from "@/core/stores/notes-view.store";


const MESSAGE_LIMIT_PER_CHANNEL = 1000;


export class SessionContextManager {
  private summarizer = new HybridMessageSummarizer();

  /**
   * Generate system instructions for unified context
   */
  private generateSystemInstructions(channelCount: number, totalNotes: number, channelNames: string[], primaryChannelId: string): string {
    const isMultiChannel = channelCount > 1;
    const channelContext = isMultiChannel
      ? `a multi-channel context spanning ${channelCount} channels: ${channelNames.join(', ')}`
      : `the channel: ${channelNames[0]}`;

    const contextUnderstanding = isMultiChannel
      ? `- You have access to notes from multiple channels, each representing different topics or contexts
- Notes are organized by recency with different detail levels across all channels
- Use channel information to understand the source and context of each note
- Look for patterns and connections that span across different channels`
      : `- You have access to notes from this channel, representing the user's thoughts and ideas
- Notes are organized by recency with different detail levels
- Use this context to understand the user's thinking patterns and provide relevant insights`;

    return `You are EchoNote AI, a specialized assistant focused on personal growth and cognitive enhancement. Your mission is to help users become who they want to be.

You are currently assisting in ${channelContext}
This context contains ${totalNotes} thought records, representing the collective knowledge and ideas.

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
- Analyze hidden connections between notes${isMultiChannel ? ' across different channels' : ''}
- Discover users' knowledge blind spots and cognitive gaps
- Provide new insights and connections${isMultiChannel ? ' across channel boundaries' : ''}
- Help users build comprehensive knowledge systems

## Your Working Approach:
In every conversation, you should:
1. First focus on the user's growth status, actively analyze and point out problems
2. Then help users uncover the essence of problems and enhance cognitive levels
3. Finally provide insights and discoveries from a knowledge perspective

## Context Understanding:
${contextUnderstanding}

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
- For operations in the current context, use the channelId: "${primaryChannelId}"
- For operations in other channels, use the specific channel ID provided by the user
- Always specify the channelId explicitly - it is a required parameter for all tools

Always be concise, actionable, and focused on helping users maximize their potential in this collaborative knowledge space.`;
  }

  /**
   * Ensure that all channels required for the given context configuration are loaded.
   * This method triggers loading for channels that haven't been loaded yet.
   */
  ensureContextsLoaded(contexts: ConversationContextConfig | null, fallbackChannelId: string) {
    if (!contexts) {
      // Auto mode: ensure fallback channel is loaded
      const channelState = channelMessageService.dataContainer.get().messageByChannel[fallbackChannelId];
      if (!channelState || channelState.hasMore) {
        channelMessageService.requestLoadInitialMessages$.next({ channelId: fallbackChannelId, messageLimit: MESSAGE_LIMIT_PER_CHANNEL });
      }
      return;
    }

    const { mode, channelIds } = contexts;

    if (mode === ConversationContextMode.AUTO) {
      const currentChannelId = useNotesViewStore.getState().currentChannelId!
      const channelState = channelMessageService.dataContainer.get().messageByChannel[currentChannelId];
      if (!channelState || channelState.hasMore) {
        channelMessageService.requestLoadInitialMessages$.next({ channelId: currentChannelId, messageLimit: MESSAGE_LIMIT_PER_CHANNEL });
      }
      return;
    }

    if (mode === ConversationContextMode.CHANNELS && channelIds) {
      // Load specific channels
      channelIds.forEach(id => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[id];
        if (!channelState || channelState.hasMore) {
          channelMessageService.requestLoadInitialMessages$.next({ channelId: id, messageLimit: MESSAGE_LIMIT_PER_CHANNEL });
        }
      });
    } else if (mode === ConversationContextMode.ALL) {
      // Load all channels
      const { channels } = useNotesDataStore.getState();
      channels.forEach(channel => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[channel.id];
        if (!channelState || channelState.hasMore) {
          channelMessageService.requestLoadInitialMessages$.next({ channelId: channel.id, messageLimit: MESSAGE_LIMIT_PER_CHANNEL });
        }
      });
    }
    // NONE mode doesn't require any channel loading
  }

  /**
   * Get conversation-scoped contexts. Fallback to a provided channel when no explicit contexts are set.
   */
  getSessionContexts(conversationId: string, fallbackChannelId: string) {
    const conv = useConversationStore.getState().conversations.find(c => c.id === conversationId);
    if (!conv || !conv.contexts) {
      return this.getUnifiedContext([fallbackChannelId]);
    }

    const { mode, channelIds } = conv.contexts;
    if (mode === ConversationContextMode.NONE) {
      return [
        {
          description: 'System Instructions',
          value: JSON.stringify({ instructions: 'No external context is attached to this conversation. Respond based on user input only unless the user explicitly asks to reference notes.' })
        }
      ];
    }

    if (mode === ConversationContextMode.CHANNELS) {
      const ids = channelIds || [];
      if (ids.length === 0) return [];
      return this.getUnifiedContext(ids);
    }

    // mode === ConversationContextMode.ALL
    // Use all channels from notes data store (loading should be triggered by context control)
    const { channels } = useNotesDataStore.getState();
    const channelStates = channelMessageService.dataContainer.get().messageByChannel;

    // Get all loaded channel IDs
    const readyIds = channels
      .map(c => c.id)
      .filter(id => {
        const channelState = channelStates[id];
        return channelState && !channelState.loading; // loaded and not currently loading
      });

    if (readyIds.length === 0) {
      // No loaded channels yet; return fallback channel context
      return this.getUnifiedContext([fallbackChannelId]);
    }

    // Use unified context strategy for all channels
    return this.getUnifiedContext(readyIds);
  }

  /**
   * Get unified context for channels using intelligent summarization
   */
  private getUnifiedContext(channelIds: string[]): Array<{
    description: string;
    value: string;
  }> {
    const { channels } = useNotesDataStore.getState();
    const channelStates = channelMessageService.dataContainer.get().messageByChannel;

    // Collect all messages from all channels
    const allMessages: (Message & { channelId: string; channelName: string })[] = [];

    channelIds.forEach(channelId => {
      const channel = channels.find(c => c.id === channelId);
      const channelState = channelStates[channelId];

      if (channel && channelState?.messages) {
        const userMessages = channelState.messages
          .filter(msg => msg.sender === 'user')
          .map(msg => ({
            ...msg,
            channelId,
            channelName: channel.name
          }));

        allMessages.push(...userMessages);
      }
    });

    // Sort all messages by timestamp (newest first)
    allMessages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Use message summarizer to process all messages
    const contextItems = this.summarizer.summarizeMessages(allMessages);

    // Generate channel information
    const channelInfo = channelIds.map(id => {
      const channel = channels.find(c => c.id === id);
      return {
        id,
        name: channel?.name || 'Unknown',
        note_count: channel?.messageCount || 0
      };
    });

    // Generate system instructions for context
    const channelNames = channelInfo.map(ch => ch.name);
    const totalNotes = allMessages.length;
    const systemInstructions = this.generateSystemInstructions(
      channelIds.length,
      totalNotes,
      channelNames,
      channelIds[0] // primary channel ID for tool usage
    );

    return [
      {
        description: 'System Instructions',
        value: systemInstructions
      },
      {
        description: 'Channel Information',
        value: JSON.stringify({
          channels: channelInfo,
          total_channels: channelIds.length,
          total_notes: totalNotes
        })
      },
      ...contextItems
    ];
  }

}

export const sessionContextManager = new SessionContextManager();