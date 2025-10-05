// Context Feature - AI Assistant Context Management
// This sub-feature provides context data management, caching, and UI controls for AI conversations

// Services - Core context management services
export { contextDataCache } from './services/context-data-cache';
export { channelContextManager } from './services/channel-context-manager';
export { sessionContextManager } from './services/session-context-manager';

// Components - Context UI controls
export { ConversationContextControl } from './components/conversation-context-control';

// Types - Context-related type definitions
export type { ChannelContextSnapshot } from './services/context-data-cache';
export type { ContextMode, ConversationContexts, ContextStatus, SessionStatus } from './types/context.types';
