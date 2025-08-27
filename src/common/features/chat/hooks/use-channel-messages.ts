import { firebaseChatService } from '@/common/services/firebase/firebase-chat.service';
import { Message, useChatDataStore } from '@/core/stores/chat-data.store';
import { useChatViewStore } from '@/core/stores/chat-view.store';
import { useMemoizedFn } from 'ahooks';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useStateWithRef = <T>(initialValue: T) => {
    const [value, _setValue] = useState(initialValue);
    const ref = useRef(initialValue);
    const setValue = useMemoizedFn((value: T) => {
        _setValue(value);
        ref.current = value;
    });
    return [value, setValue, ref] as const;
}

export interface UseChannelMessagesOptions {
    messagesLimit?: number;
    onBeforeLoadMore?: () => void;
    onHistoryMessagesChange?: (messages: Message[]) => void;
}

export const useChannelMessages = ({
    messagesLimit = 20,
    onBeforeLoadMore,
    onHistoryMessagesChange,
}: UseChannelMessagesOptions) => {
    const { currentChannelId } = useChatViewStore();
    const { userId } = useChatDataStore();
    
    // 使用Zustand的推荐用法：选择器模式
    const channelState = useChatDataStore(state => 
        state.messagesByChannel[currentChannelId || ''] || {
            messages: [],
            loading: false,
            hasMore: true,
            lastVisible: null
        }
    );
    
    // 获取actions，避免在useEffect依赖中
    const setChannelMessages = useChatDataStore(state => state.setChannelMessages);
    const setChannelLoading = useChatDataStore(state => state.setChannelLoading);
    const setChannelHasMore = useChatDataStore(state => state.setChannelHasMore);
    const setChannelLastVisible = useChatDataStore(state => state.setChannelLastVisible);
    const addChannelMessage = useChatDataStore(state => state.addChannelMessage);
    const clearChannelMessages = useChatDataStore(state => state.clearChannelMessages);

    // 解构状态，保持现有API兼容性
    const { messages, loading, hasMore, lastVisible } = channelState;

    // Refs for internal state management (保持现有逻辑)
    const loadingRef = useRef(loading);
    const loadingMoreRef = useRef(false);
    const hasMoreRef = useRef(hasMore);
    const newMessagesUnsubscribeRef = useRef<(() => void) | null>(null);

    // 同步refs和store状态
    useEffect(() => {
        loadingRef.current = loading;
        hasMoreRef.current = hasMore;
    }, [loading, hasMore]);

    // 订阅新消息
    const subscribeToNewMessages = useCallback((channelId: string, afterTimestamp: Date) => {
        if (!userId) return;

        if (newMessagesUnsubscribeRef.current) {
            newMessagesUnsubscribeRef.current();
        }

        const unsubscribe = firebaseChatService.subscribeToNewMessages(
            userId,
            channelId,
            afterTimestamp,
            (newMessages) => {
                // 使用store方法添加新消息
                newMessages.forEach(message => {
                    addChannelMessage(channelId, message);
                });
            }
        );

        newMessagesUnsubscribeRef.current = unsubscribe;
    }, [userId, addChannelMessage]);

    // 加载初始消息
    const loadInitialMessages = useCallback(async (channelId: string) => {
        if (!userId || !channelId) return;

        setChannelLoading(channelId, true);
        try {
            const result = await firebaseChatService.fetchInitialMessages(
                userId,
                channelId,
                messagesLimit
            );

            setChannelMessages(channelId, result.messages);
            setChannelLastVisible(channelId, result.lastVisible);
            setChannelHasMore(channelId, !result.allLoaded);

            if (result.messages.length > 0) {
                const latestTimestamp = result.messages[0].timestamp;
                subscribeToNewMessages(channelId, latestTimestamp);
            }

        } catch (error) {
            console.error('Error loading initial messages:', error);
        } finally {
            setChannelLoading(channelId, false);
        }
    }, [userId, messagesLimit, subscribeToNewMessages, setChannelMessages, setChannelLoading, setChannelHasMore, setChannelLastVisible]);

    const loadMoreHistory = useCallback(async () => {
        if (!userId || !currentChannelId || !hasMore || !lastVisible || loadingRef.current || loadingMoreRef.current) return;

        // 记录加载前的滚动位置
        onBeforeLoadMore?.();

        loadingMoreRef.current = true;
        try {
            const result = await firebaseChatService.fetchMoreMessages(
                userId,
                currentChannelId,
                messagesLimit,
                lastVisible
            );
            
            if (result.messages.length > 0) {
                // 合并历史消息到现有消息
                const currentMessages = channelState.messages;
                const updatedMessages = [...result.messages, ...currentMessages];
                setChannelMessages(currentChannelId, updatedMessages);
                setChannelLastVisible(currentChannelId, result.lastVisible);
            }
            
            setChannelHasMore(currentChannelId, !result.allLoaded);
        } catch (error) {
            console.error('Error loading more messages:', error);
        } finally {
            loadingMoreRef.current = false;
        }
    }, [userId, currentChannelId, hasMore, lastVisible, loadingRef, loadingMoreRef, onBeforeLoadMore, messagesLimit, channelState.messages, setChannelMessages, setChannelHasMore, setChannelLastVisible]);

    useEffect(() => {
        onHistoryMessagesChange?.(messages);
    }, [messages, onHistoryMessagesChange]);

    const refresh = useCallback(() => {
        if (currentChannelId) {
            // 清除channel消息并重新加载
            clearChannelMessages(currentChannelId);
            setChannelHasMore(currentChannelId, true);
            loadInitialMessages(currentChannelId);
        }
    }, [currentChannelId, loadInitialMessages, clearChannelMessages, setChannelHasMore]);

    useEffect(() => {
        if (currentChannelId) {
            // 清除channel消息并重新加载
            clearChannelMessages(currentChannelId);
            setChannelHasMore(currentChannelId, true);
            loadInitialMessages(currentChannelId);
        }

        return () => {
            if (newMessagesUnsubscribeRef.current) {
                newMessagesUnsubscribeRef.current();
                newMessagesUnsubscribeRef.current = null;
            }
        };
    }, [currentChannelId, loadInitialMessages, clearChannelMessages, setChannelHasMore]);

    useEffect(() => {
        return () => {
            if (newMessagesUnsubscribeRef.current) {
                newMessagesUnsubscribeRef.current();
            }
        };
    }, []);

    return {
        messages,
        loading,
        hasMore,
        hasMoreRef,
        loadingRef,
        loadMore: loadMoreHistory,
        loadingMoreRef,
        refresh,
    };
};
