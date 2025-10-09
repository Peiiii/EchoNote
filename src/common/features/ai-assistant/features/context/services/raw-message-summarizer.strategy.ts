import { useNotesDataStore, type Message } from "@/core/stores/notes-data.store";
import type { ContextItem, MessageSummarizer } from "../types/message-summarizer.types";

export class RawMessageSummarizer implements MessageSummarizer {
  /**
   * Process messages without any summarization - raw output by channel
   * @param messages - Array of messages sorted by timestamp (newest first)
   * @param maxTokens - Maximum token limit (ignored for raw output)
   * @returns Array of context items grouped by channel
   */
  summarizeMessages(messages: Message[], _maxTokens?: number): ContextItem[] {
    const userMessages = messages.filter(msg => msg.sender === "user");

    if (userMessages.length === 0) {
      return [
        {
          description: "No user content available",
          value: JSON.stringify({ message: "No user thoughts or notes found in this context." }),
        },
      ];
    }

    // Group messages by channel
    const messagesByChannel = userMessages.reduce(
      (acc, message) => {
        const channelId = message.channelId;
        if (!acc[channelId]) {
          acc[channelId] = [];
        }
        acc[channelId].push(message);
        return acc;
      },
      {} as Record<string, Message[]>
    );

    const contextItems: ContextItem[] = [];

    // Process each channel separately
    Object.entries(messagesByChannel).forEach(([channelId, channelMessages]) => {
      const channelInfo = useNotesDataStore.getState().channels.find(c => c.id === channelId);
      // Sort messages by timestamp (newest first) within each channel
      const sortedMessages = channelMessages.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );

      contextItems.push({
        description: `Channel ${channelId} - All messages (${sortedMessages.length} messages)`,
        value: JSON.stringify({
          channelId,
          messageCount: channelInfo?.messageCount,
          channelName: channelInfo?.name,
          messages: sortedMessages.map(msg => ({
            id: msg.id,
            content: msg.content,
            timestamp: msg.timestamp.toISOString(),
            sender: msg.sender,
            channelId: msg.channelId,
            tags: msg.tags,
          })),
        }),
      });
    });

    return contextItems;
  }
}
