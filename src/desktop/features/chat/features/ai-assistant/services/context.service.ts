import { Message } from '@/core/stores/chat-data.store';
import { useChatDataStore } from '@/core/stores/chat-data.store';

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
    maxMessages: 10,
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
    const state = useChatDataStore.getState();
    
    const channelState = state.messagesByChannel[channelId];
    if (!channelState?.messages) {
      console.warn(`[ChannelContextService] No messages found for channel: ${channelId}`);
      return null;
    }

    let messages = channelState.messages;
    
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
      totalMessageCount: channelState.messages.length,
      channelId,
    };
  }

  /**
   * Format channel context for AI prompt
   * @param context - Channel context
   * @returns Formatted context string
   */
  static formatContextForPrompt(context: ChannelContext): string {
    if (context.recentMessages.length === 0) {
      return '';
    }

    const contextLines = [
      `\n--- Channel Context (${context.recentMessages.length} recent messages from ${context.totalMessageCount} total) ---`,
      'Recent thoughts in this channel:',
      ...context.recentMessages.map((msg, index) => 
        `${index + 1}. ${msg.content}`
      ),
      '--- End Channel Context ---\n'
    ];

    return contextLines.join('\n');
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
