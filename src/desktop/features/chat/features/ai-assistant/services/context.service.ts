import { channelMessageService } from '@/core/services/channel-message.service';
import { Message } from '@/core/stores/notes-data.store';
import { createSlice } from 'rx-nested-bean';

export interface ChannelContext {
  recentMessages: Message[];
  totalMessageCount: number;
  channelId: string;
}

export interface ContextServiceOptions {
  maxMessages?: number;
  maxContentLength?: number;
  excludeCurrentMessage?: boolean;
}

export class ChannelContextService {
  private static readonly DEFAULT_OPTIONS: Required<ContextServiceOptions> = {
    maxMessages: 20,
    maxContentLength: 2000,
    excludeCurrentMessage: true,
  };

  /**
   * Get channel context for AI insights generation
   * @param channelId - The channel ID
   * @param currentMessageId - The current message ID to exclude (optional)
   * @param options - Configuration options
   * @returns Channel context with recent messages
   */
  static getChannelContext(
    channelId: string,
    currentMessageId?: string,
    options: ContextServiceOptions = {}
  ): ChannelContext | null {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const state = createSlice(channelMessageService.dataContainer, `messageByChannel.${channelId}`).get();
    if (!state?.messages) {
      console.warn(`[ChannelContextService] No messages found for channel: ${channelId}`);
      return null;
    }

    let messages = state.messages;

    // Exclude current message if specified
    if (opts.excludeCurrentMessage && currentMessageId) {
      messages = messages.filter(msg => msg.id !== currentMessageId);
    }

    // Sort by timestamp (most recent first) and limit
    const recentMessages = messages
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, opts.maxMessages);

    // Truncate message content to avoid context overflow
    const truncatedMessages = recentMessages.map(msg => ({
      ...msg,
      content: this.truncateContent(msg.content, opts.maxContentLength)
    }));

    return {
      recentMessages: truncatedMessages,
      totalMessageCount: state.messages.length,
      channelId,
    };
  }

  /**
   * Format channel context for AI prompt using XML structure
   * @param context - Channel context
   * @returns Formatted context string with XML tags
   */
  static formatContextForPrompt(context: ChannelContext): string {
    if (context.recentMessages.length === 0) {
      return '';
    }

    const contextLines = [
      `\n<channel_context>`,
      `  <metadata>`,
      `    <recent_messages_count>${context.recentMessages.length}</recent_messages_count>`,
      `    <total_messages_count>${context.totalMessageCount}</total_messages_count>`,
      `    <channel_id>${context.channelId}</channel_id>`,
      `  </metadata>`,
      `  <recent_thoughts>`,
      ...context.recentMessages.map((msg, index) => {
        const readableTime = this.formatReadableTime(msg.timestamp);
        return `    <thought index="${index + 1}" timestamp="${readableTime}">${msg.content}</thought>`;
      }),
      `  </recent_thoughts>`,
      `</channel_context>\n`
    ];

    return contextLines.join('\n');
  }

  /**
   * Format timestamp to readable time string
   * @param timestamp - The timestamp to format
   * @returns Readable time string
   */
  private static formatReadableTime(timestamp: Date): string {
    return timestamp.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Truncate content to specified length while preserving meaning
   * @param content - Original content
   * @param maxLength - Maximum length
   * @returns Truncated content
   */
  private static truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    // Try to truncate at sentence boundary
    const truncated = content.substring(0, maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );

    if (lastSentenceEnd > maxLength * 0.7) {
      return truncated.substring(0, lastSentenceEnd + 1) + '...';
    }

    // Fallback to word boundary
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength * 0.8) {
      return truncated.substring(0, lastSpace) + '...';
    }

    // Final fallback
    return truncated + '...';
  }
}
