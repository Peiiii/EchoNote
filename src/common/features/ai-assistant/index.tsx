// AI Assistant Feature - Common Components and Services
// This feature provides reusable AI assistant functionality across desktop and mobile platforms

// Components
export { AIAssistantCore } from './components/ai-assistant-core/ai-assistant-core';
export { AIConversationList } from './components/ai-conversation-list';
export { AIConversationChat } from './components/ai-conversation-chat';
export { AIConversationEmptyPane } from './components/ai-conversation-empty-pane';

// Services
export { aiAgentFactory } from './services/ai-agent-factory';
export { channelContextManager } from './services/channel-context-manager';
export { channelToolsManager } from './services/channel-tools-manager';

// Hooks
export { useConversationState } from './hooks/use-ai-conversation';
