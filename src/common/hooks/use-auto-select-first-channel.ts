import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useEffect } from "react";

export const useAutoSelectFirstChannel = () => {
  const channels = useNotesDataStore(s => s.channels);
  const userId = useNotesDataStore(s => s.userId);
  const setCurrentChannel = useNotesViewStore(s => s.setCurrentChannel);
  const currentChannelId = useNotesViewStore(s => s.currentChannelId);
  const lastChannelIdByUserId = useNotesViewStore(s => s.lastChannelIdByUserId);

  useEffect(() => {
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
  }, [channels, currentChannelId, lastChannelIdByUserId, setCurrentChannel, userId]);
};
