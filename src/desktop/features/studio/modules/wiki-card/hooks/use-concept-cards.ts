import { useCallback, useState } from "react";
import { useStudioStore } from "@/core/stores/studio.store";
import { generateConceptCards } from "../services/concept-cards.service";
import { ConceptCardsData } from "../types";
import { StudioContentItem } from "@/core/stores/studio.store";

export function useConceptCards() {
  const { addContentItem, updateContentItem, setGenerating } = useStudioStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(
    async (channelIds: string[]) => {
      if (channelIds.length === 0) {
        throw new Error("At least one channel is required");
      }

      setIsGenerating(true);
      setGenerating(true);

      const itemId = `wiki-card-${Date.now()}`;
      const tempData: ConceptCardsData = {
        cards: [],
        generatedAt: Date.now(),
        contextChannelIds: channelIds,
      };
      const tempItem: StudioContentItem = {
        id: itemId,
        moduleId: "wiki-card",
        title: "Concept Cards",
        contextChannelIds: channelIds,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: tempData,
        status: "generating",
      };

      addContentItem(tempItem);

      try {
        const data = await generateConceptCards(channelIds);
        
        updateContentItem(itemId, {
          status: "completed",
          data,
          title: `Concept Cards (${data.cards.length} cards)`,
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
