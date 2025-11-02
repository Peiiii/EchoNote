import { Message } from "@/core/stores/notes-data.store";
import {
  Bookmark,
  Copy,
  Edit2,
  Eye,
  Lightbulb,
  MessageCircle,
  Trash2,
  Type,
  FileText,
  FolderSymlink,
} from "lucide-react";
import { ConfigurableActionMenu, ActionMenuGroupConfig } from "@/common/components/action-menu";
import { getFeaturesConfig } from "@/core/config/features.config";

interface MobileMoreActionsMenuProps {
  message: Message;
  isEditing: boolean;
  onDelete: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onReply?: () => void;
  onGenerateSparks?: () => void;
  onViewDetails?: () => void;
  onBookmark?: () => void;
  editorMode?: "markdown" | "wysiwyg";
  onEditorModeChange?: (mode: "markdown" | "wysiwyg") => void;
  onMove?: () => void;
}

export function MobileMoreActionsMenu({
  message,
  isEditing,
  onDelete,
  onEdit,
  onCopy,
  onReply,
  onGenerateSparks,
  onViewDetails,
  onBookmark,
  editorMode,
  onEditorModeChange,
  onMove,
}: MobileMoreActionsMenuProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  // 配置驱动的菜单结构 - Notion 风格
  const menuGroups: ActionMenuGroupConfig[] = [
    {
      id: "primary",
      showSeparator: false,
      items: [
        ...(onEdit && getFeaturesConfig().channel.thoughtRecord.edit.enabled
          ? [
              {
                id: "edit",
                icon: <Edit2 className="w-4 h-4" />,
                title: "Edit",
                onClick: onEdit,
                variant: "default" as const,
                disabled: isEditing,
              },
            ]
          : []),
        {
          id: "copy",
          icon: <Copy className="w-4 h-4" />,
          title: "Copy",
          onClick: handleCopy,
          variant: "default" as const,
          disabled: isEditing,
        },
        ...(onReply && getFeaturesConfig().channel.thoughtRecord.reply.enabled
          ? [
              {
                id: "reply",
                icon: <MessageCircle className="w-4 h-4" />,
                title: "Reply",
                onClick: onReply,
                variant: "default" as const,
                disabled: isEditing,
              },
            ]
          : []),
        ...(onMove
          ? [
              {
                id: "move",
                icon: <FolderSymlink className="w-4 h-4" />,
                title: "Move to space",
                onClick: onMove,
                variant: "default" as const,
                disabled: isEditing,
              },
            ]
          : []),
      ],
    },
    // Editor mode toggle group (only show when editing)
    ...(isEditing && editorMode && onEditorModeChange
      ? [
          {
            id: "editor-mode",
            showSeparator: true,
            items: [
              {
                id: "markdown-mode",
                icon: <Type className="w-4 h-4" />,
                title: editorMode === "markdown" ? "✓ Markdown Mode" : "Markdown Mode",
                onClick: () => onEditorModeChange("markdown"),
                variant: "default" as const,
                disabled: false,
              },
              {
                id: "wysiwyg-mode",
                icon: <FileText className="w-4 h-4" />,
                title: editorMode === "wysiwyg" ? "✓ WYSIWYG Mode" : "WYSIWYG Mode",
                onClick: () => onEditorModeChange("wysiwyg"),
                variant: "default" as const,
                disabled: false,
              },
            ],
          },
        ]
      : []),
    {
      id: "ai",
      showSeparator: true,
      items: onGenerateSparks && getFeaturesConfig().channel.thoughtRecord.sparks.enabled
        ? [
            {
              id: "generate-sparks",
              icon: <Lightbulb className="w-4 h-4" />,
              title: "Generate Sparks",
              onClick: onGenerateSparks,
              variant: "default" as const,
              disabled: isEditing,
            },
          ]
        : [],
    },
    {
      id: "secondary",
      showSeparator: true,
      items: [
        ...(onViewDetails && getFeaturesConfig().channel.thoughtRecord.viewDetails.enabled
          ? [
              {
                id: "view-details",
                icon: <Eye className="w-4 h-4" />,
                title: "View Details",
                onClick: onViewDetails,
                variant: "default" as const,
                disabled: isEditing,
              },
            ]
          : []),
        ...(onBookmark && getFeaturesConfig().channel.thoughtRecord.bookmark.enabled
          ? [
              {
                id: "bookmark",
                icon: <Bookmark className="w-4 h-4" />,
                title: "Bookmark",
                onClick: onBookmark,
                variant: "default" as const,
                disabled: isEditing,
              },
            ]
          : []),
      ],
    },
    {
      id: "danger",
      showSeparator: true,
      items: [
        {
          id: "delete",
          icon: <Trash2 className="w-4 h-4" />,
          title: "Delete",
          onClick: onDelete,
          variant: "default" as const,
          disabled: isEditing,
        },
      ],
    },
  ];

  return (
    <ConfigurableActionMenu
      groups={menuGroups}
      width="md"
      alwaysVisible={true}
      triggerClassName="h-8 w-8 p-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 rounded-md"
    />
  );
}
