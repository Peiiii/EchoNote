import { Channel } from "@/core/stores/notes-data.store";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu";
import { ConfigurableActionMenuContent } from "@/common/components/action-menu";
import { DeleteConfirmationDialog } from "@/common/components/delete-confirmation-dialog";
import { useState } from "react";

interface ChannelMoreActionsMenuProps {
    channel: Channel;
    onDelete: () => void;
}

export function ChannelMoreActionsMenu({ channel, onDelete }: ChannelMoreActionsMenuProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-slate-200 dark:hover:bg-slate-600"
                        title="More actions"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <MoreVertical className="h-3 w-3" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                    className="w-56 p-2" 
                    align="end"
                    side="bottom"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ConfigurableActionMenuContent 
                        groups={[
                            {
                                id: "danger",
                                items: [
                                    {
                                        id: "delete",
                                        icon: <Trash2 />,
                                        title: `Delete ${channel.name}`,
                                        onClick: () => setIsDeleteDialogOpen(true),
                                        variant: "destructive"
                                    }
                                ]
                            }
                        ]}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
            
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Channel"
                description="This will permanently delete the channel and all its messages. This action cannot be undone."
                itemName={channel.name}
                onConfirm={onDelete}
            />
        </>
    );
}
