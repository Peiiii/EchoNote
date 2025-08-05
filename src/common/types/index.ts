// Basic type definitions

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'zh-CN' | 'en-US';
  notifications: boolean;
  autoSave: boolean;
}

// Channel related types
export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: 'personal' | 'group' | 'system';
  createdAt: string;
  updatedAt: string;
}

// Message related types
export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'code';
  senderId: string;
  channelId: string;
  replyTo?: string; // ID of the message being replied to
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

// Tag related types
export interface Tag {
  id: string;
  name: string;
  color?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// AI related types
export interface AIAssistant {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// UI state types
export interface UIState {
  currentChannelId: string | null;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  loading: boolean;
  error: string | null;
  modal: {
    type: string | null;
    data: unknown;
  };
}

// Application state types
export interface AppState {
  user: User | null;
  channels: Channel[];
  messages: Record<string, Message[]>;
  tags: Tag[];
  ui: UIState;
  settings: UserSettings;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Event types
export interface AppEvent {
  type: string;
  data: unknown;
  timestamp: string;
}

// Storage types
export interface StorageConfig {
  type: 'local' | 'session' | 'indexeddb';
  key: string;
  defaultValue?: unknown;
} 