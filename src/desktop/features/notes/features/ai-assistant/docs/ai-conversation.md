# AI Conversation Module

AI conversation system based on `@agent-labs/agent-chat` and Firebase.

## Architecture

```
src/
├── common/
│   ├── types/ai-conversation.ts              # AIConversation, UIMessage types
│   ├── hooks/use-ai-conversation.ts          # Conversation state management
│   └── services/firebase/firebase-ai-conversation.service.ts
└── desktop/features/notes/features/ai-assistant/
    ├── components/
    │   ├── ai-conversation-interface.tsx     # Conversation list + chat UI
    │   └── ai-conversation-chat.tsx          # AgentChatCore wrapper
    └── hooks/use-agent-chat-sync.ts          # Message sync with Firebase
```

## Data Models

```typescript
interface AIConversation {
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

// Uses @agent-labs/agent-chat UIMessage format
type UIMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  parts: MessagePart[];
}
```

## Firebase Structure

```
users/{userId}/aiConversations/{conversationId}
├── metadata (AIConversation)
└── uiMessages/{messageId} (UIMessage)
```

## Core Components

- **AIConversationInterface**: Conversation list + chat UI
- **AIConversationChat**: AgentChatCore wrapper with loading states
- **useAIConversation**: Conversation CRUD operations
- **useAgentChatSync**: Message sync with Firebase

## Key Features

- Firebase Firestore integration
- Real-time message synchronization
- Proper message updates (new vs existing)
- Component splitting for correct initialization
- Debounced Firebase writes (1 second)

## Usage

```typescript
const { conversations, createConversation, selectConversation } = useAIConversation();
const { messages, addMessage, loading } = useAgentChatSync(conversationId, channelId);
```

## Message Flow

```
User message → AgentChatCore → UI updates → Firebase sync → Real-time updates
```
