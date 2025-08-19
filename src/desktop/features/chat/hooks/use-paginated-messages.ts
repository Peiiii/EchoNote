import { useEffect, useCallback, useState } from 'react';
import { useChatViewStore } from '@/core/stores/chat-view-store';
import { firebaseChatService } from '@/common/services/firebase/firebase-chat.service';
import { useChatDataStore } from '@/core/stores/chat-data-store';
import { DocumentSnapshot } from 'firebase/firestore';

export const usePaginatedMessages = (messagesLimit: number = 20) => {
  const { currentChannelId } = useChatViewStore();
  const { userId, messages: allMessages } = useChatDataStore();
  
  // 过滤当前频道的消息并按时间排序（最早的在前，最新的在后），排除已删除的消息
  const messages = allMessages
    .filter(msg => msg.channelId === currentChannelId && !msg.isDeleted)
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  // 分页相关状态
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);

  // 获取初始消息
  const fetchInitialMessages = useCallback(async () => {
    if (!userId || !currentChannelId) return;
    
    setLoading(true);
    try {
      const result = await firebaseChatService.fetchInitialMessages(
        userId, 
        currentChannelId, 
        messagesLimit
      );
      
      setLastVisible(result.lastVisible);
      setHasMore(!result.allLoaded);
    } catch (error) {
      console.error('Error fetching initial messages:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentChannelId, messagesLimit]);

  // 加载更多消息
  const loadMoreMessages = useCallback(async () => {
    if (!userId || !currentChannelId || !hasMore || !lastVisible) return;
    
    setLoading(true);
    try {
      const result = await firebaseChatService.fetchMoreMessages(
        userId, 
        currentChannelId, 
        messagesLimit,
        lastVisible
      );
      
      setLastVisible(result.lastVisible);
      setHasMore(!result.allLoaded);
    } catch (error) {
      console.error('Error fetching more messages:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentChannelId, hasMore, lastVisible, messagesLimit]);

  // 监听当前频道变化
  useEffect(() => {
    fetchInitialMessages();
  }, [fetchInitialMessages]);

  return {
    messages,
    loading,
    hasMore,
    loadMore: loadMoreMessages,
    refresh: fetchInitialMessages
  };
};