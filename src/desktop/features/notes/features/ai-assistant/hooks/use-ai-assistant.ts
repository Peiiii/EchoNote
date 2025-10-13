import { useState, useRef } from "react";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { logService, AITrigger } from "@/core/services/log.service";

export function useAIAssistant() {
  const { currentChannelId } = useNotesViewStore();
  const sessionStartTime = useRef<number | null>(null);
  const messageCount = useRef<number>(0);

  // AI Assistant sidebar state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [aiAssistantChannelId, setAIAssistantChannelId] = useState<string | null>(null);

  // AI Assistant handler functions
  const handleOpenAIAssistant = (channelId?: string, trigger: AITrigger = AITrigger.BUTTON) => {
    const targetChannelId = channelId || currentChannelId;
    if (targetChannelId) {
      setAIAssistantChannelId(targetChannelId);
      setIsAIAssistantOpen(true);
      sessionStartTime.current = Date.now();
      messageCount.current = 0;
      logService.logAIAssistantOpen(targetChannelId, trigger);
    }
  };

  const handleCloseAIAssistant = () => {
    if (aiAssistantChannelId && sessionStartTime.current) {
      const sessionDuration = Date.now() - sessionStartTime.current;
      logService.logAIAssistantClose(aiAssistantChannelId, sessionDuration, messageCount.current);
    }
    setIsAIAssistantOpen(false);
    setAIAssistantChannelId(null);
    sessionStartTime.current = null;
    messageCount.current = 0;
  };

  const incrementMessageCount = () => {
    messageCount.current += 1;
  };

  // Current AI Assistant channel
  const currentAIAssistantChannel = aiAssistantChannelId || currentChannelId;

  return {
    // State
    isAIAssistantOpen,
    aiAssistantChannelId,
    currentAIAssistantChannel,

    // Handler functions
    handleOpenAIAssistant,
    handleCloseAIAssistant,
    incrementMessageCount,
  };
}
