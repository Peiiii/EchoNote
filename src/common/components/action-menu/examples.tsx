import {
  Bookmark,
  Copy,
  Download,
  Edit,
  LogOut,
  Settings,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { ActionMenuGroupConfig, ConfigurableActionMenu } from "./index";

// 示例 1: 文件操作菜单
export const fileActionsConfig: ActionMenuGroupConfig[] = [
  {
    id: "primary",
    showSeparator: false,
    items: [
      {
        id: "edit",
        icon: <Edit />,
        title: "Edit file",
        description: "Modify file content",
        onClick: () => console.log("Edit file"),
        variant: "default",
      },
      {
        id: "copy",
        icon: <Copy />,
        title: "Copy path",
        onClick: () => console.log("Copy path"),
        variant: "default",
      },
      {
        id: "share",
        icon: <Share2 />,
        title: "Share file",
        description: "Share with others",
        onClick: () => console.log("Share file"),
        variant: "default",
      },
    ],
  },
  {
    id: "secondary",
    title: "More Options",
    variant: "default",
    items: [
      {
        id: "download",
        icon: <Download />,
        title: "Download",
        onClick: () => console.log("Download"),
        variant: "default",
      },
      {
        id: "bookmark",
        icon: <Bookmark />,
        title: "Bookmark",
        onClick: () => console.log("Bookmark"),
        variant: "default",
      },
    ],
  },
  {
    id: "danger",
    title: "Danger Zone",
    variant: "danger",
    items: [
      {
        id: "delete",
        icon: <Trash2 />,
        title: "Delete file",
        description: "Move to trash (reversible)",
        onClick: () => console.log("Delete file"),
        variant: "destructive",
      },
    ],
  },
];

// 示例 2: 用户设置菜单
export const userSettingsConfig: ActionMenuGroupConfig[] = [
  {
    id: "profile",
    title: "Profile",
    variant: "default",
    items: [
      {
        id: "edit-profile",
        icon: <User />,
        title: "Edit Profile",
        description: "Update your information",
        onClick: () => console.log("Edit profile"),
        variant: "default",
      },
      {
        id: "settings",
        icon: <Settings />,
        title: "Settings",
        description: "Manage preferences",
        onClick: () => console.log("Settings"),
        variant: "default",
      },
    ],
  },
  {
    id: "actions",
    title: "Actions",
    variant: "default",
    items: [
      {
        id: "logout",
        icon: <LogOut />,
        title: "Logout",
        description: "Sign out of your account",
        onClick: () => console.log("Logout"),
        variant: "warning",
      },
    ],
  },
];

// 示例 3: 动态菜单（根据权限显示）
export const createDynamicMenuConfig = (
  canEdit: boolean,
  canDelete: boolean,
  canShare: boolean
): ActionMenuGroupConfig[] => [
  {
    id: "primary",
    showSeparator: false,
    items: [
      ...(canEdit
        ? [
            {
              id: "edit",
              icon: <Edit />,
              title: "Edit",
              description: "Modify content",
              onClick: () => console.log("Edit"),
              variant: "default" as const,
            },
          ]
        : []),
      {
        id: "copy",
        icon: <Copy />,
        title: "Copy",
        onClick: () => console.log("Copy"),
        variant: "default",
      },
      ...(canShare
        ? [
            {
              id: "share",
              icon: <Share2 />,
              title: "Share",
              description: "Share with others",
              onClick: () => console.log("Share"),
              variant: "default" as const,
            },
          ]
        : []),
    ],
  },
  {
    id: "danger",
    title: "Danger Zone",
    variant: "danger",
    items: [
      ...(canDelete
        ? [
            {
              id: "delete",
              icon: <Trash2 />,
              title: "Delete",
              description: "Remove permanently",
              onClick: () => console.log("Delete"),
              variant: "destructive" as const,
            },
          ]
        : []),
    ],
  },
];

// 使用示例组件
export function FileActionsMenu() {
  return <ConfigurableActionMenu groups={fileActionsConfig} />;
}

export function UserSettingsMenu() {
  return <ConfigurableActionMenu groups={userSettingsConfig} />;
}

export function DynamicMenu({
  canEdit,
  canDelete,
  canShare,
}: {
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
}) {
  const config = createDynamicMenuConfig(canEdit, canDelete, canShare);
  return <ConfigurableActionMenu groups={config} />;
}
