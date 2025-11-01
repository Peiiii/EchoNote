import { Message } from "@/core/stores/notes-data.store";
import { Copy, Edit, FileText, Flag, FolderSymlink, Share2, Trash2 } from "lucide-react";
import { ConfigurableActionMenu, ActionMenuGroupConfig } from "@/common/components/action-menu";

interface MoreActionsMenuProps {
  message: Message;
  onDelete: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onMove?: () => void;
}

export function MoreActionsMenu({
  message,
  onDelete,
  onEdit,
  onCopy,
  onShare,
  onReport,
  onMove,
}: MoreActionsMenuProps) {
  const handleCopy = () => {
    if (onCopy) {
      onCopy();
    } else {
      navigator.clipboard.writeText(message.content);
    }
  };

  // 配置驱动的菜单结构
  const menuGroups: ActionMenuGroupConfig[] = [
    {
      id: "primary",
      showSeparator: false,
      items: [
        ...(onEdit
          ? [
            {
              id: "edit",
              icon: <Edit />,
              title: "Edit thought",
              description: "Modify this thought",
              onClick: onEdit,
              variant: "default" as const,
            },
          ]
          : []),
        {
          id: "copy",
          icon: <Copy />,
          title: "Copy content",
          onClick: handleCopy,
          variant: "default" as const,
        },
        ...(onShare
          ? [
            {
              id: "share",
              icon: <Share2 />,
              title: "Share thought",
              description: "Share with others",
              onClick: onShare,
              variant: "default" as const,
            },
          ]
          : []),
        ...(onMove
          ? [
            {
              id: "move",
              icon: <FolderSymlink />,
              title: "Move to space",
              onClick: onMove,
              variant: "default" as const,
            },
          ]
          : []),
        {
          id: "delete",
          icon: <Trash2 />,
          title: "Delete thought",
          onClick: onDelete,
          variant: "destructive" as const,
        },
      ],
    },
    {
      id: "secondary",
      title: "Statistics",
      variant: "default",
      items: [
        {
          id: "word-count",
          icon: <FileText />,
          title: `${message.content.length} characters`,
          onClick: () => {},
          disabled: true,
        },
      ],
    },
    {
      id: "advanced",
      title: "Advanced",
      variant: "default",
      items: onReport
        ? [
            {
              id: "report",
              icon: <Flag />,
              title: "Report",
              description: "Report inappropriate content",
              onClick: onReport,
              variant: "warning" as const,
            },
          ]
        : [],
    },
    // {
    //   id: "danger",
    //   title: "Danger Zone",
    //   variant: "danger",
    //   items: [
    //     {
    //       id: "delete",
    //       icon: <Trash2 />,
    //       title: "Delete thought",
    //       onClick: onDelete,
    //       // variant: "destructive" as const,
    //     },
    //   ],
    // },
  ];

  return <ConfigurableActionMenu groups={menuGroups} />;
}
