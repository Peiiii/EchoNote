import {
  ActivityBarGroup,
  useActivityBarStore,
} from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import { Notebook, Hash, Plus, Menu } from "lucide-react";
import { MobileNotesPage } from "../pages/mobile-notes-page";
import { Navigate } from "react-router-dom";

export const mobileNotesExtension = defineExtension({
  manifest: {
    id: "mobile-notes",
    name: "Mobile Notes Extension",
    description: "Mobile-optimized conversational AI note-taking feature",
    version: "1.0.0",
    author: "EchoNote Team",
    icon: "notebook",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          "notebook": Notebook,
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
          id: "mobile-notes",
          label: "Notes",
          title: "Mobile Notes",
          group: ActivityBarGroup.MAIN,
          icon: "notebook",
          order: 1,
          iconColor: "text-blue-600 dark:text-blue-400",
        })
      )
    );

    // Register routes - mobile notes page
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "mobile-notes-main",
            path: "/notes",
            element: <MobileNotesPage />,
            order: 1,
          },
          // default route to notes
          {
            id: "mobile-notes-default",
            path: "*",
            element: <Navigate to="/notes" />,
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
            activityKey: "mobile-notes",
            routerPath: "/notes",
          },
        ])
      )
    );
  },
});
