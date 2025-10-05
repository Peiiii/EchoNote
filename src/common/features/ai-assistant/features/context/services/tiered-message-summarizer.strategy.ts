import type { Message } from "@/core/stores/notes-data.store";
import type { ContextItem, MessageSummarizer } from "../types/message-summarizer.types";

export class TieredMessageSummarizer implements MessageSummarizer {
  
  private readonly TIER_LIMITS = {
    latest: 20000,
    recent: 2000,
    historical: 200,
    archive: 30,
  } as const;
  
  private readonly MAX_LENGTH = 200000;

  summarizeMessages(messages: Message[], maxLength?: number): ContextItem[] {
    const _lengthLimit = maxLength || this.MAX_LENGTH;
    const userMessages = messages.filter(msg => msg.sender === 'user');
    
    if (userMessages.length === 0) {
      return [{
        description: 'User Notes Context',
        value: JSON.stringify({ empty: true, message: 'No user notes available' })
      }];
    }

    // Group messages by tiers
    const tieredMessages = this.groupMessagesByTier(userMessages);
    
    // Build JSON context
    const jsonContext = this.buildContextJSON(tieredMessages, _lengthLimit);
    
    return [{
      description: 'User Notes Context (Structured)',
      value: JSON.stringify(jsonContext)
    }];
  }

  private groupMessagesByTier(messages: Message[]): Array<{
    name: string;
    description: string;
    items: Message[];
    charLimit: number;
  }> {
    const groups = [
      {
        name: '1',
        description: 'Most recent note (full content)',
        items: [] as Message[],
        charLimit: this.TIER_LIMITS.latest
      },
      {
        name: '2-5',
        description: 'Recent notes (detailed)',
        items: [] as Message[],
        charLimit: this.TIER_LIMITS.recent
      },
      {
        name: '6-30',
        description: 'Historical notes (summarized)',
        items: [] as Message[],
        charLimit: this.TIER_LIMITS.historical
      },
      {
        name: '31+',
        description: 'Archive notes (brief)',
        items: [] as Message[],
        charLimit: this.TIER_LIMITS.archive
      }
    ];

    messages.forEach((message, index) => {
      const groupIndex = this.getMessageGroupIndex(index);
      if (groupIndex >= 0 && groupIndex < groups.length) {
        groups[groupIndex].items.push(message);
      }
    });

    return groups;
  }

  private getMessageGroupIndex(index: number): number {
    if (index === 0) return 0; // '1'
    if (index >= 1 && index <= 4) return 1; // '2-5'
    if (index >= 5 && index <= 29) return 2; // '6-30'
    return 3; // '31+'
  }

  private buildContextJSON(messageGroups: Array<{
    name: string;
    description: string;
    items: Message[];
    charLimit: number;
  }>, lengthLimit: number): Record<string, unknown> {
    const allMessages = messageGroups.flatMap(group => group.items);
    if (allMessages.length === 0) {
      return { 
        empty: true, 
        message: 'No user notes available',
        sampling_rules: this.getSamplingRulesDescription()
      };
    }

    const context: Record<string, unknown> = {
      sampling_rules: this.getSamplingRulesDescription(),
      groups: []
    };
    let totalLength = 0;
    let processedCount = 0;

    // Process groups in priority order
    for (const group of messageGroups) {
      if (group.items.length === 0) continue;

      const groupData = this.buildGroupJSON(group);
      const groupLength = this.getTextLength(JSON.stringify(groupData));
      
      if (totalLength + groupLength <= lengthLimit) {
        (context.groups as Record<string, unknown>[]).push(groupData);
        totalLength += groupLength;
        processedCount += group.items.length;
      } else {
        break;
      }
    }

    const remainingCount = allMessages.length - processedCount;
    if (remainingCount > 0) {
      context.additional_notes = {
        count: remainingCount,
        message: 'Use search tools to access more content'
      };
    }

    return context;
  }

  private buildGroupJSON(group: {
    name: string;
    description: string;
    items: Message[];
    charLimit: number;
  }): Record<string, unknown> {
    const groupData: Record<string, unknown> = {
      name: group.name,
      description: group.description,
      items: []
    };

    group.items.forEach((message) => {
      const processedContent = this.processMessageContent(message, group.charLimit);
      const itemData: Record<string, unknown> = {
        id: message.id,
        timestamp: message.timestamp.toISOString(),
        channel_id: message.channelId,
        content: processedContent.content
      };

      if (processedContent.truncated) {
        itemData.truncated = true;
        itemData.original_length = processedContent.originalLength;
        itemData.truncated_length = processedContent.truncatedLength;
      }

      (groupData.items as Record<string, unknown>[]).push(itemData);
    });

    return groupData;
  }

  private processMessageContent(message: Message, charLimit: number): { content: string; truncated?: boolean; originalLength?: number; truncatedLength?: number } {
    if (message.content.length <= charLimit) {
      return { content: message.content };
    }

    const truncatedContent = this.truncateContent(message.content, charLimit);
    return {
      content: truncatedContent,
      truncated: true,
      originalLength: message.content.length,
      truncatedLength: truncatedContent.length
    };
  }

  private truncateContent(content: string, charLimit: number): string {
    if (content.length <= charLimit) {
      return content;
    }

    const startRatio = 0.7;
    const endRatio = 0.3;
    const separator = "...";

    const startChars = Math.floor(charLimit * startRatio);
    const endChars = Math.floor(charLimit * endRatio);

    const availableStart = Math.max(0, startChars - separator.length);
    const availableEnd = Math.max(0, endChars - separator.length);

    const startPart = content.substring(0, availableStart);
    const endPart = content.substring(content.length - availableEnd);

    return `${startPart}${separator}${endPart}`;
  }

  private getTextLength(text: string): number {
    return text?.length || 0;
  }

  private getSamplingRulesDescription(): string {
    return `USER NOTES CONTEXT ORGANIZATION:

Notes are sorted by timestamp (newest first) and organized into groups by position with different detail levels:

1. POSITION 1 (Most Recent):
   - Contains: The single most recent user note
   - Detail level: FULL CONTENT (up to ${this.TIER_LIMITS.latest} characters)
   - Purpose: Provides complete context of user's latest thoughts
   - Usage: Reference for immediate context and current user state

2. POSITIONS 2-5 (Recent Notes):
   - Contains: Notes from positions 2, 3, 4, and 5 (if they exist)
   - Detail level: DETAILED (up to ${this.TIER_LIMITS.recent} characters each)
   - Purpose: Recent context and immediate history
   - Usage: Understanding recent user patterns and immediate background

3. POSITIONS 6-30 (Historical Notes):
   - Contains: Notes from positions 6 through 30 (if they exist)
   - Detail level: SUMMARIZED (up to ${this.TIER_LIMITS.historical} characters each)
   - Purpose: Historical context and patterns
   - Usage: Understanding user's longer-term thinking patterns and themes

4. POSITIONS 31+ (Archive Notes):
   - Contains: All notes from position 31 onwards (if they exist)
   - Detail level: BRIEF (up to ${this.TIER_LIMITS.archive} characters each)
   - Purpose: Distant historical context
   - Usage: Identifying long-term themes and patterns

CONTENT PROCESSING:
- Long content is intelligently truncated preserving 70% from start + 30% from end
- Truncated items include metadata: truncated=true, original_length, truncated_length
- Each note includes: id, timestamp, channel_id, content
- Use search tools to access full content of truncated or additional notes

GROUP STRUCTURE:
Each group contains: name (position range), description (purpose), and items array (actual notes)
Groups are processed in priority order (1 → 2-5 → 6-30 → 31+) until token limit is reached`;
  }

  /**
   * Debug function to test message summarization with sample data
   * Call this in browser console: window.debugMessageSummarizer()
   */
  debugSummarizeMessages(sampleMessages?: Message[]): void {
    const messages = sampleMessages || this.generateSampleMessages();
    
    console.group('🔍 Message Summarizer Debug');
    console.log('📝 Input Messages:', messages);
    
    const result = this.summarizeMessages(messages);
    console.log('📊 Summary Result:', result);
    
    if (result[0]?.value) {
      try {
        const parsed = JSON.parse(result[0].value);
        console.log('📋 Parsed JSON:', parsed);
        console.log('📏 Length:', this.getTextLength(result[0].value));
        console.log('📐 Character Count:', result[0].value.length);
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e);
      }
    }
    
    console.groupEnd();
  }

  private generateSampleMessages(): Message[] {
    const now = new Date();
    return [
      {
        id: '1',
        content: 'This is the latest note with full content that should be preserved completely. It contains important information about the current project status and next steps.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 5), // 5 minutes ago
        sender: 'user',
        channelId: 'channel1'
      },
      {
        id: '2',
        content: 'This is a recent note that should be included with good detail. It discusses the implementation approach and technical considerations.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
        sender: 'user',
        channelId: 'channel1'
      },
      {
        id: '3',
        content: 'This is a historical note that should be summarized. It contains older information that is less critical but still relevant for context.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
        sender: 'user',
        channelId: 'channel2'
      },
      {
        id: '4',
        content: 'This is an archive note that should be brief. Very old information that provides minimal context.',
        timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
        sender: 'user',
        channelId: 'channel1'
      }
    ];
  }
}
