import { Message } from "@/core/stores/notes-data.store";
import { Copy, Edit, FileText, Flag, FolderSymlink, Share2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
              title: t("thoughtRecord.actions.edit"),
              description: t("thoughtRecord.actions.editDescription"),
              onClick: onEdit,
              variant: "default" as const,
            },
          ]
          : []),
        {
          id: "copy",
          icon: <Copy />,
          title: t("thoughtRecord.actions.copy"),
          onClick: handleCopy,
          variant: "default" as const,
        },
        ...(onShare
          ? [
            {
              id: "share",
              icon: <Share2 />,
              title: t("thoughtRecord.actions.share"),
              description: t("thoughtRecord.actions.shareDescription"),
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
              title: t("thoughtRecord.actions.move"),
              onClick: onMove,
              variant: "default" as const,
            },
          ]
          : []),
        {
          id: "delete",
          icon: <Trash2 />,
          title: t("thoughtRecord.actions.delete"),
          onClick: onDelete,
          variant: "default" as const,
        },
      ],
    },
    {
      id: "secondary",
      title: t("thoughtRecord.menu.statistics"),
      variant: "default",
      items: [
        {
          id: "word-count",
          icon: <FileText />,
          title: t("thoughtRecord.menu.characters", { count: message.content.length }),
          onClick: () => {},
          disabled: true,
        },
      ],
    },
    {
      id: "advanced",
      title: t("thoughtRecord.menu.advanced"),
      variant: "default",
      items: onReport
        ? [
            {
              id: "report",
              icon: <Flag />,
              title: t("thoughtRecord.actions.report"),
              description: t("thoughtRecord.actions.reportDescription"),
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
