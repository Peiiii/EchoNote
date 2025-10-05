// Conversation context config for dynamic binding to channels
export enum ConversationContextMode {
  NONE = 'none',
  CHANNELS = 'channels', 
  ALL = 'all',
  AUTO = 'auto'
}

export interface ConversationContextConfig {
  // none: no context; channels: specific channels; all: use all channels
  mode: ConversationContextMode;
  // When mode === 'channels', the selected channel ids
  channelIds?: string[];
}

export interface AIConversation {
  id: string;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  isArchived: boolean;
  // Optional dynamic context binding (MVP v2)
  contexts?: ConversationContextConfig | null;
}

export type UIMessage = import('@agent-labs/agent-chat').UIMessage;

export interface MessageListOptions {
  limit?: number;
  offset?: number;
  orderBy?: 'asc' | 'desc';
  startAfter?: string;
  endBefore?: string;
}

export interface AIConversationFilters {
  isArchived?: boolean;
  searchQuery?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}
