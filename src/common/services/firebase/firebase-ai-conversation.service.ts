import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  setDoc,
  getDoc,
  increment,
  DocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/common/config/firebase.config";
import { AIConversation, AIConversationMessage, AIConversationFilters } from "@/common/types/ai-conversation";

/**
 * Firebase AI Conversation Service - Handle Firebase operations for AI conversations
 * 
 * This service manages:
 * - AI Conversations: User-created AI chat sessions
 * - AI Conversation Messages: Individual messages within AI conversations
 * 
 * Features:
 * - Full CRUD operations for conversations and messages
 * - Message count and timestamp tracking
 * - Conversation filtering and archiving
 * - Optimized queries with proper indexing
 */

// Helper functions to get collection references
const getAIConversationsCollectionRef = (userId: string) =>
  collection(db, `users/${userId}/aiConversations`);

const getAIConversationMessagesCollectionRef = (userId: string, conversationId: string) =>
  collection(db, `users/${userId}/aiConversations/${conversationId}/messages`);

// Type conversion helper functions
const docToAIConversation = (doc: DocumentSnapshot): AIConversation => {
  const data = doc.data()!;
  return {
    id: doc.id,
    title: data.title,
    description: data.description || "",
    channelId: data.channelId,
    userId: data.userId,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    lastMessageAt: (data.lastMessageAt as Timestamp)?.toDate() || new Date(),
    messageCount: data.messageCount || 0,
    isArchived: data.isArchived || false,
    tags: data.tags || [],
    metadata: data.metadata || {}
  };
};

const docToAIConversationMessage = (doc: DocumentSnapshot): AIConversationMessage => {
  const data = doc.data()!;
  return {
    id: doc.id,
    conversationId: data.conversationId,
    content: data.content,
    role: data.role,
    timestamp: (data.timestamp as Timestamp)?.toDate() || new Date(),
    metadata: data.metadata || {}
  };
};

export class FirebaseAIConversationService {
  // Conversation CRUD Operations
  createAIConversation = async (
    userId: string,
    conversation: AIConversation
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][createAIConversation]:", { userId, conversationId: conversation.id });
    
    const conversationRef = doc(getAIConversationsCollectionRef(userId), conversation.id);
    await setDoc(conversationRef, {
      id: conversation.id,
      title: conversation.title,
      description: conversation.description || "",
      channelId: conversation.channelId,
      userId: conversation.userId,
      messageCount: conversation.messageCount,
      isArchived: conversation.isArchived,
      tags: conversation.tags || [],
      metadata: conversation.metadata || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    });
  };

  getAIConversations = async (
    userId: string,
    filters?: AIConversationFilters
  ): Promise<AIConversation[]> => {
    console.log("🔔 [firebaseAIConversationService][getAIConversations]:", { userId, filters });
    
    let q = query(
      getAIConversationsCollectionRef(userId),
      orderBy("lastMessageAt", "desc")
    );

    if (filters) {
      if (filters.channelId) {
        q = query(q, where("channelId", "==", filters.channelId));
      }
      if (filters.isArchived !== undefined) {
        q = query(q, where("isArchived", "==", filters.isArchived));
      }
      if (filters.tags && filters.tags.length > 0) {
        q = query(q, where("tags", "array-contains-any", filters.tags));
      }
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToAIConversation);
  };

  getAIConversation = async (
    userId: string,
    conversationId: string
  ): Promise<AIConversation | null> => {
    console.log("🔔 [firebaseAIConversationService][getAIConversation]:", { userId, conversationId });
    
    const conversationRef = doc(getAIConversationsCollectionRef(userId), conversationId);
    const snapshot = await getDoc(conversationRef);
    
    if (!snapshot.exists()) {
      return null;
    }

    return docToAIConversation(snapshot);
  };

  updateAIConversation = async (
    userId: string,
    conversationId: string,
    updates: Partial<Omit<AIConversation, 'id' | 'userId' | 'createdAt'>>
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][updateAIConversation]:", { userId, conversationId, updates });
    
    const conversationRef = doc(getAIConversationsCollectionRef(userId), conversationId);
    await updateDoc(conversationRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  deleteAIConversation = async (
    userId: string,
    conversationId: string
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][deleteAIConversation]:", { userId, conversationId });
    
    const conversationRef = doc(getAIConversationsCollectionRef(userId), conversationId);
    await deleteDoc(conversationRef);
  };

  // Message CRUD Operations
  createAIConversationMessage = async (
    userId: string,
    message: AIConversationMessage
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][createAIConversationMessage]:", { 
      userId, 
      conversationId: message.conversationId, 
      messageId: message.id 
    });
    
    const messageRef = doc(getAIConversationMessagesCollectionRef(userId, message.conversationId), message.id);
    await setDoc(messageRef, {
      id: message.id,
      conversationId: message.conversationId,
      content: message.content,
      role: message.role,
      metadata: message.metadata || {},
      timestamp: serverTimestamp(),
    });

    // Update conversation metadata
    const conversationRef = doc(getAIConversationsCollectionRef(userId), message.conversationId);
    await updateDoc(conversationRef, {
      lastMessageAt: serverTimestamp(),
      messageCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  };

  getAIConversationMessages = async (
    userId: string,
    conversationId: string
  ): Promise<AIConversationMessage[]> => {
    console.log("🔔 [firebaseAIConversationService][getAIConversationMessages]:", { userId, conversationId });
    
    const q = query(
      getAIConversationMessagesCollectionRef(userId, conversationId),
      orderBy("timestamp", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(docToAIConversationMessage);
  };

  updateAIConversationMessage = async (
    userId: string,
    messageId: string,
    updates: Partial<Omit<AIConversationMessage, 'id' | 'conversationId' | 'timestamp'>>
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][updateAIConversationMessage]:", { userId, messageId, updates });
    
    const conversationId = await this.findConversationIdByMessageId(userId, messageId);
    if (!conversationId) {
      throw new Error('Conversation not found for message');
    }

    const messageRef = doc(getAIConversationMessagesCollectionRef(userId, conversationId), messageId);
    await updateDoc(messageRef, updates);
  };

  deleteAIConversationMessage = async (
    userId: string,
    messageId: string
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][deleteAIConversationMessage]:", { userId, messageId });
    
    const conversationId = await this.findConversationIdByMessageId(userId, messageId);
    if (!conversationId) {
      throw new Error('Conversation not found for message');
    }

    const messageRef = doc(getAIConversationMessagesCollectionRef(userId, conversationId), messageId);
    await deleteDoc(messageRef);

    // Update conversation message count
    const conversationRef = doc(getAIConversationsCollectionRef(userId), conversationId);
    await updateDoc(conversationRef, {
      messageCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
  };

  // Utility Methods
  findConversationIdByMessageId = async (
    userId: string,
    messageId: string
  ): Promise<string | null> => {
    console.log("🔔 [firebaseAIConversationService][findConversationIdByMessageId]:", { userId, messageId });
    
    const conversationsSnapshot = await getDocs(getAIConversationsCollectionRef(userId));
    
    for (const conversationDoc of conversationsSnapshot.docs) {
      const messagesSnapshot = await getDocs(
        getAIConversationMessagesCollectionRef(userId, conversationDoc.id)
      );
      
      if (messagesSnapshot.docs.some(doc => doc.id === messageId)) {
        return conversationDoc.id;
      }
    }
    
    return null;
  };

  // Batch Operations
  archiveConversation = async (
    userId: string,
    conversationId: string,
    isArchived: boolean = true
  ): Promise<void> => {
    console.log("🔔 [firebaseAIConversationService][archiveConversation]:", { userId, conversationId, isArchived });
    
    await this.updateAIConversation(userId, conversationId, { isArchived });
  };

  // Search and Filter Operations
  searchConversations = async (
    userId: string,
    searchTerm: string,
    filters?: AIConversationFilters
  ): Promise<AIConversation[]> => {
    console.log("🔔 [firebaseAIConversationService][searchConversations]:", { userId, searchTerm, filters });
    
    // Note: This is a basic implementation. For production, consider using
    // Algolia or similar search service for better search capabilities
    const conversations = await this.getAIConversations(userId, filters);
    
    return conversations.filter(conversation =>
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversation.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Statistics and Analytics
  getConversationStats = async (userId: string): Promise<{
    totalConversations: number;
    activeConversations: number;
    archivedConversations: number;
    totalMessages: number;
  }> => {
    console.log("🔔 [firebaseAIConversationService][getConversationStats]:", { userId });
    
    const [allConversations, activeConversations, archivedConversations] = await Promise.all([
      this.getAIConversations(userId),
      this.getAIConversations(userId, { isArchived: false }),
      this.getAIConversations(userId, { isArchived: true })
    ]);

    const totalMessages = allConversations.reduce((sum, conv) => sum + conv.messageCount, 0);

    return {
      totalConversations: allConversations.length,
      activeConversations: activeConversations.length,
      archivedConversations: archivedConversations.length,
      totalMessages
    };
  };
}

export const firebaseAIConversationService = new FirebaseAIConversationService();
