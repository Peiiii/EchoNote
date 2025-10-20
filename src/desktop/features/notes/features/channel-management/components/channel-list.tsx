import { CollapsibleSidebar } from "@/common/components/collapsible-sidebar";
import { CreateChannelPopover } from "@/common/features/channel-management/components/create-channel-popover";
import { useAutoSelectFirstChannel } from "@/common/hooks/use-auto-select-first-channel";
import { logService } from "@/core/services/log.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChannelItem } from "./channel-item";
import { ChannelListEmptyState } from "./channel-list-empty-state";
import { ChannelListSkeleton } from "./channel-list-skeleton";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";

interface ChannelListProps {
  showFadeEffect?: boolean;
}

export function ChannelList({ showFadeEffect = false }: ChannelListProps) {
  const presenter = useCommonPresenterContext();
  const channels = useNotesDataStore(state => state.channels);
  const channelsLoading = useNotesDataStore(state => state.channelsLoading);
  const currentChannelId = useNotesViewStore(state => state.currentChannelId);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useAutoSelectFirstChannel();

  // Sort channels by activity:
  // 1) lastMessageTime (desc) if exists
  // 2) else updatedAt (desc)
  // 3) else createdAt (desc)
  const orderedChannels = useMemo(() => {
    const getActivity = (c: (typeof channels)[number]) => {
      const t1 = c.lastMessageTime?.getTime();
      const t2 = c.updatedAt?.getTime();
      const t3 = c.createdAt?.getTime?.() ? c.createdAt.getTime() : 0;
      return t1 ?? t2 ?? t3 ?? 0;
    };
    return [...channels].sort((a, b) => getActivity(b) - getActivity(a));
  }, [channels]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      setHasScroll(scrollHeight > clientHeight);
    }
  });

  // Show skeleton while loading
  if (channelsLoading) {
    return <ChannelListSkeleton />;
  }

  return (
    <div
      data-component="channel-list"
      className="flex flex-col h-full overflow-hidden bg-card shadow-sm"
    >
      {/* Header */}
      <div
        data-component="channel-list-header"
        className="h-12 px-4 flex items-center justify-between"
      >
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 truncate">
            Spaces
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <CreateChannelPopover
            trigger={
              <button
                type="button"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                aria-label="New space"
                title="New space"
              >
                <Plus className="w-4 h-4" />
              </button>
            }
          />
          <CollapsibleSidebar.ToggleButton />
        </div>
      </div>

      {/* Channel List */}
      <div
        ref={scrollContainerRef}
        data-component="channel-list-content"
        className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0 channel-list-content"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {orderedChannels.length === 0 ? (
          <ChannelListEmptyState />
        ) : (
          orderedChannels.map(channel => (
            <ChannelItem
              key={channel.id}
              channel={channel}
              isActive={currentChannelId === channel.id}
              onClick={() => {
                logService.logChannelSelect(
                  channel.id,
                  channel.name,
                  channel.messageCount || 0
                );
                presenter.viewStateManager.setCurrentChannel(channel.id);
              }}
            />
          ))
        )}
      </div>

      {/* Fade effect overlay container - positioned outside channel list */}
      {hasScroll && showFadeEffect && (
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-100/90 dark:from-slate-800/90 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
