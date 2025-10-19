import { useNotesViewStore } from "@/core/stores/notes-view.store";

export class ViewStateManager {
  setCurrentChannel = (channelId: string) => {
    useNotesViewStore.getState().setCurrentChannel(channelId);
  };
}
