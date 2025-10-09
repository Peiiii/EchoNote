import { useCallback } from "react";
import { useUIPreferencesStore } from "@/core/stores/ui-preferences.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useReadMoreStore } from "@/common/features/read-more/store/read-more.store";

export function useInputCollapse() {
  const { currentChannelId } = useNotesViewStore();

  // Get input collapsed state from store
  const inputCollapsed = useUIPreferencesStore(
    useCallback(
      state =>
        currentChannelId ? (state.timelineInputCollapsed[currentChannelId] ?? false) : false,
      [currentChannelId]
    )
  );

  // Get store actions
  const setTimelineInputCollapsed = useUIPreferencesStore(
    useCallback(state => state.setTimelineInputCollapsed, [])
  );
  const notifyLayoutChange = useReadMoreStore(useCallback(state => state.notifyLayoutChange, []));

  // Handle collapse input
  const handleCollapseInput = useCallback(() => {
    if (!currentChannelId) return;
    setTimelineInputCollapsed(currentChannelId, true);
    notifyLayoutChange();
  }, [currentChannelId, setTimelineInputCollapsed, notifyLayoutChange]);

  // Handle expand input
  const handleExpandInput = useCallback(() => {
    if (!currentChannelId) return;
    setTimelineInputCollapsed(currentChannelId, false);
    notifyLayoutChange();
  }, [currentChannelId, setTimelineInputCollapsed, notifyLayoutChange]);

  return {
    inputCollapsed,
    handleCollapseInput,
    handleExpandInput,
    currentChannelId,
  };
}
