import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { defineExtension, Disposable } from "@cardos/extension";
import { Notebook, Hash, Plus, Menu } from "lucide-react";
import { MobileNotesPage } from "../pages/mobile-notes-page";
import { Navigate } from "react-router-dom";
import { PublicSpacePage } from "@/common/features/space-publish/pages/public-space-page";

export const mobileNotesExtension = defineExtension({
  manifest: {
    id: "mobile-notes",
    name: "Mobile Notes Extension",
    description: "Mobile-optimized conversational AI note-taking feature",
    version: "1.0.0",
    author: "StillRoot Team",
    icon: "notebook",
  },
  activate: ({ subscriptions }) => {
    // Register icons
    subscriptions.push(
      Disposable.from(
        useIconStore.getState().addIcons({
          notebook: Notebook,
          hash: Hash,
          plus: Plus,
          menu: Menu,
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
          {
            id: "mobile-public-space",
            path: "/space/:shareToken",
            element: <PublicSpacePage />,
            order: 2,
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
  },
});
