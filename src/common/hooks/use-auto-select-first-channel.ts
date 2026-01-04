import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect } from "react";

export const useAutoSelectFirstChannel = () => {
  const channels = useNotesDataStore(s => s.channels);
  const userId = useNotesDataStore(s => s.userId);
  const channelsLoading = useNotesDataStore(s => s.channelsLoading);
  const hasHydrated = useNotesViewStore(s => s.hasHydrated);
  const setCurrentChannel = useNotesViewStore(s => s.setCurrentChannel);
  const currentChannelId = useNotesViewStore(s => s.currentChannelId);
  const lastChannelIdByUserId = useNotesViewStore(s => s.lastChannelIdByUserId);

  useEffect(() => {
    if (!hasHydrated) return;
    // Wait until we know which dataset we're in (guest:* or firebase uid) and channels are loaded.
    if (!userId) return;

    // Fast path: preselect the last channel as soon as we know the userId so message loading can
    // start in parallel with channel subscription. Validity is verified once channels arrive.
    if (!currentChannelId) {
      const lastForUser = lastChannelIdByUserId[userId];
      if (lastForUser) {
        setCurrentChannel(lastForUser);
      }
    }

    if (channelsLoading) return;
    if (channels.length === 0) return;

    const hasValidCurrent =
      !!currentChannelId && channels.some(c => c.id === currentChannelId);
    if (hasValidCurrent) return;

    const lastForUser = userId ? lastChannelIdByUserId[userId] : undefined;
    if (lastForUser && channels.some(c => c.id === lastForUser)) {
      setCurrentChannel(lastForUser);
      return;
    }

    setCurrentChannel(channels[0].id);
  }, [
    channels,
    channelsLoading,
    currentChannelId,
    hasHydrated,
    lastChannelIdByUserId,
    setCurrentChannel,
    userId,
  ]);
};
