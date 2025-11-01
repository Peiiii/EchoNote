import { Message } from "@/core/stores/notes-data.store";
import type { EditDraftEntry } from "@/core/stores/edit-state.store";

export interface ThoughtRecordProps {
  message: Message;
  isFirstInGroup: boolean;
  onReply?: () => void;
  onOpenThread?: (messageId: string) => void;
  threadCount?: number;
}

export interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  title: string;
  disabled?: boolean;
  active?: boolean;
  indicator?: boolean;
}

export interface ThreadIndicatorProps {
  threadCount: number;
  onOpenThread?: (messageId: string) => void;
  messageId: string;
}

export interface FooterItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export interface TagSectionProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export interface MessageFooterProps {
  message: Message;
  editingTags: string[];
  onTagsChange: (tags: string[]) => void;
  hasSparks: boolean;
  aiAnalysis: { insights: { length: number } } | null;
  onToggleAnalysis: () => void;
  threadCount: number;
  onOpenThread?: (messageId: string) => void;
}

export interface ActionButtonsProps {
  onToggleAnalysis: () => void;
  onReply?: () => void;
  message: Message;
  isEditing: boolean;
  editorMode?: "markdown" | "wysiwyg";
  onEditorModeChange?: (mode: "markdown" | "wysiwyg") => void;
  hasDraft?: boolean;
  draftEntry?: EditDraftEntry | null;
}
