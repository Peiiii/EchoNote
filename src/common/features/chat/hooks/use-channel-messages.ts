import { firebaseChatService } from '@/common/services/firebase/firebase-chat.service';
import { Message, useChatDataStore } from '@/core/stores/chat-data.store';
import { useChatViewStore } from '@/core/stores/chat-view.store';
import { useMemoizedFn } from 'ahooks';
import { DocumentSnapshot } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';


export const useStateWithRef = <T>(initialValue: T) => {
    const [value, _setValue] = useState(initialValue);
    const ref = useRef(initialValue);
    const setValue = useMemoizedFn((value: T) => {
        _setValue(value);
        ref.current = value;
    });
    return [value, setValue, ref] as const;
}

export const useChannelMessages = (messagesLimit: number = 20) => {
    const { currentChannelId } = useChatViewStore();
    const { userId } = useChatDataStore();

    // 1. 初始消息（最新N条）
    const [initialMessages, setInitialMessages] = useState<Message[]>([]);

    // 2. 新消息（实时订阅）
    const [newMessages, setNewMessages] = useState<Message[]>([]);

    // 3. 历史消息（分页获取）
    const [historyMessages, setHistoryMessages] = useState<Message[]>([]);

    // 状态管理
    const [loading, setLoading, loadingRef] = useStateWithRef(true);
    const [, setLoadingMore, loadingMoreRef] = useStateWithRef(false);
    const [hasMoreHistory, setHasMoreHistory, hasMoreHistoryRef] = useStateWithRef(true);
    const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

    // Refs
    const newMessagesUnsubscribeRef = useRef<(() => void) | null>(null);

    // 合并所有消息
    const allMessages = useMemo(() => {
        return [...historyMessages, ...initialMessages, ...newMessages].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );
    }, [historyMessages, initialMessages, newMessages]);

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
            (messages) => {
                setNewMessages(messages);
            }
        );

        newMessagesUnsubscribeRef.current = unsubscribe;
    }, [userId]);

    // 加载初始消息
    const loadInitialMessages = useCallback(async (channelId: string) => {
        if (!userId || !channelId) return;

        setLoading(true);
        try {
            const result = await firebaseChatService.fetchInitialMessages(
                userId,
                channelId,
                messagesLimit
            );

            setInitialMessages(result.messages);
            setLastVisible(result.lastVisible);
            setHasMoreHistory(!result.allLoaded);

            if (result.messages.length > 0) {
                const latestTimestamp = result.messages[0].timestamp;
                subscribeToNewMessages(channelId, latestTimestamp);
            }

        } catch (error) {
            console.error('Error loading initial messages:', error);
        } finally {
            setLoading(false);
        }
    }, [userId, setLoading, messagesLimit, setHasMoreHistory, subscribeToNewMessages]);

    const loadMoreHistory = useCallback(async () => {
        if (!userId || !currentChannelId || !hasMoreHistoryRef.current || !lastVisible || loadingRef.current || loadingMoreRef.current) return;

        setLoadingMore(true);
        const result = await firebaseChatService.fetchMoreMessages(
            userId,
            currentChannelId,
            messagesLimit,
            lastVisible
        );

        if (result.messages.length > 0) {
            setHistoryMessages(prev => [...prev, ...result.messages]);
            setLastVisible(result.lastVisible);
        }
        setHasMoreHistory(!result.allLoaded);
        setLoadingMore(false);
    }, [userId, currentChannelId, hasMoreHistoryRef, lastVisible, loadingRef, loadingMoreRef, setLoadingMore, messagesLimit, setHasMoreHistory]);

    const refresh = useCallback(() => {
        if (currentChannelId) {
            setInitialMessages([]);
            setNewMessages([]);
            setHistoryMessages([]);
            setLastVisible(null);
            setHasMoreHistory(true);
            loadInitialMessages(currentChannelId);
        }
    }, [currentChannelId, loadInitialMessages, setHasMoreHistory]);


    useEffect(() => {
        if (currentChannelId) {
            setInitialMessages([]);
            setNewMessages([]);
            setHistoryMessages([]);
            setLastVisible(null);
            setHasMoreHistory(true);
            loadInitialMessages(currentChannelId);
        }

        return () => {
            if (newMessagesUnsubscribeRef.current) {
                newMessagesUnsubscribeRef.current();
                newMessagesUnsubscribeRef.current = null;
            }
        };
    }, [currentChannelId, loadInitialMessages, setHasMoreHistory]);

    useEffect(() => {
        return () => {
            if (newMessagesUnsubscribeRef.current) {
                newMessagesUnsubscribeRef.current();
            }
        };
    }, []);

    return {
        messages: allMessages,
        loading,
        hasMore: hasMoreHistory,
        hasMoreRef: hasMoreHistoryRef,
        loadingRef,
        loadMore: loadMoreHistory,
        loadingMoreRef,
        refresh
    };
};
