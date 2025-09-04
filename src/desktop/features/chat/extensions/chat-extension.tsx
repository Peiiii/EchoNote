import {
  ActivityBarGroup,
  useActivityBarStore,
} from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import { Hash, MessageSquare, Plus } from "lucide-react";
import { ChatPage } from "../pages/chat-page";
import { Navigate } from "react-router-dom";

export const chatExtension = defineExtension({
  manifest: {
    id: "chat",
    name: "Chat Extension",
    description: "Conversational AI note-taking feature",
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
          hash: Hash,
          plus: Plus,
        })
      )
    );

    // Register activity bar items - main group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "chat",
          label: "Chat",
          title: "Conversational Notes",
          group: ActivityBarGroup.MAIN,
          collapsedLabel: "Chat",
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
          // default route to chat
          {
            id: "chat-default",
            path: "*",
            element: <Navigate to="/chat" />,
            order: 9999,
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
