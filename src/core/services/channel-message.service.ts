import { RxEvent } from "@/common/lib/rx-event";
import { firebaseNotesService } from "@/common/services/firebase";
import { Message, useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { createDataContainer, createSlice } from "rx-nested-bean";
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
  ReplaySubject,
  switchMap,
} from "rxjs";
import { v4 } from "uuid";

const withOptimisticUpdate = async (
  optimisticAction: () => void,
  remoteOperation: () => Promise<void>,
  rollbackAction: () => void
): Promise<void> => {
  optimisticAction();

  try {
    await remoteOperation();
  } catch (error) {
    rollbackAction();
    throw error;
  }
};

export type ChannelState = {
  messages: Message[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
  subscription?: {
    unsubscribe: () => void;
  };
};

export type LoadInitialMessagesRequest = {
  channelId: string;
  messageLimit?: number; // Optional, defaults to 20 if not provided
};

export class ChannelMessageService {
  moreMessageLoadedEvent$ = new RxEvent<{ channelId: string; messages: Message[] }>();

  /**
   * Request to load initial messages for a channel
   * @param request.channelId - The channel ID to load messages for
   * @param request.messageLimit - Optional message limit (defaults to 20)
   *
   * Usage examples:
   * - channelMessageService.requestLoadInitialMessages$.next({ channelId: "channel-123" })
   * - channelMessageService.requestLoadInitialMessages$.next({ channelId: "channel-123", messageLimit: 50 })
   */
  requestLoadInitialMessages$ = new ReplaySubject<LoadInitialMessagesRequest>(1);

  dataContainer = createDataContainer<{
    messageByChannel: Record<string, ChannelState>;
  }>({
    messageByChannel: {},
  });

  handleRequestWorkflow$ = this.requestLoadInitialMessages$.pipe(
    distinctUntilChanged(
      (prev, curr) => prev.channelId === curr.channelId && prev.messageLimit === curr.messageLimit
    ),
    filter(request => {
      const channelState = this.dataContainer.get().messageByChannel[request.channelId];
      return !channelState || (channelState.hasMore && !channelState.loading);
    }),
    switchMap(request =>
      this.loadInitialMessages({
        channelId: request.channelId,
        messagesLimit: request.messageLimit || 20,
      })
    )
  );

  connectToRequestWorkflow = () => {
    const subscription = this.handleRequestWorkflow$.subscribe();
    return () => subscription.unsubscribe();
  };

  getIsAnyChannelLoading$ = (channelIds: string[]) => {
    if (!channelIds.length) return of(false);
    return combineLatest(
      channelIds.map(cId => createSlice(this.dataContainer, `messageByChannel.${cId}.loading`).$)
    ).pipe(map(loadings => loadings.some(loading => loading)));
  };

  getChannelStateControl = (channelId: string) => {
    const control = createSlice(this.dataContainer, `messageByChannel.${channelId}`);
    const {
      get: getChannelState,
      namespaces: {
        loading: { set: setLoading },
        loadingMore: { set: setLoadingMore },
        messages: { set: setMessages },
        lastVisible: { set: setLastVisible },
        hasMore: { set: setHasMore },
        subscription: { set: setSubscription },
      },
    } = control;
    const addMessage = (message: Message) => {
      const prevMessages = getChannelState().messages || [];
      if (prevMessages.find(m => m.id === message.id)) {
        return;
      }
      const lastMessage = prevMessages[prevMessages.length - 1];
      if (lastMessage && lastMessage.content === message.content) {
        setMessages([...prevMessages.slice(0, -1), message]);
      } else {
        setMessages([...prevMessages, message]);
      }
    };
    const removeMessage = (messageId: string) => {
      const prevMessages = getChannelState().messages || [];
      setMessages(prevMessages.filter(m => m.id !== messageId));
    };
    const fixFakeMessage = (fakeId: string, realId: string) => {
      const prevMessages = getChannelState().messages || [];
      const realMessage = prevMessages.find(m => m.id === realId);
      if (realMessage) {
        setMessages(prevMessages.filter(m => m.id !== fakeId));
      } else {
        setMessages(prevMessages.map(m => (m.id === fakeId ? { ...m, id: realId, isNew: false } : m)));
      }
    };
    const clearChannel = () => {
      const currentState = getChannelState();
      setMessages([]);
      setLoading(false);
      setLoadingMore(false);
      setHasMore(false);
      setLastVisible(null);
      if (currentState?.subscription) {
        currentState.subscription.unsubscribe();
      }
    };
    return {
      getChannelState,
      setLoading,
      setLoadingMore,
      addMessage,
      updateMessage: this.updateMessage,
      setMessages,
      setLastVisible,
      setHasMore,
      setSubscription,
      removeMessage,
      fixFakeMessage,
      clearChannel,
    };
  };

  loadInitialMessages = async ({
    channelId,
    messagesLimit,
  }: {
    channelId: string;
    messagesLimit: number;
  }) => {
    console.log("[ChannelMessageService] loadInitialMessages", { channelId, messagesLimit });
    const { currentUser } = useNotesViewStore.getState();
    const userId = currentUser?.uid;
    console.log("[ChannelMessageService] loadInitialMessages", {
      channelId,
      messagesLimit,
      userId,
    });
    if (!userId || !channelId) return;

    const { setLoading, addMessage, setLastVisible, setHasMore, setSubscription } =
      this.getChannelStateControl(channelId);
    setLoading(true);

    try {
      const result = await firebaseNotesService.fetchInitialMessages(
        userId,
        channelId,
        messagesLimit
      );

      result.messages.forEach(addMessage);
      setLastVisible(result.lastVisible);
      setHasMore(!result.allLoaded);

      if (result.messages.length > 0) {
        const latestTimestamp = result.messages[0].timestamp;
        const unsubscribe = this.subscribeToNewMessages({
          channelId,
          afterTimestamp: latestTimestamp,
        });
        setSubscription({ unsubscribe });
      }
    } catch (error) {
      console.error("Error loading initial messages:", error);
    } finally {
      setLoading(false);
    }
  };

  loadMoreHistory = async ({
    channelId,
    messagesLimit,
  }: {
    channelId: string;
    messagesLimit: number;
  }) => {
    const { userId } = useNotesDataStore.getState();
    if (!userId || !channelId) return;

    const { getChannelState, setLoadingMore, setLastVisible, setHasMore, setMessages } =
      this.getChannelStateControl(channelId);
    const { loading, loadingMore, hasMore, lastVisible, messages } = getChannelState();

    if (!userId || !channelId || !hasMore || !lastVisible || loading || loadingMore) return;

    setLoadingMore(true);

    try {
      const result = await firebaseNotesService.fetchMoreMessages(
        userId,
        channelId,
        messagesLimit,
        lastVisible
      );

      if (result.messages.length > 0) {
        const updatedMessages = [...result.messages, ...messages];
        setMessages(updatedMessages);
        setLastVisible(result.lastVisible);
        this.moreMessageLoadedEvent$.emit({ channelId, messages: result.messages });
      }

      setHasMore(!result.allLoaded);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  subscribeToNewMessages = ({
    channelId,
    afterTimestamp,
  }: {
    channelId: string;
    afterTimestamp: Date;
  }): (() => void) => {
    const { userId } = useNotesDataStore.getState();
    if (!userId || !channelId) return () => {};
    const { addMessage, getChannelState, setSubscription } = this.getChannelStateControl(channelId);
    const { subscription: prevSubscription } = getChannelState();
    if (prevSubscription) {
      console.log("🔔 [subscribeToNewMessages] 取消之前的订阅");
      prevSubscription.unsubscribe();
    }

    console.log("🔔 [subscribeToNewMessages] 开始订阅新消息", { channelId, afterTimestamp });

    const unsubscribe = firebaseNotesService.subscribeToNewMessages(
      userId,
      channelId,
      afterTimestamp,
      newMessages => {
        newMessages.forEach(message => {
          addMessage(message);
        });
      }
    );
    setSubscription({ unsubscribe });

    return unsubscribe;
  };

  deleteMessage = async ({
    messageId,
    hardDelete,
    channelId,
  }: {
    messageId: string;
    hardDelete?: boolean;
    channelId: string;
  }) => {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;

    const { removeMessage, getChannelState, setMessages } = this.getChannelStateControl(channelId);
    const originalMessages = getChannelState().messages;

    await withOptimisticUpdate(
      () => removeMessage(messageId),
      async () => {
        if (hardDelete) {
          await firebaseNotesService.deleteMessage(userId, messageId);
        } else {
          await firebaseNotesService.softDeleteMessage(userId, messageId);
        }
        console.log("Message deleted successfully:", { messageId, channelId, hardDelete });
      },
      () => {
        setMessages(originalMessages);
        console.error("Failed to delete message, rolling back:", { messageId, channelId });
      }
    );
  };

  sendMessage = async (message: Omit<Message, "id" | "timestamp">) => {
    const { userId } = useNotesDataStore.getState();
    if (!userId) return;
    const { addMessage, fixFakeMessage } = this.getChannelStateControl(message.channelId);
    const tmpMessage: Message = { ...message, id: v4(), timestamp: new Date(), isNew: true };
    addMessage(tmpMessage);
    const realMsgId = await firebaseNotesService.createMessage(userId, message);
    fixFakeMessage(tmpMessage.id, realMsgId);
  };

  updateMessage = async ({
    messageId,
    channelId,
    updates,
    userId,
  }: {
    messageId: string;
    channelId: string;
    updates: Partial<Message>;
    userId: string;
  }) => {
    const { getChannelState, setMessages } = this.getChannelStateControl(channelId);
    const { messages } = getChannelState();

    const messageToUpdate = messages.find(m => m.id === messageId);
    if (!messageToUpdate) {
      throw new Error("Message not found");
    }

    if (messageToUpdate.sender !== "user") {
      throw new Error("You can only edit user messages, not AI messages");
    }

    const updatedMessage = { ...messageToUpdate, ...updates };

    await withOptimisticUpdate(
      () => setMessages(messages.map(m => (m.id === messageId ? updatedMessage : m))),
      async () => {
        await firebaseNotesService.updateMessage(userId, messageId, updates);
        console.log("Message updated successfully:", { messageId, channelId, updates });
      },
      () => {
        setMessages(messages.map(m => (m.id === messageId ? messageToUpdate : m)));
        console.error("Failed to update message, rolling back:", { messageId, channelId });
      }
    );
  };
}

export const channelMessageService = new ChannelMessageService();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).channelMessageService = channelMessageService;
