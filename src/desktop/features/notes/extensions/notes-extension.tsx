import { ActivityBarGroup, useActivityBarStore } from "@/core/stores/activity-bar.store";
import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { connectRouterWithActivityBar } from "@/core/utils/connect-router-with-activity-bar";
import { defineExtension, Disposable } from "@cardos/extension";
import { Hash, MessageSquare, Plus, Notebook } from "lucide-react";
import { NotesPage } from "../pages/notes-page";
import { Navigate } from "react-router-dom";

export const notesExtension = defineExtension({
  manifest: {
    id: "notes",
    name: "Notes Extension",
    description: "Conversational AI note-taking feature",
    version: "1.0.0",
    author: "StillRoot Team",
    icon: "notebook",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          "message-square": MessageSquare,
          hash: Hash,
          plus: Plus,
          notebook: Notebook,
        })
      )
    );

    // Register activity bar items - main group
    subscriptions.push(
      Disposable.from(
        useActivityBarStore.getState().addItem({
          id: "notes",
          label: "Notes",
          title: "Conversational Notes",
          group: ActivityBarGroup.MAIN,
          collapsedLabel: "Notes",
          icon: "notebook",
          order: 1,
        })
      )
    );

    // Register routes - main notes page
    subscriptions.push(
      Disposable.from(
        useRouteTreeStore.getState().addRoutes([
          {
            id: "notes-main",
            path: "/notes",
            element: <NotesPage />,
            order: 1,
          },
          // default route to notes
          {
            id: "notes-default",
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
            activityKey: "notes",
            routerPath: "/notes",
          },
        ])
      )
    );
  },
});
