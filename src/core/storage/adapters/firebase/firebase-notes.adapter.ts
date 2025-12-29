import { v4 as uuidv4 } from "uuid";
import type { DocumentSnapshot } from "firebase/firestore";
import type { Channel, Message, ShareMode } from "@/core/types/notes";
import type { Cursor, PaginatedResult, Unsubscribe } from "@/core/storage/types";
import type {
  ListMessagesOptions,
  NotesRepository,
  NotesRepositoryCapabilities,
} from "@/core/storage/repositories/notes.repository";
import { firebaseNotesService } from "@/common/services/firebase/firebase-notes.service";

export class FirebaseNotesAdapter implements NotesRepository {
  readonly capabilities: NotesRepositoryCapabilities = {
    realtime: true,
    pagination: "cursor",
  };

  private static readonly MAX_CURSOR_CACHE = 256;
  private readonly cursorMap = new Map<Cursor, DocumentSnapshot>();

  async listChannels(userId: string): Promise<Channel[]> {
    return firebaseNotesService.fetchChannels(userId);
  }

  subscribeChannels(userId: string, onUpdate: (channels: Channel[]) => void): Unsubscribe {
    return firebaseNotesService.subscribeToChannels(userId, onUpdate);
  }

  async createChannel(
    userId: string,
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string> {
    return firebaseNotesService.createChannel(userId, channel);
  }

  async updateChannel(
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void> {
    return firebaseNotesService.updateChannel(userId, channelId, updates);
  }

  async deleteChannel(userId: string, channelId: string): Promise<void> {
    return firebaseNotesService.deleteChannel(userId, channelId);
  }

  async listMessages(
    userId: string,
    channelId: string,
    options: ListMessagesOptions
  ): Promise<PaginatedResult<Message>> {
    const includeSenders = options.includeSenders ?? ["user"];
    const cursor = options.cursor ?? null;
    const limit = options.limit;

    if (!cursor) {
      const supportsAllSenders = includeSenders.includes("ai") && includeSenders.includes("user");
      const result = supportsAllSenders
        ? await firebaseNotesService.fetchInitialMessagesAllSenders(userId, channelId, limit)
        : await firebaseNotesService.fetchInitialMessages(userId, channelId, limit);

      const nextCursor =
        result.allLoaded || !result.lastVisible ? null : this.registerCursor(result.lastVisible);
      return { items: result.messages, nextCursor };
    }

    const snapshot = this.cursorMap.get(cursor);
    if (!snapshot) {
      throw new Error("Invalid cursor (expired). Please reload messages.");
    }
    // LRU touch
    this.cursorMap.delete(cursor);
    this.cursorMap.set(cursor, snapshot);

    // Current Firebase service pagination is implemented for user messages only.
    const result = await firebaseNotesService.fetchMoreMessages(userId, channelId, limit, snapshot);
    const nextCursor =
      result.allLoaded || !result.lastVisible ? null : this.registerCursor(result.lastVisible);
    return { items: result.messages, nextCursor };
  }

  subscribeNewMessages(
    userId: string,
    channelId: string,
    after: Date,
    onUpdate: (messages: Message[]) => void
  ): Unsubscribe {
    return firebaseNotesService.subscribeToNewMessages(userId, channelId, after, onUpdate);
  }

  async createMessage(userId: string, message: Omit<Message, "id" | "timestamp">): Promise<string> {
    return firebaseNotesService.createMessage(userId, message);
  }

  async updateMessage(userId: string, messageId: string, updates: Partial<Message>): Promise<void> {
    return firebaseNotesService.updateMessage(userId, messageId, updates);
  }

  async deleteMessage(
    userId: string,
    messageId: string,
    options: { hardDelete?: boolean } = {}
  ): Promise<void> {
    if (options.hardDelete) {
      return firebaseNotesService.deleteMessage(userId, messageId);
    }
    return firebaseNotesService.softDeleteMessage(userId, messageId);
  }

  async restoreMessage(userId: string, messageId: string): Promise<void> {
    return firebaseNotesService.restoreMessage(userId, messageId);
  }

  async moveMessage(
    userId: string,
    messageId: string,
    fromChannelId: string,
    toChannelId: string
  ): Promise<void> {
    return firebaseNotesService.moveMessage(userId, messageId, fromChannelId, toChannelId);
  }

  async publishSpace(
    userId: string,
    channelId: string,
    shareMode: ShareMode = "read-only"
  ): Promise<string> {
    return firebaseNotesService.publishSpace(userId, channelId, shareMode);
  }

  async unpublishSpace(userId: string, channelId: string): Promise<void> {
    return firebaseNotesService.unpublishSpace(userId, channelId);
  }

  private registerCursor(snapshot: DocumentSnapshot): Cursor {
    const token = uuidv4();
    this.cursorMap.set(token, snapshot);
    if (this.cursorMap.size > FirebaseNotesAdapter.MAX_CURSOR_CACHE) {
      const oldestKey = this.cursorMap.keys().next().value as Cursor | undefined;
      if (oldestKey) this.cursorMap.delete(oldestKey);
    }
    return token;
  }
}
