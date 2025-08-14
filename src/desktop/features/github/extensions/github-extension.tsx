import { ActivityBarGroup, useActivityBarStore } from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { handleOAuthCallback } from "@/desktop/features/github/utils/handle-github-callback";
import { defineExtension, Disposable } from "@cardos/extension";
import { Cloud, Github, Settings } from "lucide-react";
import { GitHubIntegrationPage } from "../pages/github-integration-page";

export const githubExtension = defineExtension({
  manifest: {
    id: "github",
    name: "GitHub Integration",
    description: "Integrate with GitHub for data storage and synchronization",
    version: "1.0.0",
    author: "EchoNote Team",
    icon: "github",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          "github": Github,
          "cloud": Cloud,
          "github-settings": Settings,
        })
      )
    );

    // Register activity bar items - main group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "github",
          label: "GitHub",
          title: "GitHub Integration",
          group: ActivityBarGroup.MAIN,
          icon: "github",
          order: 200,
          iconColor: "text-gray-700 dark:text-gray-300",
        })
      )
    );

    // Register activity bar items - footer group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "github-settings",
          label: "GitHub Settings",
          title: "GitHub Configuration",
          group: ActivityBarGroup.FOOTER,
          icon: "github-settings",
          order: 2,
          iconColor: "text-blue-600 dark:text-blue-400",
        })
      )
    );

    window.addEventListener('popstate', handleOAuthCallback);
    handleOAuthCallback();

    // Register routes
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "github-main",
            path: "/github",
            element: <GitHubIntegrationPage />,
            order: 200,
          },
        ])
      )
    );

    // Connect routes with activity bar
    subscriptions.push(
      Disposable.from(
        connectRouterWithActivityBar([
          {
            activityKey: "github",
            routerPath: "/github",
          },
          {
            activityKey: "github-settings",
            routerPath: "/github",
          },
        ])
      )
    );

    // Cleanup function
    subscriptions.push(
      Disposable.from(() => {
        // Remove event listener
        window.removeEventListener('popstate', handleOAuthCallback);
      })
    );
  },
});
