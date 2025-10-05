// Context Feature - AI Assistant Context Management
// This sub-feature provides context data management and UI controls for AI conversations
// Now uses ChannelMessageService for data management instead of separate cache

// Services - Core context management services
export { channelContextManager } from './services/channel-context-manager';
export { sessionContextManager } from './services/session-context-manager';

// Components - Context UI controls
export { ConversationContextControl } from './components/conversation-context-control';

// Note: Hooks and types are kept internal to the context module
// They are only used within the context feature and not by external consumers
