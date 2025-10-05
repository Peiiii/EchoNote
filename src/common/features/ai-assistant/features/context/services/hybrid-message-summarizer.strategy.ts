import { MessageSummarizer, ContextItem } from '../types/message-summarizer.types';
import { RawMessageSummarizer } from './raw-message-summarizer.strategy';
import { TieredMessageSummarizer } from './tiered-message-summarizer.strategy';
import type { Message } from '@/core/stores/notes-data.store';

/**
 * Hybrid Message Summarizer Strategy
 * 
 * This strategy combines the benefits of both raw and tiered approaches:
 * - Uses raw strategy for smaller datasets (fast, complete information)
 * - Automatically switches to tiered strategy when content exceeds token limits
 * - Provides seamless fallback to ensure optimal performance
 */
export class HybridMessageSummarizer implements MessageSummarizer {
  private rawSummarizer = new RawMessageSummarizer();
  private tieredSummarizer = new TieredMessageSummarizer();
  
  private readonly LENGTH_LIMIT = 50000;
  
  /**
   * Summarize messages using hybrid strategy
   * - First attempts raw strategy
   * - If content exceeds token limit, falls back to tiered strategy
   */
  summarizeMessages(messages: Message[]): ContextItem[] {
    if (messages.length === 0) {
      return [];
    }
    
    // First, try raw strategy
    const rawContext = this.rawSummarizer.summarizeMessages(messages);
    
    const totalLength = this.calculateTotalLength(rawContext);
    
    if (totalLength <= this.LENGTH_LIMIT) {
      console.log(`[HybridMessageSummarizer] Using raw strategy (${totalLength} chars)`);
      return rawContext;
    }
    
    console.log(`[HybridMessageSummarizer] Raw strategy exceeds limit (${totalLength} chars), switching to tiered strategy`);
    const tieredContext = this.tieredSummarizer.summarizeMessages(messages);
    
    const tieredLength = this.calculateTotalLength(tieredContext);
    console.log(`[HybridMessageSummarizer] Tiered strategy result: ${tieredLength} chars`);
    
    return tieredContext;
  }
  
  private calculateTotalLength(contextItems: ContextItem[]): number {
    return contextItems.reduce((total, item) => total + (item.value?.length || 0), 0);
  }
  
  /**
   * Get strategy information for debugging
   */
  getStrategyInfo(messages: Message[]): {
    messageCount: number;
    rawLength: number;
    tieredLength: number;
    strategyUsed: 'raw' | 'tiered';
    withinLimit: boolean;
  } {
    const rawContext = this.rawSummarizer.summarizeMessages(messages);
    const tieredContext = this.tieredSummarizer.summarizeMessages(messages);
    
    const rawLength = this.calculateTotalLength(rawContext);
    const tieredLength = this.calculateTotalLength(tieredContext);
    const withinLimit = rawLength <= this.LENGTH_LIMIT;
    const strategyUsed = withinLimit ? 'raw' : 'tiered';
    
    return {
      messageCount: messages.length,
      rawLength,
      tieredLength,
      strategyUsed,
      withinLimit
    };
  }
}
