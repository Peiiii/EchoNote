import { useEffect, useCallback, useState, useRef } from 'react';
import { useChatViewStore } from '@/core/stores/chat-view.store';
import { firebaseChatService } from '@/common/services/firebase/firebase-chat.service';
import { useChatDataStore } from '@/core/stores/chat-data.store';
import { DocumentSnapshot } from 'firebase/firestore';
import { Message } from '@/core/stores/chat-data.store';

export const usePaginatedMessages = (messagesLimit: number = 20) => {
  const { currentChannelId } = useChatViewStore();
  const { userId } = useChatDataStore();
  
  // Local state for current channel messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  
  // Ref to track current subscription
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to channel messages
  const subscribeToChannel = useCallback((channelId: string) => {
    if (!userId || !channelId) return;
    
    // Clean up previous subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    // Reset state for new channel
    setMessages([]);
    setHasMore(true);
    setLastVisible(null);
    setLoading(true);
    
    // Subscribe to channel messages
    const unsubscribe = firebaseChatService.subscribeToChannelMessages(
      userId,
      channelId,
      messagesLimit,
      (newMessages, hasMoreMessages) => {
        setMessages(newMessages);
        setHasMore(hasMoreMessages);
        setLoading(false);
      }
    );
    
    unsubscribeRef.current = unsubscribe;
  }, [userId, messagesLimit]);

  // Load more messages (for pagination)
  const loadMoreMessages = useCallback(async () => {
    if (!userId || !currentChannelId || !hasMore || !lastVisible || loading) return;
    
    setLoading(true);
    try {
      const result = await firebaseChatService.fetchMoreMessages(
        userId, 
        currentChannelId, 
        messagesLimit,
        lastVisible
      );
      
      // Append new messages to existing ones
      setMessages(prev => [...prev, ...result.messages]);
      setLastVisible(result.lastVisible);
      setHasMore(!result.allLoaded);
    } catch (error) {
      console.error('Error fetching more messages:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentChannelId, hasMore, lastVisible, loading, messagesLimit]);

  // Refresh messages for current channel
  const refresh = useCallback(() => {
    if (currentChannelId) {
      subscribeToChannel(currentChannelId);
    }
  }, [currentChannelId, subscribeToChannel]);

  // Subscribe to channel when it changes
  useEffect(() => {
    if (currentChannelId) {
      subscribeToChannel(currentChannelId);
    }
    
    // Cleanup subscription on unmount or channel change
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [currentChannelId, subscribeToChannel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    messages,
    loading,
    hasMore,
    loadMore: loadMoreMessages,
    refresh
  };
};
