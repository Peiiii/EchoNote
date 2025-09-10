import {
  ActivityBarGroup,
  useActivityBarStore,
} from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import { MessageSquare, Hash, Plus, Menu } from "lucide-react";
import { MobileChatPage } from "../pages/mobile-chat-page";
import { Navigate } from "react-router-dom";

export const mobileChatExtension = defineExtension({
  manifest: {
    id: "mobile-chat",
    name: "Mobile Chat Extension",
    description: "Mobile-optimized conversational AI note-taking feature",
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
          menu: Menu,
        })
      )
    );

    // Register activity bar items - mobile optimized
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "mobile-chat",
          label: "Chat",
          title: "Mobile Chat",
          group: ActivityBarGroup.MAIN,
          icon: "message-square",
          order: 1,
          iconColor: "text-blue-600 dark:text-blue-400",
        })
      )
    );

    // Register routes - mobile chat page
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "mobile-chat-main",
            path: "/chat",
            element: <MobileChatPage />,
            order: 1,
          },
          // default route to chat
          {
            id: "mobile-chat-default",
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
            activityKey: "mobile-chat",
            routerPath: "/chat",
          },
        ])
      )
    );
  },
});
