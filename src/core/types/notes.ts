export interface AIAnalysis {
  keywords: string[];
  topics: string[];
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
  tags: string[];
  insights: string[];
  relatedTopics: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  channelId: string;
  tags?: string[];
  parentId?: string;
  threadId?: string;
  isThreadExpanded?: boolean;
  threadCount?: number;
  aiAnalysis?: AIAnalysis;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
  canRestore?: boolean;
  isNew?: boolean;
}

export type ShareMode = "read-only" | "append-only";

export interface Channel {
  id: string;
  name: string;
  description: string;
  emoji?: string;
  createdAt: Date;
  updatedAt?: Date;
  messageCount: number;
  lastMessageTime?: Date;
  backgroundImage?: string;
  backgroundColor?: string;
  shareToken?: string;
  shareMode?: ShareMode;
}

