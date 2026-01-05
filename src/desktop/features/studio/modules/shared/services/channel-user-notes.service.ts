import { channelMessageService } from "@/core/services/channel-message.service";

export type ChannelUserNote = {
  channelId: string;
  content: string;
  timestamp: Date | number;
};

export async function getUserNotesFromChannels(
  channelIds: string[],
  options?: {
    maxMessagesPerChannel?: number;
    initialLimit?: number;
    pageSize?: number;
    timeoutMs?: number;
  }
): Promise<ChannelUserNote[]> {
  const notes: ChannelUserNote[] = [];

  for (const channelId of channelIds) {
    await channelMessageService.ensureMessagesLoaded(channelId, {
      maxMessages: options?.maxMessagesPerChannel ?? 200,
      initialLimit: options?.initialLimit ?? 50,
      pageSize: options?.pageSize ?? 50,
      timeoutMs: options?.timeoutMs ?? 15_000,
    });

    const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
    const userMessages = (channelState?.messages ?? []).filter(msg => msg.sender === "user");
    for (const msg of userMessages) {
      notes.push({
        channelId,
        content: msg.content || "",
        timestamp: msg.timestamp || new Date(0),
      });
    }
  }

  return notes;
}

