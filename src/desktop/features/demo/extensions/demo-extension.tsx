import { defineExtension, Disposable } from "@cardos/extension";
import { useActivityBarStore, ActivityBarGroup } from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { PageContainer } from "@/common/components/page-container";
import { DemoPage } from "../pages/demo-page";
import { 
  TestTube, 
  Settings, 
  FileText, 
  MessageSquare,
  Users,
  Calendar,
  Star,
  Heart
} from "lucide-react";

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
            children: [
              {
                activityKey: "demo-settings",
                routerPath: "/demo/settings",
              },
            ],
          },
        ])
      )
    );
  },
});

// Sub-page components
function DemoSettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Demo Settings</h1>
          <p className="text-muted-foreground">
            Settings page for demo extension
          </p>
        </div>
        <div className="p-4 border rounded">
          <p>Here you can configure various settings for the Demo extension</p>
        </div>
      </div>
    </PageContainer>
  );
}

function DemoDocsPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Demo Documentation</h1>
          <p className="text-muted-foreground">
            Documentation page for demo extension
          </p>
        </div>
        <div className="p-4 border rounded">
          <p>Here you can find usage documentation and API references for the Demo extension</p>
        </div>
      </div>
    </PageContainer>
  );
}

function DemoChatPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Demo Chat</h1>
          <p className="text-muted-foreground">
            Chat functionality page for demo extension
          </p>
        </div>
        <div className="p-4 border rounded">
          <p>Here you can see the chat functionality of the Demo extension</p>
        </div>
      </div>
    </PageContainer>
  );
} 