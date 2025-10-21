import { channelMessageService } from "@/core/services/channel-message.service";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

export class NoteTimelineManager {
    loadMoreNotes = async () => {
        const currentChannelId = useNotesViewStore.getState().currentChannelId;
        if (!currentChannelId) return;
        await channelMessageService.loadMoreHistory({ channelId: currentChannelId, messagesLimit: 20 });
    }
}