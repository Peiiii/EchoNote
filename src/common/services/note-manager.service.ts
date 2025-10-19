import { channelMessageService } from "@/core/services/channel-message.service";


export class NoteManager {
  deleteMessage = async ({ messageId, hardDelete, channelId }: { messageId: string, hardDelete?: boolean, channelId: string }) => {
    return await channelMessageService.deleteMessage({ messageId, hardDelete, channelId });
  };
}