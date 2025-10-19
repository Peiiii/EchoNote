import { Message, useNotesDataStore } from "@/core/stores/notes-data.store";

export class ThreadManager {
  addThreadMessage = async (
    parentMessageId: string,
    message: Omit<Message, "id" | "timestamp" | "parentId" | "threadId">
  ) => {
    return await useNotesDataStore.getState().addThreadMessage(parentMessageId, message);
  };
}
