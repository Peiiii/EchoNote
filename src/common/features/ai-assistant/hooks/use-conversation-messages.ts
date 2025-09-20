import { useEffect, useMemo } from "react";
import type { UIMessage } from "@agent-labs/agent-chat";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { conversationMessageService } from "../services/conversation-message.service";
import { createSlice, useDataContainerState } from "rx-nested-bean";

export function useConversationMessages(conversationId: string) {
  const { userId } = useNotesDataStore();
  const slice = useMemo(
    () =>
      createSlice(
        conversationMessageService.dataContainer,
        `messageByConversation.${conversationId}`
      ),
    [conversationId]
  );
  const { value: state } = useDataContainerState(slice);
  useEffect(() => conversationMessageService.connectToRequestWorkflow(), []);

  useEffect(() => {
    if (!userId || !conversationId) return;
    conversationMessageService.requestLoadInitialMessages$.next(conversationId);
  }, [userId, conversationId]);

  const createMessage = async (m: UIMessage) => {
    if (!userId) return;
    await conversationMessageService.createMessage(userId, conversationId, m);
  };

  const updateMessage = async (m: UIMessage) => {
    if (!userId) return;
    await conversationMessageService.updateMessage(userId, conversationId, m);
  };

  return {
    messages: state?.messages || [],
    loading: state?.loading || false,
    createMessage,
    updateMessage,
  };
}
