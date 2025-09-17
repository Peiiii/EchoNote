import { AIConversation } from "@/common/types/ai-conversation";

export interface ConversationListProps {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  withHeader?: boolean;
}

export interface ConversationPaneProps {
  conversations: AIConversation[];
  currentConversationId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate: () => void;
  channelId: string;
  onClose?: () => void;
}

export interface ConversationChatProps {
  conversationId: string;
  channelId: string;
  onClose?: () => void;
}

export interface ConversationInterfaceProps {
  channelId: string;
  onClose?: () => void;
}

export interface ConversationInterfaceRef {
  showList: () => void;
  showChat: () => void;
  createNew: () => void;
  isSinglePane: () => boolean;
}

export interface SinglePaneRef {
  showList: () => void;
  showChat: () => void;
}
