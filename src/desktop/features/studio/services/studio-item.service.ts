import { useStudioStore } from "@/core/stores/studio.store";
import { studioAudioCache } from "../modules/audio-summary/services/studio-audio-cache.service";
import type { AudioPodcastData } from "../modules/audio-summary/types";

export async function deleteStudioItem(itemId: string): Promise<void> {
  const { contentItems, deleteContentItem } = useStudioStore.getState();
  const all = Object.values(contentItems).flat();
  const item = all.find((i) => i.id === itemId);

  if (item?.moduleId === "audio-summary") {
    const data = item.data as AudioPodcastData | undefined;
    if (data?.audioStorageKey) {
      try {
        await studioAudioCache.delete(data.audioStorageKey);
      } catch (e) {
        console.warn("[studio-item] Failed to delete audio cache", e);
      }
    }
  }

  deleteContentItem(itemId);
}

