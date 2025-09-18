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
  setDoc,
  getDoc,
  increment,
  DocumentSnapshot,
  onSnapshot,
  limitToLast,
  startAfter,
  endBefore,
} from "firebase/firestore";
import { db } from "@/common/config/firebase.config";
import { AIConversation, UIMessage, MessageListOptions } from "@/common/types/ai-conversation";

export class FirebaseAIConversationService {
  private db = db;
  
  // 对话管理
  async createConversation(userId: string, channelId: string, title: string): Promise<AIConversation> {
    const conversationId = crypto.randomUUID();
    const conversation: AIConversation = {
      id: conversationId,
      title,
      channelId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      isArchived: false,
    };
    
    await setDoc(doc(this.db, `users/${userId}/aiConversations/${conversationId}`), {
      ...conversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    });
    
    return conversation;
  }
  
  async getConversations(userId: string, channelId?: string): Promise<AIConversation[]> {
    const q = this.buildConversationsQuery(userId, channelId);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.docToAIConversation(doc));
  }
  
  async getConversation(userId: string, conversationId: string): Promise<AIConversation | null> {
    const docRef = doc(this.db, `users/${userId}/aiConversations/${conversationId}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.docToAIConversation(docSnap);
  }
  
  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    // 删除对话下的所有消息
    const messagesRef = collection(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages`);
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // 删除对话
    await deleteDoc(doc(this.db, `users/${userId}/aiConversations/${conversationId}`));
  }
  
  async updateConversation(userId: string, conversationId: string, updates: Partial<AIConversation>): Promise<void> {
    await updateDoc(
      doc(this.db, `users/${userId}/aiConversations/${conversationId}`),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      }
    );
  }
  
  // 消息管理
  async addMessage(userId: string, conversationId: string, message: UIMessage): Promise<void> {
    const messageRef = doc(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages/${message.id}`);
    const messageDoc = await getDoc(messageRef);
    const isNewMessage = !messageDoc.exists();
    
    if (isNewMessage) {
      // 新消息：使用 setDoc 创建
      await setDoc(
        messageRef,
        {
          ...message,
          conversationId,
          timestamp: serverTimestamp(),
        }
      );
    } else {
      // 更新消息：使用 updateDoc 更新
      await updateDoc(
        messageRef,
        {
          ...message,
          conversationId,
          timestamp: serverTimestamp(),
        }
      );
    }
    
    // 更新对话的 lastMessageAt 和 messageCount（只有新消息才增加计数）
    const updateData: {
      lastMessageAt: ReturnType<typeof serverTimestamp>;
      updatedAt: ReturnType<typeof serverTimestamp>;
      messageCount?: ReturnType<typeof increment>;
    } = {
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    if (isNewMessage) {
      updateData.messageCount = increment(1);
    }
    
    await updateDoc(
      doc(this.db, `users/${userId}/aiConversations/${conversationId}`),
      updateData
    );
  }
  
  async getMessages(userId: string, conversationId: string): Promise<UIMessage[]> {
    const q = query(
      collection(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages`),
      orderBy('timestamp', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.docToUIMessage(doc));
  }
  
  async listMessages(
    userId: string, 
    conversationId: string, 
    options: MessageListOptions = {}
  ): Promise<UIMessage[]> {
    const { limit = 50, orderBy: order = 'asc', startAfter: startAfterId, endBefore: endBeforeId } = options;
    
    let q = query(
      collection(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages`),
      orderBy('timestamp', order)
    );
    
    if (limit) {
      q = query(q, limitToLast(limit));
    }
    
    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages/${startAfterId}`));
      q = query(q, startAfter(startAfterDoc));
    }
    
    if (endBeforeId) {
      const endBeforeDoc = await getDoc(doc(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages/${endBeforeId}`));
      q = query(q, endBefore(endBeforeDoc));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.docToUIMessage(doc));
  }
  
  async updateMessage(userId: string, conversationId: string, messageId: string, updates: Partial<UIMessage>): Promise<void> {
    await updateDoc(
      doc(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages/${messageId}`),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      }
    );
  }
  
  async deleteMessage(userId: string, conversationId: string, messageId: string): Promise<void> {
    await deleteDoc(
      doc(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages/${messageId}`)
    );
    
    // 更新对话的 messageCount
    await updateDoc(
      doc(this.db, `users/${userId}/aiConversations/${conversationId}`),
      {
        messageCount: increment(-1),
        updatedAt: serverTimestamp(),
      }
    );
  }
  
  // 实时监听
  subscribeToMessages(
    userId: string, 
    conversationId: string, 
    callback: (messages: UIMessage[]) => void
  ): () => void {
    const q = query(
      collection(this.db, `users/${userId}/aiConversations/${conversationId}/uiMessages`),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => this.docToUIMessage(doc));
      callback(messages);
    });
  }
  
  subscribeToConversations(
    userId: string, 
    callback: (conversations: AIConversation[]) => void,
    channelId?: string
  ): () => void {
    const q = this.buildConversationsQuery(userId, channelId);
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => this.docToAIConversation(doc));
      callback(conversations);
    });
  }
  
  // 辅助方法
  private buildConversationsQuery(userId: string, channelId?: string) {
    let q = query(
      collection(this.db, `users/${userId}/aiConversations`),
      orderBy('lastMessageAt', 'desc')
    );
    
    if (channelId) {
      q = query(q, where('channelId', '==', channelId));
    }
    
    return q;
  }

  private docToAIConversation(doc: DocumentSnapshot): AIConversation {
    const data = doc.data()!;
    return {
      id: doc.id,
      title: data.title,
      channelId: data.channelId,
      userId: data.userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
      messageCount: data.messageCount || 0,
      isArchived: data.isArchived || false,
    };
  }
  
  private docToUIMessage(doc: DocumentSnapshot): UIMessage {
    const data = doc.data()!;
    return {
      id: doc.id,
      role: data.role,
      parts: data.parts,
    };
  }
}

export const firebaseAIConversationService = new FirebaseAIConversationService();
