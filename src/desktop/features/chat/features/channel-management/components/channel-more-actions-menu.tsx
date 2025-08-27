import { Channel } from "@/core/stores/chat-data.store";
import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu";
import { ConfigurableActionMenuContent } from "@/common/components/action-menu";

interface ChannelMoreActionsMenuProps {
    channel: Channel;
    onDelete: () => void;
}

export function ChannelMoreActionsMenu({ channel, onDelete }: ChannelMoreActionsMenuProps) {
    return (
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
                            // title: "Danger Zone",
                            // variant: "danger",
                            items: [
                                {
                                    id: "delete",
                                    icon: <Trash2 />,
                                    title: `Delete ${channel.name}`,
                                    // description: "Permanently delete this channel and all messages",
                                    onClick: onDelete,
                                    // variant: "destructive"
                                }
                            ]
                        }
                    ]}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
