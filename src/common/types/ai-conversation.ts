export interface AIConversation {
  id: string;
  title: string;
  description?: string;
  channelId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  isArchived: boolean;
  tags?: string[];
  metadata?: {
    model?: string;
    temperature?: number;
    systemPrompt?: string;
  };
}

export interface AIConversationMessage {
  id: string;
  conversationId: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    toolCalls?: Array<{
      id: string;
      name: string;
      arguments: Record<string, unknown>;
    }>;
  };
}

export interface AIConversationState {
  conversations: AIConversation[];
  currentConversationId: string | null;
  messagesByConversation: Record<string, AIConversationMessage[]>;
  loading: boolean;
  error: string | null;
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
