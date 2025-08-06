import { ActivityBarGroup, useActivityBarStore } from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import { MessageSquare, Hash, Plus } from "lucide-react";
import { ChatPage } from "../pages/chat-page";

export const chatExtension = defineExtension({
  manifest: {
    id: "chat",
    name: "Chat Extension",
    description: "对话式AI笔记功能",
    version: "1.0.0",
    author: "EchoNote Team",
    icon: "message-square",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          "message-square": MessageSquare,
          "hash": Hash,
          "plus": Plus,
        })
      )
    );

    // Register activity bar items - main group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "chat",
          label: "聊天",
          title: "对话式笔记",
          group: ActivityBarGroup.MAIN,
          icon: "message-square",
          order: 1,
          iconColor: "text-blue-600 dark:text-blue-400",
        })
      )
    );

    // Register routes - main chat page
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "chat-main",
            path: "/chat",
            element: <ChatPage />,
            order: 1,
          },
        ])
      )
    );

    // Connect routes with activity bar
    subscriptions.push(
      Disposable.from(
        connectRouterWithActivityBar([
          {
            activityKey: "chat",
            routerPath: "/chat",
          },
        ])
      )
    );
  },
}); 