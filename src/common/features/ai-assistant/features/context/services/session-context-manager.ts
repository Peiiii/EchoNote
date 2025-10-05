import { channelContextManager } from "./channel-context-manager";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";

export class SessionContextManager {
  /**
   * Get conversation-scoped contexts. Fallback to a provided channel when no explicit contexts are set.
   */
  getSessionContexts(conversationId: string, fallbackChannelId: string) {
    const conv = useConversationStore.getState().conversations.find(c => c.id === conversationId);
    if (!conv || !conv.contexts) {
      return channelContextManager.getChannelContext(fallbackChannelId);
    }

    const { mode, channelIds } = conv.contexts;
    if (mode === 'none') {
      return [
        {
          description: 'System Instructions',
          value: JSON.stringify({ instructions: 'No external context is attached to this conversation. Respond based on user input only unless the user explicitly asks to reference notes.' })
        }
      ];
    }

    if (mode === 'channels') {
      const ids = channelIds || [];
      if (ids.length === 0) return [];
      // Concatenate contexts for each selected channel
      return ids.flatMap(id => channelContextManager.getChannelContext(id));
    }

    // mode === 'all'
    // Use all channels from notes data store and trigger loading for them
    const { channels } = useNotesDataStore.getState();
    const channelStates = channelMessageService.dataContainer.get().messageByChannel;
    
    // Trigger loading for all channels that haven't been loaded yet
    channels.forEach(channel => {
      if (!channelStates[channel.id]) {
        channelMessageService.requestLoadInitialMessages$.next({ channelId: channel.id });
      }
    });

    // Provide a compact global index so the agent is aware of all channels immediately
    const index = channels.map(c => ({ id: c.id, name: c.name, messageCount: c.messageCount }));
    const indexContext = [{
      description: 'Available Channels Index',
      value: JSON.stringify({ total: channels.length, channels: index })
    }];

    // Include detailed context for channels that have been loaded
    const readyIds = channels
      .map(c => c.id)
      .filter(id => {
        const channelState = channelStates[id];
        return channelState && !channelState.loading; // loaded and not currently loading
      });
      
    if (readyIds.length === 0) {
      // No loaded channels yet; return index + fallback channel so the model has some concrete context
      return [...indexContext, ...channelContextManager.getChannelContext(fallbackChannelId)];
    }
    
    const detailed = readyIds.flatMap(id => channelContextManager.getChannelContext(id));
    return [...indexContext, ...detailed];
  }
}

export const sessionContextManager = new SessionContextManager();
