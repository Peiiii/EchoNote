import { useIconStore } from "@/core/stores/icon.store";
import { useRouteTreeStore } from "@/core/stores/route-tree.store";
import { defineExtension, Disposable } from "@cardos/extension";
import { Hash, MessageSquare, Plus, Notebook } from "lucide-react";
import { NotesPage } from "../pages/notes-page";
import { Navigate } from "react-router-dom";
import { PublicSpacePage } from "@/common/features/space-publish/pages/public-space-page";

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
          {
            id: "public-space",
            path: "/space/:shareToken",
            element: <PublicSpacePage />,
            order: 2,
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
  },
});
