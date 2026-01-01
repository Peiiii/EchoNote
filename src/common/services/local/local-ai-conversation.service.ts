import type { AIConversation, MessageListOptions, UIMessage } from "@/common/types/ai-conversation";

type PersistedConversation = Omit<
  AIConversation,
  "createdAt" | "updatedAt" | "lastMessageAt"
> & {
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
};

type PersistedState = {
  conversations: PersistedConversation[];
  messagesByConversation: Record<string, UIMessage[]>;
};

const STORAGE_KEY_PREFIX = "echonote-local-ai:";

function keyForUser(userId: string) {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

function loadState(userId: string): PersistedState {
  const raw = localStorage.getItem(keyForUser(userId));
  if (!raw) return { conversations: [], messagesByConversation: {} };
  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return {
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      messagesByConversation:
        parsed.messagesByConversation && typeof parsed.messagesByConversation === "object"
          ? parsed.messagesByConversation
          : {},
    };
  } catch {
    return { conversations: [], messagesByConversation: {} };
  }
}

function saveState(userId: string, state: PersistedState) {
  localStorage.setItem(keyForUser(userId), JSON.stringify(state));
}

function toConversation(c: PersistedConversation): AIConversation {
  return {
    ...c,
    createdAt: new Date(c.createdAt),
    updatedAt: new Date(c.updatedAt),
    lastMessageAt: new Date(c.lastMessageAt),
  };
}

function toPersistedConversation(c: AIConversation): PersistedConversation {
  return {
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    lastMessageAt: c.lastMessageAt.toISOString(),
  };
}

function applyMessageListOptions(messages: UIMessage[], options?: MessageListOptions): UIMessage[] {
  const orderBy = options?.orderBy ?? "desc";
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  const sorted = [...messages].sort((a, b) => {
    // Try to sort by "createdAt" on message or fallback to array order.
    const at = (a as unknown as { createdAt?: string | number | Date }).createdAt;
    const bt = (b as unknown as { createdAt?: string | number | Date }).createdAt;
    const aTime = at ? new Date(at as never).getTime() : 0;
    const bTime = bt ? new Date(bt as never).getTime() : 0;
    return orderBy === "asc" ? aTime - bTime : bTime - aTime;
  });

  return sorted.slice(offset, offset + limit);
}

export const localAIConversationService = {
  async listConversations(
    userId: string,
    options?: { limit?: number; startAfterLastMessageAt?: Date | null }
  ): Promise<{ items: AIConversation[]; nextCursor: Date | null }> {
    const state = loadState(userId);
    const all = state.conversations.map(toConversation).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

    const startAfter = options?.startAfterLastMessageAt?.getTime?.() ?? null;
    const filtered = startAfter ? all.filter(c => c.lastMessageAt.getTime() < startAfter) : all;

    const limit = options?.limit ?? 20;
    const items = filtered.slice(0, limit);
    const nextCursor = filtered.length > limit ? items[items.length - 1]?.lastMessageAt ?? null : null;
    return { items, nextCursor };
  },

  async createConversation(
    userId: string,
    title: string,
    contexts?: AIConversation["contexts"]
  ): Promise<AIConversation> {
    const state = loadState(userId);
    const now = new Date();
    const conversation: AIConversation = {
      id: crypto.randomUUID(),
      userId,
      title,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      messageCount: 0,
      isArchived: false,
      contexts: contexts ?? null,
    };
    state.conversations.unshift(toPersistedConversation(conversation));
    state.messagesByConversation[conversation.id] = [];
    saveState(userId, state);
    return conversation;
  },

  async updateConversation(
    userId: string,
    conversationId: string,
    updates: Partial<AIConversation>
  ): Promise<void> {
    const state = loadState(userId);
    const idx = state.conversations.findIndex(c => c.id === conversationId);
    if (idx < 0) return;
    const current = toConversation(state.conversations[idx]);
    const next: AIConversation = {
      ...current,
      ...updates,
      updatedAt: new Date(),
    };
    state.conversations[idx] = toPersistedConversation(next);
    saveState(userId, state);
  },

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    const state = loadState(userId);
    state.conversations = state.conversations.filter(c => c.id !== conversationId);
    delete state.messagesByConversation[conversationId];
    saveState(userId, state);
  },

  async getMessages(userId: string, conversationId: string): Promise<UIMessage[]> {
    const state = loadState(userId);
    return state.messagesByConversation[conversationId] ?? [];
  },

  subscribeToMessages(
    userId: string,
    conversationId: string,
    onUpdate: (messages: UIMessage[]) => void
  ) {
    let active = true;
    let lastHash = "";

    const tick = async () => {
      if (!active) return;
      const msgs = await localAIConversationService.getMessages(userId, conversationId);
      const nextHash = JSON.stringify(msgs.map(m => m.id));
      if (nextHash !== lastHash) {
        lastHash = nextHash;
        onUpdate(msgs);
      }
      setTimeout(tick, 1000);
    };

    void tick();
    return () => {
      active = false;
    };
  },

  async createMessage(userId: string, conversationId: string, message: UIMessage): Promise<void> {
    const state = loadState(userId);
    const list = state.messagesByConversation[conversationId] ?? [];
    list.push(message);
    state.messagesByConversation[conversationId] = list;

    const idx = state.conversations.findIndex(c => c.id === conversationId);
    if (idx >= 0) {
      const conv = toConversation(state.conversations[idx]);
      const now = new Date();
      const next: AIConversation = {
        ...conv,
        lastMessageAt: now,
        updatedAt: now,
        messageCount: (conv.messageCount ?? 0) + 1,
      };
      state.conversations[idx] = toPersistedConversation(next);
    }

    saveState(userId, state);
  },

  async updateMessage(
    userId: string,
    conversationId: string,
    messageId: string,
    message: UIMessage
  ): Promise<void> {
    const state = loadState(userId);
    const list = state.messagesByConversation[conversationId] ?? [];
    const idx = list.findIndex(m => m.id === messageId);
    if (idx < 0) return;
    list[idx] = message;
    state.messagesByConversation[conversationId] = list;
    saveState(userId, state);
  },

  async listMessages(
    userId: string,
    conversationId: string,
    options?: MessageListOptions
  ): Promise<UIMessage[]> {
    const msgs = await localAIConversationService.getMessages(userId, conversationId);
    return applyMessageListOptions(msgs, options);
  },
};

