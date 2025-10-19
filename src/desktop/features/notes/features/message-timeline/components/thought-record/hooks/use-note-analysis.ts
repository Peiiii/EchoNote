import { Message } from "@/core/stores/notes-data.store";
import { useState } from "react";

export function useNoteAnalysis(message: Message) {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const aiAnalysis = message.aiAnalysis;
  const hasSparks = Boolean(aiAnalysis?.insights?.length);
  const handleToggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };
  return {
    showAnalysis,
    handleToggleAnalysis,
    aiAnalysis,
    hasSparks,
  };
}
