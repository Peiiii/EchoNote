import type { Channel, Message, ShareMode } from "@/core/types/notes";
import type { PaginatedResult, Unsubscribe } from "@/core/storage/types";
import type {
  ListMessagesOptions,
  NotesRepository,
  NotesRepositoryCapabilities,
} from "@/core/storage/repositories/notes.repository";
import { isGuestUserId } from "@/core/services/guest-id";
import { FirebaseNotesAdapter } from "@/core/storage/adapters/firebase/firebase-notes.adapter";
import { LocalNotesAdapter } from "@/core/storage/adapters/local/local-notes.adapter";

export class HybridNotesAdapter implements NotesRepository {
  readonly capabilities: NotesRepositoryCapabilities = {
    realtime: true,
    pagination: "cursor",
  };

  private readonly local = new LocalNotesAdapter();
  private readonly firebase = new FirebaseNotesAdapter();

  private repoFor(userId: string) {
    return isGuestUserId(userId) ? this.local : this.firebase;
  }

  listChannels(userId: string): Promise<Channel[]> {
    return this.repoFor(userId).listChannels(userId);
  }

  subscribeChannels(userId: string, onUpdate: (channels: Channel[]) => void): Unsubscribe {
    const repo = this.repoFor(userId);
    if (!repo.subscribeChannels) return () => {};
    return repo.subscribeChannels(userId, onUpdate);
  }

  createChannel(
    userId: string,
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string> {
    return this.repoFor(userId).createChannel(userId, channel);
  }

  updateChannel(
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void> {
    return this.repoFor(userId).updateChannel(userId, channelId, updates);
  }

  deleteChannel(userId: string, channelId: string): Promise<void> {
    return this.repoFor(userId).deleteChannel(userId, channelId);
  }

  listMessages(
    userId: string,
    channelId: string,
    options: ListMessagesOptions
  ): Promise<PaginatedResult<Message>> {
    return this.repoFor(userId).listMessages(userId, channelId, options);
  }

  subscribeNewMessages(
    userId: string,
    channelId: string,
    after: Date,
    onUpdate: (messages: Message[]) => void
  ): Unsubscribe {
    const repo = this.repoFor(userId);
    if (!repo.subscribeNewMessages) return () => {};
    return repo.subscribeNewMessages(userId, channelId, after, onUpdate);
  }

  createMessage(userId: string, message: Omit<Message, "id" | "timestamp">): Promise<string> {
    return this.repoFor(userId).createMessage(userId, message);
  }

  updateMessage(userId: string, messageId: string, updates: Partial<Message>): Promise<void> {
    return this.repoFor(userId).updateMessage(userId, messageId, updates);
  }

  deleteMessage(
    userId: string,
    messageId: string,
    options?: { hardDelete?: boolean }
  ): Promise<void> {
    return this.repoFor(userId).deleteMessage(userId, messageId, options);
  }

  restoreMessage(userId: string, messageId: string): Promise<void> {
    return this.repoFor(userId).restoreMessage(userId, messageId);
  }

  moveMessage(
    userId: string,
    messageId: string,
    fromChannelId: string,
    toChannelId: string
  ): Promise<void> {
    return this.repoFor(userId).moveMessage(userId, messageId, fromChannelId, toChannelId);
  }

  publishSpace(userId: string, channelId: string, shareMode?: ShareMode): Promise<string> {
    if (isGuestUserId(userId)) {
      throw new Error("Publishing requires an account. Please sign in.");
    }
    return this.firebase.publishSpace(userId, channelId, shareMode);
  }

  unpublishSpace(userId: string, channelId: string): Promise<void> {
    if (isGuestUserId(userId)) {
      throw new Error("Unpublishing requires an account. Please sign in.");
    }
    return this.firebase.unpublishSpace(userId, channelId);
  }
}
