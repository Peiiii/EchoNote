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
import { Message, Channel } from "@/core/stores/chat-data.store";

/**
 * Firebase Chat Service - Handle Firebase operations related to chat
 * 
 * Important notes about the isDeleted field:
 * 
 * 1. Data model standardization:
 *    - All new messages will automatically include isDeleted: false
 *    - Use where("isDeleted", "==", false) to query non-deleted messages
 *    - This allows efficient use of Firestore indexes, optimal performance
 * 
 * 2. Data migration:
 *    - Use migrateMessagesForIsDeleted() to add isDeleted field to existing messages
 *    - It is recommended to execute this once when the application starts
 * 
 * 3. Query optimization:
 *    - Avoid using where("isDeleted", "!=", true), because it will exclude documents without the field
 *    - Use where("isDeleted", "==", false) to ensure only non-deleted messages are returned
 * 
 * 4. Soft delete process:
 *    - Call softDeleteMessage() to set isDeleted: true
 *    - Call restoreMessage() to restore messages
 *    - Call permanentDeleteMessage() to permanently delete messages
 */
// Type conversion helper functions
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
    // Deletion related fields
    isDeleted: data.isDeleted || false,
    deletedAt: data.deletedAt ? (data.deletedAt as Timestamp).toDate() : undefined,
    deletedBy: data.deletedBy,
    canRestore: data.canRestore,
  };
};

// Helper functions to get collection references
const getChannelsCollectionRef = (userId: string) =>
  collection(db, `users/${userId}/channels`);
const getMessagesCollectionRef = (userId: string) =>
  collection(db, `users/${userId}/messages`);

export const firebaseChatService = {
  // Channel Services
  subscribeToChannels: (
    userId: string,
    onUpdate: (channels: Channel[]) => void
  ): (() => void) => {
    console.log("🔔 [firebaseChatService][subscribeToChannels]:", { userId });
    const q = query(
      getChannelsCollectionRef(userId),
      orderBy("lastMessageTime", "desc") // Sort by last message time in descending order
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

  // Message Services - Subscribe to messages for a specific channel only
  subscribeToChannelMessages: (
    userId: string,
    channelId: string,
    messagesLimit: number,
    onUpdate: (messages: Message[], hasMore: boolean) => void
  ): (() => void) => {
    console.log("🔔 [firebaseChatService][subscribeToChannelMessages]:", { userId, channelId, messagesLimit });

    // Use == operator to query messages with isDeleted: false (recommended solution)
    const q = query(
      getMessagesCollectionRef(userId),
      where("isDeleted", "==", false), // Query non-deleted messages
      where("channelId", "==", channelId),
      where("sender", "==", "user"),
      orderBy("timestamp", "desc"),
      limit(messagesLimit)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messages = snapshot.docs.map(docToMessage);
        const hasMore = messages.length >= messagesLimit;
        onUpdate(messages, hasMore);
      },
      (error) => {
        console.error("Error subscribing to channel messages:", error);
      }
    );

    return unsubscribe;
  },

  fetchChannels: async (userId: string): Promise<Channel[]> => {
    console.log("🔔 [firebaseChatService][fetchChannels]:", { userId });
    const q = query(
      getChannelsCollectionRef(userId),
      orderBy("lastMessageTime", "desc") // Sort by last message time in descending order
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
      lastMessageTime: serverTimestamp(), // Initialize last message time
    });
    return docRef.id;
  },

  updateChannel: async (
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void> => {
    const channelRef = doc(getChannelsCollectionRef(userId), channelId);
    await updateDoc(channelRef, updates);
  },

  fetchInitialMessages: async (
    userId: string,
    channelId: string,
    messagesLimit: number
  ) => {
    console.log("🔔 [firebaseChatService][fetchInitialMessages]:", { userId, channelId, messagesLimit });
    // Use == operator to query messages with isDeleted: false (recommended solution)
    const q = query(
      getMessagesCollectionRef(userId),
      where("isDeleted", "==", false), // Query non-deleted messages
      where("channelId", "==", channelId),
      where("sender", "==", "user"),
      orderBy("timestamp", "desc"),
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
    console.log("🔔 [firebaseChatService][fetchMoreMessages]:", { userId, channelId, messagesLimit, cursor });

    // Use == operator to query messages with isDeleted: false (recommended solution)
    const q = query(
      getMessagesCollectionRef(userId),
      where("isDeleted", "==", false), // Query non-deleted messages
      where("channelId", "==", channelId),
      where("sender", "==", "user"),
      orderBy("timestamp", "desc"),
      startAfter(cursor),
      limit(messagesLimit)
    );

    const snapshot = await getDocs(q);
    const messages = snapshot.docs.map(docToMessage);
    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    const allLoaded = messages.length < messagesLimit;

    return { messages, lastVisible, allLoaded };
  },

  // Subscribe to new messages after a specific timestamp
  subscribeToNewMessages: (
    userId: string,
    channelId: string,
    afterTimestamp: Date,
    onUpdate: (newMessages: Message[]) => void
  ): (() => void) => {
    console.log("🔔 [firebaseChatService][subscribeToNewMessages]:", { userId, channelId, afterTimestamp });
    const q = query(
      getMessagesCollectionRef(userId),
      where("isDeleted", "==", false),
      where("channelId", "==", channelId),
      where("sender", "==", "user"),
      where("timestamp", ">", afterTimestamp),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newMessages = snapshot.docs.map(docToMessage);
        onUpdate(newMessages);
      },
      (error) => {
        console.error("Error subscribing to new messages:", error);
      }
    );

    return unsubscribe;
  },

  createMessage: async (
    userId: string,
    messageData: Omit<Message, "id" | "timestamp">
  ): Promise<string> => {
    const docRef = await addDoc(getMessagesCollectionRef(userId), {
      ...messageData,
      timestamp: serverTimestamp(),
      isDeleted: false, // Ensure new messages have isDeleted field
    });

    // Update channel's last message time and message count
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

  deleteMessage: async (
    userId: string,
    messageId: string
  ): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await deleteDoc(messageRef);
  },

  // Soft delete message
  softDeleteMessage: async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });
  },

  // Restore message
  restoreMessage: async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(db, `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    });
  },

  // Get deleted messages (for management interface)
  getDeletedMessages: async (userId: string, channelId?: string): Promise<Message[]> => {
    console.log("🔔 [firebaseChatService][getDeletedMessages]:", { userId, channelId });
    try {
      let q = query(
        getMessagesCollectionRef(userId),
        where("isDeleted", "==", true),
        orderBy("deletedAt", "desc")
      );

      if (channelId) {
        q = query(
          getMessagesCollectionRef(userId),
          where("isDeleted", "==", true),
          where("channelId", "==", channelId),
          where("sender", "==", "user"),
          orderBy("deletedAt", "desc")
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(docToMessage);
    } catch (error) {
      console.error("🔔 [Firebase] [getDeletedMessages]: Error fetching deleted messages:", error);
      return [];
    }
  },
};
