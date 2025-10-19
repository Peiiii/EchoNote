import { channelMessageService } from "@/core/services/channel-message.service";
import { Message } from "@/core/stores/notes-data.store";

export class NoteManager {
  deleteMessage = async ({
    messageId,
    hardDelete,
    channelId,
  }: {
    messageId: string;
    hardDelete?: boolean;
    channelId: string;
  }) => {
    return await channelMessageService.deleteMessage({ messageId, hardDelete, channelId });
  };
  
  updateMessage = async ({
    messageId,
    updates,
    channelId,
    userId,
  }: {
    messageId: string;
    updates: Partial<Message>;
    channelId: string;
    userId: string;
  }) => {
    return await channelMessageService.updateMessage({ messageId, updates, channelId, userId });
  };

  sendMessage = async (message: Omit<Message, "id" | "timestamp">) => {
    return await channelMessageService.sendMessage(message);
  };
}
