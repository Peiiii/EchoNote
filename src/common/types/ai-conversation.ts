export interface AIConversation {
  id: string;
  title: string;
  channelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  isArchived: boolean;
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
  channelId?: string;
  isArchived?: boolean;
  searchQuery?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}