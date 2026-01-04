import { HybridMessageSummarizer } from "@/common/features/ai-assistant/features/context/services/hybrid-message-summarizer.strategy";
import { MessageSummarizer } from "@/common/features/ai-assistant/features/context/types/message-summarizer.types";
import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { i18n } from "@/common/i18n";

/**
 * Generate system instructions for AI Assistant
 */
export function generateSystemInstructions(
  channelName: string,
  messageCount: number,
  channelId: string
): string {
  const t = i18n.t.bind(i18n);
  return `${t("aiAssistant.prompts.systemPrompts.stillRootAI.intro")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.channelContext", { channelName, messageCount })}

## Your Three Core Objectives (in priority order):

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective1")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective2")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.objective3", { multiChannel: "", multiChannelBoundary: "" })}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.workingApproach")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.terminology")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.importantRules")}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.toolUsageGuidelines", { channelId })}

${t("aiAssistant.prompts.systemPrompts.stillRootAI.closing")}`;
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
      return [
        {
          description: "Channel Context",
          value: JSON.stringify({
            info: "Channel meta loading...",
            channelId,
            timestamp: new Date().toISOString(),
          }),
        },
      ];
    }

    // Filter to only user messages for context and sort by timestamp (newest first)
    const userMessages = messages
      .filter(msg => msg.sender === "user")
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Use message summarizer to process messages
    const contextItems = this.summarizer.summarizeMessages(userMessages);

    return [
      {
        description: "System Instructions",
        value: JSON.stringify({
          instructions: generateSystemInstructions(channel.name, userMessages.length, channelId),
        }),
      },
      ...contextItems,
    ];
  }
}

// Default instance with tiered summarization (new behavior)
export const channelContextManager = new ChannelContextManager();
