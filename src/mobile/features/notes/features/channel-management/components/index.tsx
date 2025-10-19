import { Button } from "@/common/components/ui/button";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { CreateChannelPopover } from "@/common/features/channel-management/components/create-channel-popover";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { MobileChannelItem } from "./mobile-channel-item";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";

interface MobileChannelListProps {
  isOpen: boolean;
}

export function MobileChannelList({ isOpen }: MobileChannelListProps) {
  const presenter = useCommonPresenterContext();
  const channels = useNotesDataStore(state => state.channels);
  const currentChannelId = useNotesViewStore(state => state.currentChannelId);

  const handleAddChannel = (channel: { name: string; description: string; emoji?: string }) => {
    presenter.channelManager.addChannel(channel);
  };

  const handleChannelClick = (channelId: string) => {
    useNotesViewStore.getState().setCurrentChannel(channelId);
  };

  const handleDeleteChannel = async (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;

    const confirmed = window.confirm(
      `🗑️ Delete Channel\n\n` +
        `"${channel.name}"\n\n` +
        `⚠️ This action cannot be undone.\n` +
        `The channel and all its messages will be moved to trash.\n\n` +
        `Are you sure you want to continue?`
    );

    if (confirmed) {
      try {
        await presenter.channelManager.deleteChannel(channelId);
        // If the deleted channel was the current channel, switch to first available channel
        if (currentChannelId === channelId && channels.length > 1) {
          const remainingChannels = channels.filter(c => c.id !== channelId);
          if (remainingChannels.length > 0) {
            useNotesViewStore.getState().setCurrentChannel(remainingChannels[0].id);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        alert(`❌ Failed to delete the channel.\n\nError: ${errorMessage}\n\nPlease try again.`);
      }
    }
  };

  // Sort channels by activity for consistent ordering
  const orderedChannels = useMemo(() => {
    const getActivity = (c: (typeof channels)[number]) => {
      const t1 = c.lastMessageTime?.getTime();
      const t2 = c.updatedAt?.getTime();
      const t3 = c.createdAt?.getTime?.() ? c.createdAt.getTime() : 0;
      return t1 ?? t2 ?? t3 ?? 0;
    };
    return [...channels].sort((a, b) => getActivity(b) - getActivity(a));
  }, [channels]);

  return (
    <Sheet open={isOpen} onOpenChange={() => useUIStateStore.getState().closeChannelList()}>
      <SheetContent side="left" className="w-80 p-0 border-r border-border" hideClose>
        <div className="flex flex-col h-full bg-background">
          {/* Header - align with desktop: title + actions (right) */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Spaces</h3>
            </div>
            <div className="flex items-center gap-2">
              <CreateChannelPopover
                variant="dialog"
                onAddChannel={handleAddChannel}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="New space"
                    aria-label="New space"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                }
              />
            </div>
          </div>

          {/* Channel List - Consistent with Settings */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {orderedChannels.map(channel => (
              <MobileChannelItem
                key={channel.id}
                channel={channel}
                isActive={currentChannelId === channel.id}
                onClick={() => handleChannelClick(channel.id)}
                onDelete={() => handleDeleteChannel(channel.id)}
              />
            ))}
          </div>

          {/* Footer removed: moved to header as icon trigger */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
