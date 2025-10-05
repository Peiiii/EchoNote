// Context Feature Types

export type ContextMode = 'none' | 'channels' | 'all' | 'auto';

export interface ConversationContexts {
  mode: ContextMode;
  channelIds?: string[];
}

export interface ContextStatus {
  status: 'idle' | 'loading' | 'ready';
  readyCount: number;
  totalCount: number;
}

export interface SessionStatus {
  [conversationId: string]: ContextStatus;
}
