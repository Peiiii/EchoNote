import { Button } from "@/common/components/ui/button";
import { Sheet, SheetContent } from "@/common/components/ui/sheet";
import { CreateChannelPopover } from "@/common/features/channel-management/components/create-channel-popover";
import { useAutoSelectFirstChannel } from "@/common/hooks/use-auto-select-first-channel";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { sortChannelsByActivity } from "@/common/lib/channel-sorting";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { MobileChannelItem } from "./mobile-channel-item";

interface MobileChannelListProps {
  isOpen: boolean;
}

export function MobileChannelList({ isOpen }: MobileChannelListProps) {
  const presenter = useCommonPresenterContext();
  const channels = useNotesDataStore(state => state.channels);
  const currentChannelId = useNotesViewStore(state => state.currentChannelId);

  useAutoSelectFirstChannel();

  // Sort channels by activity using unified sorting function
  const orderedChannels = useMemo(() => {
    return sortChannelsByActivity(channels);
  }, [channels]);

  return (
    <Sheet open={isOpen} onOpenChange={() => presenter.closeChannelList()}>
      <SheetContent side="left" className="w-80 p-0 border-r border-border" hideClose>
        <div className="flex flex-col h-full bg-background">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Spaces</h3>
            </div>
            <div className="flex items-center gap-2">
              <CreateChannelPopover
                variant="dialog"
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
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {orderedChannels.map(channel => (
              <MobileChannelItem
                key={channel.id}
                channel={channel}
                isActive={currentChannelId === channel.id}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
