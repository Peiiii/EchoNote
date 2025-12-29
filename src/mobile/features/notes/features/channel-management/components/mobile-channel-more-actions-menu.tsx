import { Channel } from "@/core/stores/notes-data.store";
import { MoreVertical, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { ConfigurableActionMenuContent } from "@/common/components/action-menu";
import { useState } from "react";
import { MobileEditChannelDialog } from "./mobile-edit-channel-dialog";

interface MobileChannelMoreActionsMenuProps {
  channel: Channel;
  onDelete: () => void;
}

export function MobileChannelMoreActionsMenu({
  channel,
  onDelete,
}: MobileChannelMoreActionsMenuProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            title="More actions"
            onClick={e => e.stopPropagation()}
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 p-2"
          align="end"
          side="bottom"
          onClick={e => e.stopPropagation()}
        >
          <ConfigurableActionMenuContent
            groups={[
              {
                id: "actions",
                items: [
                  {
                    id: "edit",
                    icon: <Edit2 />,
                    title: `Edit ${channel.name}`,
                    onClick: () => setIsEditDialogOpen(true),
                  },
                ],
              },
              {
                id: "danger",
                items: [
                  {
                    id: "delete",
                    icon: <Trash2 />,
                    title: `Delete ${channel.name}`,
                    onClick: onDelete,
                  },
                ],
              },
            ]}
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <MobileEditChannelDialog
        channel={channel}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
