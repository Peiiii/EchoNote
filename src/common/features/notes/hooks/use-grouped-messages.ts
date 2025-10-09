import { useMemo } from "react";
import { Message } from "@/core/stores/notes-data.store";

export const useGroupedMessages = (messages?: Message[]) => {
  return useMemo(() => {
    if (!messages || messages.length === 0) {
      return {};
    }

    const grouped: Record<string, Message[]> = {};

    messages.forEach(message => {
      const date = new Date(message.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(message);
    });

    // Sort messages within each day by timestamp
    Object.keys(grouped).forEach(date => {
      grouped[date].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    });

    // Sort days by timestamp (oldest first - to match message order)
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const dateA = new Date(grouped[a][0]?.timestamp || 0);
      const dateB = new Date(grouped[b][0]?.timestamp || 0);
      return dateA.getTime() - dateB.getTime();
    });

    const sortedGrouped: Record<string, Message[]> = {};
    sortedDates.forEach(date => {
      sortedGrouped[date] = grouped[date];
    });

    return sortedGrouped;
  }, [messages]);
};
