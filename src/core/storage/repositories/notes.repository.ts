import type { Channel, Message, ShareMode } from "@/core/types/notes";
import type { Cursor, PaginatedResult, Unsubscribe } from "@/core/storage/types";

export interface NotesRepositoryCapabilities {
  realtime: boolean;
  pagination: "cursor" | "offset" | "none";
}

export type ListMessagesOptions = {
  limit: number;
  cursor?: Cursor | null;
  includeSenders?: Array<"user" | "ai">;
};

export interface NotesRepository {
  readonly capabilities: NotesRepositoryCapabilities;

  listChannels(userId: string): Promise<Channel[]>;
  subscribeChannels?: (userId: string, onUpdate: (channels: Channel[]) => void) => Unsubscribe;

  createChannel(
    userId: string,
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string>;
  updateChannel(
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void>;
  deleteChannel(userId: string, channelId: string): Promise<void>;

  listMessages(
    userId: string,
    channelId: string,
    options: ListMessagesOptions
  ): Promise<PaginatedResult<Message>>;

  subscribeNewMessages?: (
    userId: string,
    channelId: string,
    after: Date,
    onUpdate: (messages: Message[]) => void
  ) => Unsubscribe;

  createMessage(userId: string, message: Omit<Message, "id" | "timestamp">): Promise<string>;
  updateMessage(userId: string, messageId: string, updates: Partial<Message>): Promise<void>;
  deleteMessage(userId: string, messageId: string, options?: { hardDelete?: boolean }): Promise<void>;
  restoreMessage(userId: string, messageId: string): Promise<void>;
  moveMessage(
    userId: string,
    messageId: string,
    fromChannelId: string,
    toChannelId: string
  ): Promise<void>;

  publishSpace(userId: string, channelId: string, shareMode?: ShareMode): Promise<string>;
  unpublishSpace(userId: string, channelId: string): Promise<void>;
}

