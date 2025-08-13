export interface SpaceRecord {
  id: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'file';
  tags?: string[];
}

export interface SpaceAwareChatProps {
  spaceId: string;
  className?: string;
  placeholder?: string;
}

export interface AIChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  spaceId: string;
}

export interface SpaceContext {
  records: SpaceRecord[];
  summary: string;
  totalCount: number;
}
