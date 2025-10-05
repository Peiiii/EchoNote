import type { Message } from "@/core/stores/notes-data.store";

export interface ContextItem {
  description: string;
  value: string;
}

export interface MessageSummarizer {
  /**
   * Summarize messages with tiered detail levels
   * @param messages - Array of messages sorted by timestamp (newest first)
   * @param maxTokens - Maximum token limit (default: 50000)
   * @returns Array of context items for the AI agent
   */
  summarizeMessages(messages: Message[], maxTokens?: number): ContextItem[];
}
