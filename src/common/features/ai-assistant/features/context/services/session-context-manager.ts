import { channelContextManager } from "./channel-context-manager";
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";
import { ConversationContextMode, type ConversationContextConfig } from "@/common/types/ai-conversation";

export class SessionContextManager {
  /**
   * Ensure that all channels required for the given context configuration are loaded.
   * This method triggers loading for channels that haven't been loaded yet.
   */
  ensureContextsLoaded(contexts: ConversationContextConfig | null, fallbackChannelId: string) {
    if (!contexts) {
      // Auto mode: ensure fallback channel is loaded
      const channelState = channelMessageService.dataContainer.get().messageByChannel[fallbackChannelId];
      if (!channelState) {
        channelMessageService.requestLoadInitialMessages$.next({ channelId: fallbackChannelId });
      }
      return;
    }

    const { mode, channelIds } = contexts;
    
    if (mode === ConversationContextMode.CHANNELS && channelIds) {
      // Load specific channels
      channelIds.forEach(id => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[id];
        if (!channelState) {
          channelMessageService.requestLoadInitialMessages$.next({ channelId: id });
        }
      });
    } else if (mode === ConversationContextMode.ALL) {
      // Load all channels
      const { channels } = useNotesDataStore.getState();
      channels.forEach(channel => {
        const channelState = channelMessageService.dataContainer.get().messageByChannel[channel.id];
        if (!channelState) {
          channelMessageService.requestLoadInitialMessages$.next({ channelId: channel.id });
        }
      });
    }
    // NONE mode doesn't require any channel loading
  }

  /**
   * Get conversation-scoped contexts. Fallback to a provided channel when no explicit contexts are set.
   */
  getSessionContexts(conversationId: string, fallbackChannelId: string) {
    const conv = useConversationStore.getState().conversations.find(c => c.id === conversationId);
    if (!conv || !conv.contexts) {
      return channelContextManager.getChannelContext(fallbackChannelId);
    }

    const { mode, channelIds } = conv.contexts;
    if (mode === ConversationContextMode.NONE) {
      return [
        {
          description: 'System Instructions',
          value: JSON.stringify({ instructions: 'No external context is attached to this conversation. Respond based on user input only unless the user explicitly asks to reference notes.' })
        }
      ];
    }

    if (mode === ConversationContextMode.CHANNELS) {
      const ids = channelIds || [];
      if (ids.length === 0) return [];
      // Concatenate contexts for each selected channel
      return ids.flatMap(id => channelContextManager.getChannelContext(id));
    }

    // mode === ConversationContextMode.ALL
    // Use all channels from notes data store (loading should be triggered by context control)
    const { channels } = useNotesDataStore.getState();
    const channelStates = channelMessageService.dataContainer.get().messageByChannel;

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
