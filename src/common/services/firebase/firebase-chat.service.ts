import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "@/common/config/firebase.config";
import { Message, Channel } from "@/core/stores/chat-data-store";

// 类型转换辅助函数
const docToChannel = (doc: DocumentSnapshot): Channel => {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    messageCount: data.messageCount || 0,
    lastMessageTime: (data.lastMessageTime as Timestamp)?.toDate(),
  };
};

const docToMessage = (doc: DocumentSnapshot): Message => {
  const data = doc.data()!;
  return {
    id: doc.id,
    content: data.content,
    sender: data.sender,
    channelId: data.channelId,
    timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
    tags: data.tags,
    parentId: data.parentId,
    threadId: data.threadId,
    isThreadExpanded: data.isThreadExpanded,
    threadCount: data.threadCount,
    aiAnalysis: data.aiAnalysis,
    // 删除相关字段
    isDeleted: data.isDeleted || false,
    deletedAt: data.deletedAt ? (data.deletedAt as Timestamp).toDate() : undefined,
    deletedBy: data.deletedBy,
    canRestore: data.canRestore,
  };
};

// 获取集合引用的辅助函数
const getChannelsCollectionRef = (userId: string) =>
  collection(db, `users/${userId}/channels`);
const getMessagesCollectionRef = (userId: string) =>
  collection(db, `users/${userId}/messages`);

export const firebaseChatService = {
  // Data migration method for existing channels
  migrateExistingChannels: async (userId: string): Promise<void> => {
    try {
      const channelsSnapshot = await getDocs(getChannelsCollectionRef(userId));
      
      for (const channelDoc of channelsSnapshot.docs) {
        const channelData = channelDoc.data();
        
        // 如果频道没有lastMessageTime字段，需要迁移
        if (!channelData.lastMessageTime) {
          const channelRef = doc(getChannelsCollectionRef(userId), channelDoc.id);
          
          // 获取该频道的最新消息时间
          const messagesQuery = query(
            getMessagesCollectionRef(userId),
            where("channelId", "==", channelDoc.id),
            orderBy("timestamp", "desc"),
            limit(1)
          );
          
          const messagesSnapshot = await getDocs(messagesQuery);
          
          if (!messagesSnapshot.empty) {
            // 有消息，使用最新消息时间
            const latestMessage = messagesSnapshot.docs[0];
            const latestTimestamp = latestMessage.data().timestamp;
            
            await updateDoc(channelRef, {
              lastMessageTime: latestTimestamp,
              messageCount: messagesSnapshot.size
            });
          } else {
            // 没有消息，使用创建时间
            await updateDoc(channelRef, {
              lastMessageTime: channelData.createdAt || serverTimestamp(),
              messageCount: 0
            });
          }
        }
      }
      
      console.log('Channel migration completed successfully');
    } catch (error) {
      console.error('Error migrating channels:', error);
    }
  },

  // Channel Services
  subscribeToChannels: (
    userId: string,
    onUpdate: (channels: Channel[]) => void
  ): (() => void) => {
    const q = query(
      getChannelsCollectionRef(userId),
      orderBy("lastMessageTime", "desc") // 按最后消息时间降序排序
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const channels = snapshot.docs.map(docToChannel);
        onUpdate(channels);
      },
      (error) => {
        console.error("Error subscribing to channels:", error);
      }
    );

    return unsubscribe;
  },

  // Message Services - Subscribe to all messages for a user
  subscribeToMessages: (
    userId: string,
    onUpdate: (messages: Message[]) => void
  ): (() => void) => {
    const q = query(
      getMessagesCollectionRef(userId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map(docToMessage);
        onUpdate(messages);
      },
      (error) => {
        console.error("Error subscribing to messages:", error);
      }
    );

    return unsubscribe;
  },

  // 获取频道列表（一次性加载）
  fetchChannels: async (userId: string): Promise<Channel[]> => {
    const q = query(
      getChannelsCollectionRef(userId),
      orderBy("lastMessageTime", "desc") // 按最后消息时间降序排序
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToChannel);
  },

  createChannel: async (
    userId: string,
    channelData: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string> => {
    const docRef = await addDoc(getChannelsCollectionRef(userId), {
      ...channelData,
      createdAt: serverTimestamp(),
      messageCount: 0,
      lastMessageTime: serverTimestamp(), // 初始化最后消息时间为创建时间
    });
    return docRef.id;
  },

  // Message Services
  // 获取所有消息（一次性加载）
  fetchAllMessages: async (userId: string): Promise<Message[]> => {
    const q = query(
      getMessagesCollectionRef(userId),
      orderBy("timestamp", "asc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToMessage);
  },

  fetchInitialMessages: async (
    userId: string,
    channelId: string,
    messagesLimit: number
  ) => {
    const q = query(
      getMessagesCollectionRef(userId),
      where("channelId", "==", channelId),
      orderBy("timestamp", "asc"),
      limit(messagesLimit)
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(docToMessage);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const allLoaded = messages.length < messagesLimit;

    return { messages, lastVisible, allLoaded };
  },

  fetchMoreMessages: async (
    userId: string,
    channelId: string,
    messagesLimit: number,
    cursor: DocumentSnapshot
  ) => {
    const q = query(
      getMessagesCollectionRef(userId),
      where("channelId", "==", channelId),
      orderBy("timestamp", "asc"),
      startAfter(cursor),
      limit(messagesLimit)
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(docToMessage);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const allLoaded = messages.length < messagesLimit;

    return { messages, lastVisible, allLoaded };
  },

  createMessage: async (
    userId: string,
    messageData: Omit<Message, "id" | "timestamp">
  ): Promise<string> => {
    const docRef = await addDoc(getMessagesCollectionRef(userId), {
      ...messageData,
      timestamp: serverTimestamp(),
    });
    
    // 更新频道的最后消息时间和消息数量
    const channelRef = doc(getChannelsCollectionRef(userId), messageData.channelId);
    await updateDoc(channelRef, {
      lastMessageTime: serverTimestamp(),
      messageCount: increment(1),
    });
    
    return docRef.id;
  },

  updateMessage: async (
    userId: string,
    messageId: string,
    updates: Partial<Message>
  ): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, updates);
  },

  deleteMessage: async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await deleteDoc(messageRef);
  },

  // 软删除消息
  softDeleteMessage: async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });
  },

  // 恢复消息
  restoreMessage: async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    });
  },
};
