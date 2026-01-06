import { useCallback, useState } from "react";
import { useStudioStore } from "@/core/stores/studio.store";
import { AudioPodcastData } from "../types";
import { StudioContentItem } from "@/core/stores/studio.store";
import { generateAudioPodcast } from "../services/audio-podcast.service";

export function useAudioSummary() {
  const { addContentItem, updateContentItem, setGenerating } = useStudioStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(
    async (channelIds: string[]) => {
      if (channelIds.length === 0) {
        throw new Error("At least one channel is required");
      }

      setIsGenerating(true);
      setGenerating(true);

      const itemId = `audio-summary-${Date.now()}`;
      const tempData: AudioPodcastData = {
        title: "Audio",
        description: "",
        turns: [],
        transcriptMarkdown: "",
        generatedAt: Date.now(),
        contextChannelIds: channelIds,
      };
      const tempItem: StudioContentItem = {
        id: itemId,
        moduleId: "audio-summary",
        title: "Audio",
        contextChannelIds: channelIds,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: tempData,
        status: "generating",
      };

      addContentItem(tempItem);

      try {
        const data = await generateAudioPodcast({ channelIds, itemId });
        updateContentItem(itemId, {
          status: "completed",
          data,
          title: data.title,
        });
        return itemId;
      } catch (error) {
        updateContentItem(itemId, {
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
        throw error;
      } finally {
        setIsGenerating(false);
        setGenerating(false);
      }
    },
    [addContentItem, updateContentItem, setGenerating]
  );

  return {
    generate,
    isGenerating,
  };
}

