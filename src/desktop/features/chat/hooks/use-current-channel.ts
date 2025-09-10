import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

export function useCurrentChannel() {
    const { channels } = useNotesDataStore();
    const { currentChannelId } = useNotesViewStore();
    
    return channels.find((channel) => channel.id === currentChannelId) || null;
}
