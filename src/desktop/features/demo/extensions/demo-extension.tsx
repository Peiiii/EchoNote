import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { defineExtension, Disposable } from "@cardos/extension";
import {
  Calendar,
  FileText,
  Heart,
  MessageSquare,
  Settings,
  Star,
  TestTube,
  Users,
} from "lucide-react";
import { DemoChatPage } from "../pages/demo-chat-page";
import { DemoDocsPage } from "../pages/demo-docs-page";
import { DemoPage } from "../pages/demo-page";
import { DemoSettingsPage } from "../pages/demo-settings-page";
import { SpaceChatDemoPage } from "../pages/space-chat-demo-page";
import { AiObjectDemoPage } from "../pages/ai-object-demo-page";
import { AiQuickTestDemoPage } from "../pages/ai-quick-test-demo-page";
import { TimeFormatDemoPage } from "../pages/time-format-demo-page";
import { SVGHomepageDemo } from "../pages/svg-homepage-demo";

export const demoExtension = defineExtension({
  manifest: {
    id: "demo",
    name: "Demo Extension",
    description: "Demonstrates the usage of plugin architecture",
    version: "1.0.0",
    author: "StillRoot Team",
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
          {
            id: "demo-space-chat-page",
            path: "/demo/space-chat",
            element: <SpaceChatDemoPage />,
            order: 104,
          },
          {
            id: "demo-ai-object-page",
            path: "/demo/ai-object",
            element: <AiObjectDemoPage />,
            order: 105,
          },
          {
            id: "demo-ai-quick-test-page",
            path: "/demo/ai-quick-test",
            element: <AiQuickTestDemoPage />,
            order: 106,
          },
          {
            id: "demo-time-format-page",
            path: "/demo/time-format",
            element: <TimeFormatDemoPage />,
            order: 107,
          },
          {
            id: "demo-svg-homepage-page",
            path: "/demo/svg-homepage",
            element: <SVGHomepageDemo />,
            order: 108,
          },
        ])
      )
    );
  },
});
