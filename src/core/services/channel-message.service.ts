import { RxEvent } from '@/common/lib/rx-event';
import { firebaseChatService } from '@/common/services/firebase';
import { Message, useChatDataStore } from '@/core/stores/chat-data.store';
import { useChatViewStore } from '@/core/stores/chat-view.store';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { createDataContainer, createSlice } from 'rx-nested-bean';
import { v4 } from 'uuid';

export type ChannelState = {
    messages: Message[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    lastVisible: QueryDocumentSnapshot<DocumentData, DocumentData> | null;
    subscription?: {
        unsubscribe: () => void;
    };
}


export class ChannelMessageService {

    moreMessageLoadedEvent$ = new RxEvent<{ channelId: string, messages: Message[] }>();

    dataContainer = createDataContainer<{
        messageByChannel: Record<string, ChannelState>;
    }>({
        messageByChannel: {}
    });

    getChannelStateControl = (channelId: string) => {
        const control = createSlice(this.dataContainer, `messageByChannel.${channelId}`);
        const {
            get: getChannelState,
            namespaces: {
                loading: {
                    set: setLoading
                },
                loadingMore: {
                    set: setLoadingMore
                },
                messages: {
                    set: setMessages
                },
                lastVisible: {
                    set: setLastVisible
                },
                hasMore: {
                    set: setHasMore
                },
                subscription: {
                    set: setSubscription
                }
            }
        } = control;
        const addMessage = (message: Message) => {
            const prevMessages = getChannelState().messages || [];
            if (prevMessages.find(m => m.id === message.id)) {
                return;
            }
            setMessages([...prevMessages, message]);
        }
        const removeMessage = (messageId: string) => {
            const prevMessages = getChannelState().messages || [];
            setMessages(prevMessages.filter(m => m.id !== messageId));
        }
        const fixFakeMessage = (fakeId: string, realId: string) => {
            const prevMessages = getChannelState().messages || [];
            const realMessage = prevMessages.find(m => m.id === realId);
            if (realMessage) {
                setMessages(prevMessages.filter(m => m.id !== fakeId));
            } else {
                setMessages(prevMessages.map(m => m.id === fakeId ? { ...m, id: realId } : m));
            }
        }
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
            fixFakeMessage
        };
    }

    loadInitialMessages = async ({ channelId, messagesLimit }: { channelId: string, messagesLimit: number }) => {
        const { currentUser } = useChatViewStore.getState();
        const userId = currentUser?.uid;
        console.log("[ChannelMessageService] loadInitialMessages", { channelId, messagesLimit, userId });
        if (!userId || !channelId) return;

        const { setLoading, addMessage, setLastVisible, setHasMore, setSubscription } = this.getChannelStateControl(channelId);
        setLoading(true);

        try {
            const result = await firebaseChatService.fetchInitialMessages(
                userId,
                channelId,
                messagesLimit
            );

            result.messages.forEach(addMessage);
            setLastVisible(result.lastVisible);
            setHasMore(!result.allLoaded);

            if (result.messages.length > 0) {
                const latestTimestamp = result.messages[0].timestamp;
                const unsubscribe = this.subscribeToNewMessages({ channelId, afterTimestamp: latestTimestamp });
                setSubscription({ unsubscribe });
            }

        } catch (error) {
            console.error('Error loading initial messages:', error);
        } finally {
            setLoading(false);
        }
    };

    loadMoreHistory = async ({ channelId, messagesLimit }: { channelId: string, messagesLimit: number }) => {
        const { userId } = useChatDataStore.getState();
        if (!userId || !channelId) return;

        const { getChannelState, setLoadingMore, setLastVisible, setHasMore, setMessages } = this.getChannelStateControl(channelId);
        const { loading, loadingMore, hasMore, lastVisible, messages } = getChannelState();

        if (!userId || !channelId || !hasMore || !lastVisible || loading || loadingMore) return;

        setLoadingMore(true);

        try {
            const result = await firebaseChatService.fetchMoreMessages(
                userId,
                channelId,
                messagesLimit,
                lastVisible
            );

            if (result.messages.length > 0) {
                // 合并历史消息到现有消息
                const updatedMessages = [...result.messages, ...messages];
                setMessages(updatedMessages);
                setLastVisible(result.lastVisible);
                this.moreMessageLoadedEvent$.emit({ channelId, messages: result.messages });
            }

            setHasMore(!result.allLoaded);
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            setLoadingMore(false);
        }
    }

    subscribeToNewMessages = ({ channelId, afterTimestamp }: { channelId: string, afterTimestamp: Date }): () => void => {
        const { userId } = useChatDataStore.getState();
        if (!userId || !channelId) return () => { };
        const {
            addMessage,
            getChannelState,
            setSubscription
        } = this.getChannelStateControl(channelId);
        const { subscription: prevSubscription } = getChannelState();
        // ✅ 防止重复订阅：如果已经订阅了同一个channel，先取消
        if (prevSubscription) {
            console.log('🔔 [subscribeToNewMessages] 取消之前的订阅');
            prevSubscription.unsubscribe();
        }

        console.log('🔔 [subscribeToNewMessages] 开始订阅新消息', { channelId, afterTimestamp });

        const unsubscribe = firebaseChatService.subscribeToNewMessages(
            userId,
            channelId,
            afterTimestamp,
            (newMessages) => {
                newMessages.forEach(message => {
                    addMessage(message);
                });
            }
        );
        setSubscription({ unsubscribe });

        return unsubscribe;
    };

    deleteMessage = async ({ messageId, hardDelete, channelId }: { messageId: string, hardDelete?: boolean, channelId: string }) => {
        const { userId } = useChatDataStore.getState();
        if (!userId) return;
        if (hardDelete) {
            await firebaseChatService.deleteMessage(userId, messageId);
        } else {
            await firebaseChatService.softDeleteMessage(userId, messageId);
        }
        const { removeMessage } = this.getChannelStateControl(channelId);
        removeMessage(messageId);
    }

    sendMessage = async (message: Omit<Message, 'id' | 'timestamp'>) => {
        const { userId } = useChatDataStore.getState();
        if (!userId) return;
        const { addMessage, fixFakeMessage } = this.getChannelStateControl(message.channelId);
        const tmpMessage: Message = { ...message, id: v4(), timestamp: new Date() }
        addMessage(tmpMessage);
        const realMsgId = await firebaseChatService.createMessage(userId, message);
        fixFakeMessage(tmpMessage.id, realMsgId);
    }

    updateMessage = async ({ messageId, channelId, updates, userId }: { 
        messageId: string, 
        channelId: string, 
        updates: Partial<Message>,
        userId: string 
    }) => {
        const { getChannelState, setMessages } = this.getChannelStateControl(channelId);
        const { messages } = getChannelState();
        
        const messageToUpdate = messages.find(m => m.id === messageId);
        if (!messageToUpdate) {
            throw new Error('Message not found');
        }
        
        if (messageToUpdate.sender !== "user") {
            throw new Error('You can only edit user messages, not AI messages');
        }
        
        const updatedMessage = { ...messageToUpdate, ...updates };
        
        try {
            setMessages(messages.map(m => m.id === messageId ? updatedMessage : m));
            
            await firebaseChatService.updateMessage(userId, messageId, updates);
            
            console.log('Message updated successfully:', { messageId, channelId, updates });
            
        } catch (error) {
            setMessages(messages.map(m => m.id === messageId ? messageToUpdate : m));
            console.error('Failed to update message:', error);
            throw error;
        }
    }
}

export const channelMessageService = new ChannelMessageService();