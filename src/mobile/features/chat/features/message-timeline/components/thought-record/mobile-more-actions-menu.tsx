import { Message } from "@/core/stores/notes-data.store";
import { 
  Bookmark, 
  Copy, 
  Edit2, 
  Eye, 
  Lightbulb, 
  MessageCircle, 
  Trash2 
} from "lucide-react";
import { ConfigurableActionMenu, ActionMenuGroupConfig } from "@/common/components/action-menu";

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
  onBookmark
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
        ...(onEdit ? [{
          id: "edit",
          icon: <Edit2 className="w-4 h-4" />,
          title: "Edit",
          onClick: onEdit,
          variant: "default" as const,
          disabled: isEditing
        }] : []),
        {
          id: "copy",
          icon: <Copy className="w-4 h-4" />,
          title: "Copy",
          onClick: handleCopy,
          variant: "default" as const,
          disabled: isEditing
        },
        ...(onReply ? [{
          id: "reply",
          icon: <MessageCircle className="w-4 h-4" />,
          title: "Reply",
          onClick: onReply,
          variant: "default" as const,
          disabled: isEditing
        }] : [])
      ]
    },
    {
      id: "ai",
      showSeparator: true,
      items: [
        ...(onGenerateSparks ? [{
          id: "generate-sparks",
          icon: <Lightbulb className="w-4 h-4" />,
          title: "Generate Sparks",
          onClick: onGenerateSparks,
          variant: "default" as const,
          disabled: isEditing
        }] : [])
      ]
    },
    {
      id: "secondary",
      showSeparator: true,
      items: [
        ...(onViewDetails ? [{
          id: "view-details",
          icon: <Eye className="w-4 h-4" />,
          title: "View Details",
          onClick: onViewDetails,
          variant: "default" as const,
          disabled: isEditing
        }] : []),
        ...(onBookmark ? [{
          id: "bookmark",
          icon: <Bookmark className="w-4 h-4" />,
          title: "Bookmark",
          onClick: onBookmark,
          variant: "default" as const,
          disabled: isEditing
        }] : [])
      ]
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
          variant: "destructive" as const,
          disabled: isEditing
        }
      ]
    }
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
