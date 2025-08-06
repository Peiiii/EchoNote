import { ActivityBarGroup, useActivityBarStore } from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import {
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  Settings,
  Star,
  TestTube,
  Users
} from "lucide-react";
import { DemoChatPage } from "../pages/demo-chat-page";
import { DemoDocsPage } from "../pages/demo-docs-page";
import { DemoPage } from "../pages/demo-page";
import { DemoSettingsPage } from "../pages/demo-settings-page";

export const demoExtension = defineExtension({
  manifest: {
    id: "demo",
    name: "Demo Extension",
    description: "Demonstrates the usage of plugin architecture",
    version: "1.0.0",
    author: "EchoNote Team",
    icon: "test-tube",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          "test-tube": TestTube,
          "demo-settings": Settings,
          "demo-docs": FileText,
          "demo-chat": MessageSquare,
          "demo-users": Users,
          "demo-calendar": Calendar,
          "demo-star": Star,
          "demo-heart": Heart,
        })
      )
    );

    // Register activity bar items - main group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "demo",
          label: "Demo",
          title: "Plugin Architecture Demo",
          group: ActivityBarGroup.MAIN,
          icon: "test-tube",
          order: 100,
          iconColor: "text-purple-600 dark:text-purple-400",
        })
      )
    );

    // Register activity bar items - footer group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "demo-settings",
          label: "Settings",
          title: "Demo Settings",
          group: ActivityBarGroup.FOOTER,
          icon: "demo-settings",
          order: 1,
          iconColor: "text-orange-600 dark:text-orange-400",
        })
      )
    );

    // Register routes - main page
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "demo-main",
            path: "/demo",
            element: <DemoPage />,
            order: 100,
          },
          {
            id: "demo-settings-page",
            path: "/demo/settings",
            element: <DemoSettingsPage />,
            order: 101,
          },
          {
            id: "demo-docs-page",
            path: "/demo/docs",
            element: <DemoDocsPage />,
            order: 102,
          },
          {
            id: "demo-chat-page",
            path: "/demo/chat",
            element: <DemoChatPage />,
            order: 103,
          },
        ])
      )
    );

    // Connect routes with activity bar
    subscriptions.push(
      Disposable.from(
        connectRouterWithActivityBar([
          {
            activityKey: "demo",
            routerPath: "/demo",
          },
          {
            activityKey: "demo-settings",
            routerPath: "/demo/settings",
          },
        ])
      )
    );
  },
}); 