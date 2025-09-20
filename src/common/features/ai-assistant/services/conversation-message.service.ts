import { createDataContainer, createSlice } from 'rx-nested-bean';
import { ReplaySubject, from } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { useNotesDataStore } from '@/core/stores/notes-data.store';
import type { UIMessage } from '@agent-labs/agent-chat';
import { firebaseAIConversationService } from '@/common/services/firebase/firebase-ai-conversation.service';

export type ConversationMessagesState = {
  messages: UIMessage[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  subscription?: { unsubscribe: () => void };
};

function dedupeById(items: UIMessage[]): UIMessage[] {
  const map = new Map<string, UIMessage>();
  for (const m of items) {
    if (!m?.id) continue;
    map.set(m.id, m);
  }
  return Array.from(map.values());
}

export class ConversationMessageService {
  dataContainer = createDataContainer<{
    messageByConversation: Record<string, ConversationMessagesState>;
  }>({ messageByConversation: {} });

  requestLoadInitialMessages$ = new ReplaySubject<string>(1);

  handleRequestWorkflow$ = this.requestLoadInitialMessages$.pipe(
    distinctUntilChanged(),
    tap(id => console.log("[ConversationMessageService] handleRequestWorkflow$", id)),
    filter(id => !this.dataContainer.get().messageByConversation[id]),
    switchMap(id => from(this.loadInitialMessages({ conversationId: id })))
  );

  connectToRequestWorkflow = () => {
    const sub = this.handleRequestWorkflow$.subscribe();
    return () => sub.unsubscribe();
  };

  getConversationStateControl(conversationId: string) {
    const ctrl = createSlice(this.dataContainer, `messageByConversation.${conversationId}`);
    const {
      get: getState,
      namespaces: {
        messages: { set: setMessages },
        loading: { set: setLoading },
        loadingMore: { set: setLoadingMore },
        hasMore: { set: setHasMore },
        subscription: { set: setSubscription },
      },
    } = ctrl;

    const ensureInit = () => {
      if (!getState()) {
        ctrl.set({
          messages: [],
          loading: false,
          loadingMore: false,
          hasMore: true,
        } as ConversationMessagesState);
      }
    };

    const setMessagesDedupe = (arr: UIMessage[]) => setMessages(dedupeById(arr));
    const mergeAndSet = (arr: UIMessage[]) => {
      const prev = getState()?.messages || [];
      setMessagesDedupe([...prev, ...arr]);
    };

    const upsert = (msg: UIMessage) => {
      const prev = getState()?.messages || [];
      const idx = prev.findIndex(m => m.id === msg.id);
      if (idx === -1) setMessagesDedupe([...prev, msg]);
      else setMessagesDedupe([...prev.slice(0, idx), msg, ...prev.slice(idx + 1)]);
    };

    return {
      getState,
      ensureInit,
      setMessages: setMessagesDedupe,
      setLoading,
      setLoadingMore,
      setHasMore,
      setSubscription,
      mergeAndSet,
      upsert,
    };
  }

  loadInitialMessages = async ({ conversationId }: { conversationId: string }) => {
    const { userId } = useNotesDataStore.getState();
    if (!userId || !conversationId) return;
    const { ensureInit, setLoading, setMessages, setSubscription } = this.getConversationStateControl(conversationId);
    ensureInit();
    setLoading(true);
    try {
      const list = await firebaseAIConversationService.getMessages(userId, conversationId);
      setMessages(list);
      const unsubscribe = this.subscribeToMessages({ userId, conversationId });
      setSubscription({ unsubscribe });
    } finally {
      setLoading(false);
    }
  };

  subscribeToMessages = ({ userId, conversationId }: { userId: string; conversationId: string }) => {
    const { setMessages } = this.getConversationStateControl(conversationId);
    return firebaseAIConversationService.subscribeToMessages(userId, conversationId, msgs => setMessages(msgs || []));
  };

  async createMessage(userId: string, conversationId: string, message: UIMessage) {
    await firebaseAIConversationService.createMessage(userId, conversationId, message);
  }

  async updateMessage(userId: string, conversationId: string, message: UIMessage) {
    await firebaseAIConversationService.updateMessage(userId, conversationId, message.id, message);
  }
}

export const conversationMessageService = new ConversationMessageService();
