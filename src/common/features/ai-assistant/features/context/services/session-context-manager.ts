import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import {
  ConversationContextMode,
  type ConversationContextConfig,
} from "@/common/types/ai-conversation";
import { channelMessageService } from "@/core/services/channel-message.service";
import type { Message } from "@/core/stores/notes-data.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { HybridMessageSummarizer } from "./hybrid-message-summarizer.strategy";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { i18n } from "@/common/i18n";

const MESSAGE_LIMIT_PER_CHANNEL = 1000;

export class SessionContextManager {
  private summarizer = new HybridMessageSummarizer();

  /**
   * Generate system instructions for unified context
   */
  private generateSystemInstructions(
    channelCount: number,
    totalNotes: number,
    channelNames: string[],
    primaryChannelId: string
  ): string {
    const isMultiChannel = channelCount > 1;
    const channelContext = isMultiChannel
      ? `a multi-channel context spanning ${channelCount} channels: ${channelNames.join(", ")}`
      : `the channel: ${channelNames[0]}`;

    const t = i18n.t.bind(i18n);
    const contextUnderstanding = isMultiChannel
      ? t("aiAssistant.prompts.systemPrompts.stillRootAI.contextUnderstandingMulti")
      : t("aiAssistant.prompts.systemPrompts.stillRootAI.contextUnderstandingSingle");

    return `${t("aiAssistant.prompts.systemPrompts.stillRootAI.intro")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.multiChannelContext", { channelContext, totalNotes })}

## Your Three Core Objectives (in priority order):

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective1")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective2")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective3", { 
  multiChannel: isMultiChannel ? " across different channels" : "",
  multiChannelBoundary: isMultiChannel ? " across channel boundaries" : ""
})}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.workingApproach")}

## Context Understanding:
${contextUnderstanding}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.terminology")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.importantRules")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.toolUsageGuidelines", { channelId: primaryChannelId })}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.closing")}`;
  }

  /**
   * Ensure that all channels required for the given context configuration are loaded.
   * This method triggers loading for channels that haven't been loaded yet.
   */
  ensureContextsLoaded(contexts: ConversationContextConfig | null, fallbackChannelId: string) {
    if (!contexts) {
      // Auto mode: ensure fallback channel is loaded
      const channelState =
        channelMessageService.dataContainer.get().messageByChannel[fallbackChannelId];
      if (!channelState || channelState.hasMore) {
        channelMessageService.requestLoadInitialMessages$.next({
          channelId: fallbackChannelId,
          messageLimit: MESSAGE_LIMIT_PER_CHANNEL,
        });
      }
      return;
    }

    const { mode, channelIds } = contexts;

    if (mode === ConversationContextMode.AUTO) {
      const currentChannelId = useNotesViewStore.getState().currentChannelId!;
      const channelState =
        channelMessageService.dataContainer.get().messageByChannel[currentChannelId];
      if (!channelState || channelState.hasMore) {
        channelMessageService.requestLoadInitialMessages$.next({
          channelId: currentChannelId,
          messageLimit: MESSAGE_LIMIT_PER_CHANNEL,
        });
      }
      return;
    }

    if (mode === ConversationContextMode.CHANNELS && channelIds) {
      // Load specific channels
      channelIds.forEach(id => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[id];
        if (!channelState || channelState.hasMore) {
          channelMessageService.requestLoadInitialMessages$.next({
            channelId: id,
            messageLimit: MESSAGE_LIMIT_PER_CHANNEL,
          });
        }
      });
    } else if (mode === ConversationContextMode.ALL) {
      // Load all channels
      const { channels } = useNotesDataStore.getState();
      channels.forEach(channel => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[channel.id];
        if (!channelState || channelState.hasMore) {
          channelMessageService.requestLoadInitialMessages$.next({
            channelId: channel.id,
            messageLimit: MESSAGE_LIMIT_PER_CHANNEL,
          });
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
          description: "System Instructions",
          value: JSON.stringify({
            instructions:
              "No external context is attached to this conversation. Respond based on user input only unless the user explicitly asks to reference notes.",
          }),
        },
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
          .filter(msg => msg.sender === "user")
          .map(msg => ({
            ...msg,
            channelId,
            channelName: channel.name,
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
        name: channel?.name || "Unknown",
        note_count: channel?.messageCount || 0,
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
        description: "System Instructions",
        value: systemInstructions,
      },
      {
        description: "Channel Information",
        value: JSON.stringify({
          channels: channelInfo,
          total_channels: channelIds.length,
          total_notes: totalNotes,
        }),
      },
      ...contextItems,
    ];
  }
}

export const sessionContextManager = new SessionContextManager();
