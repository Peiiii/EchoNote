import { v4 as uuidv4 } from "uuid";
import type { Channel, Message, ShareMode } from "@/core/types/notes";
import type { Cursor, PaginatedResult, Unsubscribe } from "@/core/storage/types";
import type {
  ListMessagesOptions,
  NotesRepository,
  NotesRepositoryCapabilities,
} from "@/core/storage/repositories/notes.repository";

type PersistedChannel = Omit<Channel, "createdAt" | "updatedAt" | "lastMessageTime"> & {
  createdAt: string;
  updatedAt?: string;
  lastMessageTime?: string;
};

type PersistedMessage = Omit<Message, "timestamp" | "deletedAt"> & {
  timestamp: string;
  deletedAt?: string;
};

type PersistedState = {
  channels: PersistedChannel[];
  messagesByChannel: Record<string, PersistedMessage[]>;
};

const STORAGE_KEY_PREFIX = "echonote-local-notes:";

function keyForUser(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function toChannel(c: PersistedChannel): Channel {
  return {
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined,
    lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime) : undefined,
  };
}

function toPersistedChannel(c: Channel): PersistedChannel {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt ? c.updatedAt.toISOString() : undefined,
    lastMessageTime: c.lastMessageTime ? c.lastMessageTime.toISOString() : undefined,
  };
}

function toMessage(m: PersistedMessage): Message {
  return {
    ...m,
    timestamp: new Date(m.timestamp),
    deletedAt: m.deletedAt ? new Date(m.deletedAt) : undefined,
  };
}

function toPersistedMessage(m: Message): PersistedMessage {
  return {
    ...m,
    timestamp: m.timestamp.toISOString(),
    deletedAt: m.deletedAt ? m.deletedAt.toISOString() : undefined,
  };
}

function loadState(userId: string): PersistedState {
  const raw = localStorage.getItem(keyForUser(userId));
  if (!raw) return { channels: [], messagesByChannel: {} };
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      channels: Array.isArray(parsed.channels) ? parsed.channels : [],
      messagesByChannel: parsed.messagesByChannel && typeof parsed.messagesByChannel === "object"
        ? parsed.messagesByChannel
        : {},
    };
  } catch {
    return { channels: [], messagesByChannel: {} };
  }
}

function saveState(userId: string, state: PersistedState) {
  localStorage.setItem(keyForUser(userId), JSON.stringify(state));
}

function parseOffsetCursor(cursor: Cursor | null | undefined): number {
  if (!cursor) return 0;
  const n = Number(cursor);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export class LocalNotesAdapter implements NotesRepository {
  readonly capabilities: NotesRepositoryCapabilities = {
    realtime: true,
    pagination: "cursor",
  };

  async listChannels(userId: string): Promise<Channel[]> {
    const state = loadState(userId);
    return state.channels.map(toChannel).sort((a, b) => {
      const at = a.lastMessageTime?.getTime() ?? a.updatedAt?.getTime() ?? a.createdAt.getTime();
      const bt = b.lastMessageTime?.getTime() ?? b.updatedAt?.getTime() ?? b.createdAt.getTime();
      return bt - at;
    });
  }

  subscribeChannels(userId: string, onUpdate: (channels: Channel[]) => void): Unsubscribe {
    void this.listChannels(userId).then(onUpdate);
    return () => {};
  }

  async createChannel(
    userId: string,
    channel: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string> {
    const state = loadState(userId);
    const now = new Date();
    const id = uuidv4();
    const created: Channel = {
      id,
      name: channel.name,
      description: channel.description,
      emoji: channel.emoji,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      lastMessageTime: undefined,
      backgroundColor: channel.backgroundColor,
      backgroundImage: channel.backgroundImage,
      shareToken: undefined,
      shareMode: undefined,
    };
    state.channels.unshift(toPersistedChannel(created));
    state.messagesByChannel[id] = [];
    saveState(userId, state);
    return id;
  }

  async updateChannel(
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void> {
    const state = loadState(userId);
    const idx = state.channels.findIndex(c => c.id === channelId);
    if (idx < 0) return;
    const current = toChannel(state.channels[idx]);
    const next: Channel = {
      ...current,
      ...updates,
      updatedAt: new Date(),
    };
    state.channels[idx] = toPersistedChannel(next);
    saveState(userId, state);
  }

  async deleteChannel(userId: string, channelId: string): Promise<void> {
    const state = loadState(userId);
    state.channels = state.channels.filter(c => c.id !== channelId);
    delete state.messagesByChannel[channelId];
    saveState(userId, state);
  }

  async listMessages(
    userId: string,
    channelId: string,
    options: ListMessagesOptions
  ): Promise<PaginatedResult<Message>> {
    const state = loadState(userId);
    const all = (state.messagesByChannel[channelId] ?? []).map(toMessage);

    const filtered = all
      .filter(m => !m.isDeleted)
      .filter(m => (options.includeSenders ?? ["user"]).includes(m.sender))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const offset = parseOffsetCursor(options.cursor ?? null);
    const limit = Math.max(1, options.limit);
    const page = filtered.slice(offset, offset + limit);
    const nextOffset = offset + page.length;
    const nextCursor = nextOffset >= filtered.length ? null : String(nextOffset);
    return { items: page, nextCursor };
  }

  subscribeNewMessages(
    userId: string,
    channelId: string,
    after: Date,
    onUpdate: (messages: Message[]) => void
  ): Unsubscribe {
    // Best-effort local "subscription": poll for new messages added after the provided timestamp.
    // This keeps existing UI flows working without introducing heavy infra.
    let active = true;
    let last = after.getTime();

    const tick = () => {
      if (!active) return;
      const state = loadState(userId);
      const all = (state.messagesByChannel[channelId] ?? []).map(toMessage);
      const next = all
        .filter(m => !m.isDeleted)
        .filter(m => m.sender === "user")
        .filter(m => m.timestamp.getTime() > last)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      if (next.length > 0) {
        last = next[next.length - 1].timestamp.getTime();
        onUpdate(next);
      }
      setTimeout(tick, 1500);
    };

    setTimeout(tick, 1500);
    return () => {
      active = false;
    };
  }

  async createMessage(userId: string, message: Omit<Message, "id" | "timestamp">): Promise<string> {
    const state = loadState(userId);
    const id = uuidv4();
    const now = new Date();
    const created: Message = {
      id,
      content: message.content,
      sender: message.sender,
      channelId: message.channelId,
      timestamp: now,
      tags: message.tags,
      parentId: message.parentId,
      threadId: message.threadId,
      isThreadExpanded: message.isThreadExpanded,
      threadCount: message.threadCount,
      aiAnalysis: message.aiAnalysis,
      isDeleted: false,
      deletedAt: undefined,
      deletedBy: message.deletedBy,
      canRestore: message.canRestore,
      isNew: message.isNew,
    };

    const list = state.messagesByChannel[created.channelId] ?? [];
    list.unshift(toPersistedMessage(created));
    state.messagesByChannel[created.channelId] = list;

    const chIdx = state.channels.findIndex(c => c.id === created.channelId);
    if (chIdx >= 0) {
      const channel = toChannel(state.channels[chIdx]);
      const updated: Channel = {
        ...channel,
        messageCount: (channel.messageCount ?? 0) + 1,
        lastMessageTime: now,
        updatedAt: now,
      };
      state.channels[chIdx] = toPersistedChannel(updated);
    }

    saveState(userId, state);
    return id;
  }

  async updateMessage(userId: string, messageId: string, updates: Partial<Message>): Promise<void> {
    const state = loadState(userId);
    for (const [channelId, messages] of Object.entries(state.messagesByChannel)) {
      const idx = messages.findIndex(m => m.id === messageId);
      if (idx < 0) continue;
      const current = toMessage(messages[idx]);
      const next: Message = {
        ...current,
        ...updates,
      };
      state.messagesByChannel[channelId][idx] = toPersistedMessage(next);
      saveState(userId, state);
      return;
    }
  }

  async deleteMessage(
    userId: string,
    messageId: string,
    options: { hardDelete?: boolean } = {}
  ): Promise<void> {
    const state = loadState(userId);
    for (const [channelId, messages] of Object.entries(state.messagesByChannel)) {
      const idx = messages.findIndex(m => m.id === messageId);
      if (idx < 0) continue;

      if (options.hardDelete) {
        state.messagesByChannel[channelId] = messages.filter(m => m.id !== messageId);
      } else {
        const current = toMessage(messages[idx]);
        const next: Message = {
          ...current,
          isDeleted: true,
          deletedAt: new Date(),
        };
        state.messagesByChannel[channelId][idx] = toPersistedMessage(next);
      }

      saveState(userId, state);
      return;
    }
  }

  async restoreMessage(userId: string, messageId: string): Promise<void> {
    const state = loadState(userId);
    for (const [channelId, messages] of Object.entries(state.messagesByChannel)) {
      const idx = messages.findIndex(m => m.id === messageId);
      if (idx < 0) continue;
      const current = toMessage(messages[idx]);
      const next: Message = {
        ...current,
        isDeleted: false,
        deletedAt: undefined,
      };
      state.messagesByChannel[channelId][idx] = toPersistedMessage(next);
      saveState(userId, state);
      return;
    }
  }

  async moveMessage(
    userId: string,
    messageId: string,
    fromChannelId: string,
    toChannelId: string
  ): Promise<void> {
    const state = loadState(userId);
    const from = state.messagesByChannel[fromChannelId] ?? [];
    const idx = from.findIndex(m => m.id === messageId);
    if (idx < 0) return;
    const msg = toMessage(from[idx]);
    state.messagesByChannel[fromChannelId] = from.filter(m => m.id !== messageId);

    const moved: Message = { ...msg, channelId: toChannelId };
    const to = state.messagesByChannel[toChannelId] ?? [];
    to.unshift(toPersistedMessage(moved));
    state.messagesByChannel[toChannelId] = to;

    saveState(userId, state);
  }

  async publishSpace(_userId: string, _channelId: string, _shareMode?: ShareMode): Promise<string> {
    throw new Error("Publishing requires an account. Please sign in.");
  }

  async unpublishSpace(_userId: string, _channelId: string): Promise<void> {
    throw new Error("Unpublishing requires an account. Please sign in.");
  }
}
