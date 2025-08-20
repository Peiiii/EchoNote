import { Tool } from "@agent-labs/agent-chat";
import { createAnalyzeChannelTool } from "@/desktop/features/chat/components/tools/analyze-channel.tool";
import { createCreateTagTool } from "@/desktop/features/chat/components/tools/create-tag.tool";
import { createSearchMessagesTool } from "@/desktop/features/chat/components/tools/search-messages.tool";
import { createSummarizeContentTool } from "@/desktop/features/chat/components/tools/summarize-content.tool";

export class ChannelToolsManager {
  /**
   * Get channel-specific tools
   */
  getChannelTools(channelId: string): Tool[] {
    return [
      createAnalyzeChannelTool(channelId),
      createCreateTagTool(),
      createSummarizeContentTool(channelId),
      createSearchMessagesTool(channelId)
    ];
  }
}

export const channelToolsManager = new ChannelToolsManager();
