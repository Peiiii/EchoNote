import { Channel, useNotesDataStore } from "@/core/stores/notes-data.store";


export class ChannelManager {
  addChannel = async (channel: Omit<Channel, "id" | "createdAt" | "messageCount">) => {
    return await useNotesDataStore.getState().addChannel(channel);
  };
  deleteChannel = async (channelId: string) => {
    return await useNotesDataStore.getState().deleteChannel(channelId);
  };
  updateChannel = async (channelId: string, updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>) => {
    return await useNotesDataStore.getState().updateChannel(channelId, updates);
  };
}