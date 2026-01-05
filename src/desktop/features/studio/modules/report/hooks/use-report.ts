import { useCallback, useState } from "react";
import { useStudioStore } from "@/core/stores/studio.store";
import { generateReport } from "../services/report.service";
import { ReportData } from "../types";
import { StudioContentItem } from "@/core/stores/studio.store";

export function useReport() {
  const { addContentItem, updateContentItem, setGenerating } = useStudioStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = useCallback(
    async (channelIds: string[]) => {
      if (channelIds.length === 0) {
        throw new Error("At least one channel is required");
      }

      setIsGenerating(true);
      setGenerating(true);

      const itemId = `report-${Date.now()}`;
      const tempData: ReportData = {
        title: "Report",
        executiveSummary: "",
        keyThemes: [],
        insights: [],
        tensions: [],
        actionItems: [],
        openQuestions: [],
        reportMarkdown: "",
        generatedAt: Date.now(),
        contextChannelIds: channelIds,
      };
      const tempItem: StudioContentItem = {
        id: itemId,
        moduleId: "report",
        title: "Report",
        contextChannelIds: channelIds,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        data: tempData,
        status: "generating",
      };

      addContentItem(tempItem);

      try {
        const data = await generateReport(channelIds);

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

