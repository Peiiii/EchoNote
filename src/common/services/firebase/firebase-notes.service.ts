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
  deleteField,
  serverTimestamp,
  Timestamp,
  DocumentSnapshot,
  increment,
  FieldValue,
} from "firebase/firestore";
import { firebaseConfig } from "@/common/config/firebase.config";
import { Message, Channel } from "@/core/stores/notes-data.store";

/**
 * Firebase Notes Service - Handle Firebase operations related to user notes and thoughts
 *
 * This service manages:
 * - Thought Spaces (channels): User-created spaces for organizing thoughts
 * - Thought Records (messages): Individual notes and thoughts within spaces
 *
 * Important notes about the isDeleted field:
 *
 * 1. Data model standardization:
 *    - All new thought records will automatically include isDeleted: false
 *    - Use where("isDeleted", "==", false) to query non-deleted thought records
 *    - This allows efficient use of Firestore indexes, optimal performance
 *
 * 2. Data migration:
 *    - Use migrateMessagesForIsDeleted() to add isDeleted field to existing thought records
 *    - It is recommended to execute this once when the application starts
 *
 * 3. Query optimization:
 *    - Avoid using where("isDeleted", "!=", true), because it will exclude documents without the field
 *    - Use where("isDeleted", "==", false) to ensure only non-deleted thought records are returned
 *
 * 4. Soft delete process:
 *    - Call softDeleteMessage() to set isDeleted: true
 *    - Call restoreMessage() to restore thought records
 *    - Call permanentDeleteMessage() to permanently delete thought records
 */
// Type conversion helper functions
const docToChannel = (doc: DocumentSnapshot): Channel => {
  const data = doc.data()!;
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    emoji: data.emoji,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : undefined,
    messageCount: data.messageCount || 0,
    lastMessageTime: (data.lastMessageTime as Timestamp)?.toDate(),
    backgroundImage: data.backgroundImage,
    backgroundColor: data.backgroundColor,
  };
};

const docToMessage = (doc: DocumentSnapshot): Message => {
  const data = doc.data()!;

  // More robust timestamp conversion with logging
  let timestamp: Date;
  if (data.timestamp) {
    if (data.timestamp instanceof Timestamp) {
      timestamp = data.timestamp.toDate();
    } else if (data.timestamp.toDate && typeof data.timestamp.toDate === "function") {
      timestamp = data.timestamp.toDate();
    } else if (data.timestamp instanceof Date) {
      timestamp = data.timestamp;
    } else {
      console.warn("Invalid timestamp format in document:", doc.id, data.timestamp);
      timestamp = new Date();
    }
  } else {
    console.warn("Missing timestamp in document:", doc.id);
    timestamp = new Date();
  }

  return {
    id: doc.id,
    content: data.content,
    sender: data.sender,
    channelId: data.channelId,
    timestamp,
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
  collection(firebaseConfig.getDb(), `users/${userId}/channels`);
const getMessagesCollectionRef = (userId: string) =>
  collection(firebaseConfig.getDb(), `users/${userId}/messages`);

export class FirebaseNotesService {
  async getChannel(userId: string, channelId: string): Promise<Channel | null> {
    try {
      const channelsRef = await getChannelsCollectionRef(userId);
      const snap = await getDocs(
        query(channelsRef, where("isDeleted", "==", false), where("__name__", "==", channelId))
      );
      const docSnap = snap.docs[0];
      if (!docSnap) return null;
      return docToChannel(docSnap);
    } catch (e) {
      console.warn("[firebaseNotesService.getChannel] failed", e);
      return null;
    }
  }
  // Channel Services
  subscribeToChannels = (userId: string, onUpdate: (channels: Channel[]) => void): (() => void) => {
    console.log("🔔 [firebaseNotesService][subscribeToChannels]:", { userId });
    const q = query(
      getChannelsCollectionRef(userId),
      where("isDeleted", "==", false), // Only get non-deleted channels
      orderBy("lastMessageTime", "desc") // Sort by last message time in descending order
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const channels = snapshot.docs.map(docToChannel);
        onUpdate(channels);
      },
      error => {
        console.error("Error subscribing to channels:", error);
      }
    );

    return unsubscribe;
  };

  // Message Services - Subscribe to messages for a specific channel only
  subscribeToChannelMessages = (
    userId: string,
    channelId: string,
    messagesLimit: number,
    onUpdate: (messages: Message[], hasMore: boolean) => void
  ): (() => void) => {
    console.log("🔔 [firebaseNotesService][subscribeToChannelMessages]:", {
      userId,
      channelId,
      messagesLimit,
    });

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
      snapshot => {
        const messages = snapshot.docs.map(docToMessage);
        const hasMore = messages.length >= messagesLimit;
        onUpdate(messages, hasMore);
      },
      error => {
        console.error("Error subscribing to channel messages:", error);
      }
    );

    return unsubscribe;
  };

  fetchChannels = async (userId: string): Promise<Channel[]> => {
    console.log("🔔 [firebaseNotesService][fetchChannels]:", { userId });
    const q = query(
      getChannelsCollectionRef(userId),
      where("isDeleted", "==", false), // Only get non-deleted channels
      orderBy("lastMessageTime", "desc") // Sort by last message time in descending order
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToChannel);
  };

  createChannel = async (
    userId: string,
    channelData: Omit<Channel, "id" | "createdAt" | "messageCount">
  ): Promise<string> => {
    // Filter out undefined values to prevent Firebase errors
    const filteredChannelData = Object.fromEntries(
      Object.entries(channelData).filter(([, value]) => value !== undefined)
    );

    const docRef = await addDoc(getChannelsCollectionRef(userId), {
      ...filteredChannelData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0,
      isDeleted: false,
      lastMessageTime: serverTimestamp(), // Initialize last message time
    });
    return docRef.id;
  };

  updateChannel = async (
    userId: string,
    channelId: string,
    updates: Partial<Omit<Channel, "id" | "createdAt" | "messageCount">>
  ): Promise<void> => {
    const channelRef = doc(getChannelsCollectionRef(userId), channelId);

    // Process updates to handle undefined values properly
    const processedUpdates: Record<string, FieldValue | string | number | boolean | Date | null> =
      {};

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        // Use deleteField() for undefined values to remove the field
        processedUpdates[key] = deleteField();
      } else {
        processedUpdates[key] = value;
      }
    }
    // Always bump updatedAt
    processedUpdates.updatedAt = serverTimestamp();

    await updateDoc(channelRef, processedUpdates);
  };

  deleteChannel = async (userId: string, channelId: string): Promise<void> => {
    console.log("🔔 [firebaseNotesService][deleteChannel]:", { userId, channelId });

    // Soft delete the channel document
    const channelRef = doc(getChannelsCollectionRef(userId), channelId);
    await updateDoc(channelRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });

    // Soft delete all messages in this channel
    try {
      const messagesQuery = query(
        getMessagesCollectionRef(userId),
        where("channelId", "==", channelId),
        where("isDeleted", "==", false) // Only get non-deleted messages
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      // Soft delete messages in batches
      const batchSize = 500;
      for (let i = 0; i < messagesSnapshot.docs.length; i += batchSize) {
        const batch = messagesSnapshot.docs.slice(i, i + batchSize);
        const softDeletePromises = batch.map(doc =>
          updateDoc(doc.ref, {
            isDeleted: true,
            deletedAt: serverTimestamp(),
            deletedBy: userId,
            deletedChannelId: channelId, // Track which channel was deleted
          })
        );
        await Promise.all(softDeletePromises);
      }

      console.log(
        "🔔 [firebaseNotesService][deleteChannel]: Successfully soft deleted channel and messages",
        {
          channelId,
          messageCount: messagesSnapshot.docs.length,
        }
      );
    } catch (error) {
      console.error(
        "🔔 [firebaseNotesService][deleteChannel]: Error soft deleting messages:",
        error
      );
      // Even if message soft deletion fails, the channel is already soft deleted
      throw new Error(
        `Channel soft deleted but failed to soft delete associated messages: ${error}`
      );
    }
  };

  // Restore soft deleted channel
  restoreChannel = async (userId: string, channelId: string): Promise<void> => {
    console.log("🔔 [firebaseNotesService][restoreChannel]:", { userId, channelId });

    // Restore the channel document
    const channelRef = doc(getChannelsCollectionRef(userId), channelId);
    await updateDoc(channelRef, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    });

    // Restore all messages in this channel
    try {
      const messagesQuery = query(
        getMessagesCollectionRef(userId),
        where("channelId", "==", channelId),
        where("isDeleted", "==", true),
        where("deletedChannelId", "==", channelId) // Only restore messages deleted with this channel
      );
      const messagesSnapshot = await getDocs(messagesQuery);

      // Restore messages in batches
      const batchSize = 500;
      for (let i = 0; i < messagesSnapshot.docs.length; i += batchSize) {
        const batch = messagesSnapshot.docs.slice(i, i + batchSize);
        const restorePromises = batch.map(doc =>
          updateDoc(doc.ref, {
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            deletedChannelId: null,
          })
        );
        await Promise.all(restorePromises);
      }

      console.log(
        "🔔 [firebaseNotesService][restoreChannel]: Successfully restored channel and messages",
        {
          channelId,
          messageCount: messagesSnapshot.docs.length,
        }
      );
    } catch (error) {
      console.error("🔔 [firebaseNotesService][restoreChannel]: Error restoring messages:", error);
      // Even if message restoration fails, the channel is already restored
      throw new Error(`Channel restored but failed to restore associated messages: ${error}`);
    }
  };

  fetchInitialMessages = async (userId: string, channelId: string, messagesLimit: number) => {
    console.log("🔔 [firebaseNotesService][fetchInitialMessages]:", {
      userId,
      channelId,
      messagesLimit,
    });
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
  };

  // Fetch initial messages for a channel (any sender: includes user + ai)
  fetchInitialMessagesAllSenders = async (
    userId: string,
    channelId: string,
    messagesLimit: number
  ) => {
    const q = query(
      getMessagesCollectionRef(userId),
      where("isDeleted", "==", false),
      where("channelId", "==", channelId),
      orderBy("timestamp", "desc"),
      limit(messagesLimit)
    );

    try {
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map(docToMessage);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1];
      const allLoaded = messages.length < messagesLimit;
      return { messages, lastVisible, allLoaded };
    } catch (err) {
      console.error("❌ [firebaseNotesService][fetchInitialMessagesAllSenders] failed", err);
      throw err;
    }
  };

  fetchMoreMessages = async (
    userId: string,
    channelId: string,
    messagesLimit: number,
    cursor: DocumentSnapshot
  ) => {
    console.log("🔔 [firebaseNotesService][fetchMoreMessages]:", {
      userId,
      channelId,
      messagesLimit,
      cursor,
    });

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
  };

  // Subscribe to new messages after a specific timestamp
  subscribeToNewMessages = (
    userId: string,
    channelId: string,
    afterTimestamp: Date,
    onUpdate: (newMessages: Message[]) => void
  ): (() => void) => {
    console.log("🔔 [firebaseNotesService][subscribeToNewMessages]:", {
      userId,
      channelId,
      afterTimestamp,
    });
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
      snapshot => {
        const newMessages = snapshot.docs.map(docToMessage);
        onUpdate(newMessages);
      },
      error => {
        console.error("Error subscribing to new messages:", error);
      }
    );

    return unsubscribe;
  };

  createMessage = async (
    userId: string,
    messageData: Omit<Message, "id" | "timestamp">
  ): Promise<string> => {
    // Filter out undefined values to prevent Firebase errors
    const filteredMessageData = Object.fromEntries(
      Object.entries(messageData).filter(([, value]) => value !== undefined)
    );

    const docRef = await addDoc(getMessagesCollectionRef(userId), {
      ...filteredMessageData,
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
  };

  updateMessage = async (
    userId: string,
    messageId: string,
    updates: Partial<Message>
  ): Promise<void> => {
    const messageRef = doc(firebaseConfig.getDb(), `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, updates);
  };

  deleteMessage = async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(firebaseConfig.getDb(), `users/${userId}/messages/${messageId}`);
    await deleteDoc(messageRef);
  };

  // Soft delete message
  softDeleteMessage = async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(firebaseConfig.getDb(), `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      deletedBy: userId,
    });
  };

  // Restore message
  restoreMessage = async (userId: string, messageId: string): Promise<void> => {
    const messageRef = doc(firebaseConfig.getDb(), `users/${userId}/messages/${messageId}`);
    await updateDoc(messageRef, {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    });
  };

  // Get deleted messages (for management interface)
  getDeletedMessages = async (userId: string, channelId?: string): Promise<Message[]> => {
    console.log("🔔 [firebaseNotesService][getDeletedMessages]:", { userId, channelId });
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
  };
}

export const firebaseNotesService = new FirebaseNotesService();
