// 基础类型定义
export interface BaseEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// 用户相关类型
export interface User extends BaseEntity {
  name: string;
  email?: string;
  avatar?: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  notifications: boolean;
  autoSave: boolean;
}

// 频道相关类型
export interface Channel extends BaseEntity {
  name: string;
  description?: string;
  type: 'personal' | 'work' | 'study' | 'custom';
  messageCount: number;
  isArchived: boolean;
  lastMessageAt?: number;
}

// 消息相关类型
export interface Message extends BaseEntity {
  content: string;
  type: 'text' | 'image' | 'file' | 'ai';
  sender: 'user' | 'ai' | 'system';
  channelId: string;
  tags: string[];
  metadata?: MessageMetadata;
  isEdited?: boolean;
  replyTo?: string; // 回复的消息ID
}

export interface MessageMetadata {
  fileSize?: number;
  fileName?: string;
  fileType?: string;
  aiModel?: string;
  aiTokens?: number;
  imageUrl?: string;
  thumbnailUrl?: string;
}

// 标签相关类型
export interface Tag extends BaseEntity {
  name: string;
  color: string;
  count: number;
}

export interface TaggedMessage {
  messageId: string;
  tagIds: string[];
}

// AI相关类型
export interface AIResponse {
  content: string;
  model: string;
  tokens: number;
  timestamp: number;
}

export interface AIPrompt {
  id: string;
  name: string;
  content: string;
  category: string;
  isDefault: boolean;
}

// UI状态类型
export interface UIState {
  currentChannelId: string | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  error: string | null;
  modal: {
    type: string | null;
    data: any;
  };
}

// 应用状态类型
export interface AppState {
  user: User | null;
  channels: Channel[];
  messages: Record<string, Message[]>; // channelId -> messages
  tags: Tag[];
  ui: UIState;
  settings: UserSettings;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 事件类型
export interface MessageEvent {
  type: 'message' | 'typing' | 'read';
  channelId: string;
  data: any;
}

// 存储类型
export interface StorageData {
  user: User | null;
  channels: Channel[];
  messages: Record<string, Message[]>;
  tags: Tag[];
  settings: UserSettings;
} 