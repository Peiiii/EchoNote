import {
  collection,
  doc,
  query,
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
  FieldValue,
} from "firebase/firestore";
import { firebaseConfig } from "@/common/config/firebase.config";
import { AIConversation, UIMessage, MessageListOptions, ConversationContextConfig } from "@/common/types/ai-conversation";
import { sanitizeUIMessageForPersistence } from "@/common/features/ai-assistant/utils/sanitize-ui-message";

export class FirebaseAIConversationService {
  private getDb() {
    return firebaseConfig.getDb();
  }
  
  // 对话管理
  async createConversation(
    userId: string,
    title: string,
    contexts?: ConversationContextConfig
  ): Promise<AIConversation> {
    const conversationId = crypto.randomUUID();
    const conversation: AIConversation = {
      id: conversationId,
      title,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessageAt: new Date(),
      messageCount: 0,
      isArchived: false,
      ...(contexts ? { contexts } : {}),
    };
    
    await setDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`), {
      ...conversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
    });
    
    return conversation;
  }
  
  async getConversations(userId: string): Promise<AIConversation[]> {
    const q = this.buildConversationsQuery(userId);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.docToAIConversation(doc));
  }
  
  async getConversation(userId: string, conversationId: string): Promise<AIConversation | null> {
    const docRef = doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return this.docToAIConversation(docSnap);
  }
  
  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    // 删除对话下的所有消息
    const messagesRef = collection(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages`);
    const messagesSnapshot = await getDocs(messagesRef);
    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // 删除对话
    await deleteDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`));
  }
  
  async updateConversation(userId: string, conversationId: string, updates: Partial<AIConversation>): Promise<void> {
    await updateDoc(
      doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      }
    );
  }
  
  async addMessage(userId: string, conversationId: string, message: UIMessage): Promise<void> {
    const messageRef = doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${message.id}`);
    const messageDoc = await getDoc(messageRef);
    const isNewMessage = !messageDoc.exists();
    
    if (isNewMessage) {
      console.log("[FirebaseAIConversationService] addMessage new message", message);
      const toSave = sanitizeUIMessageForPersistence(message);
      await setDoc(
        messageRef,
        {
          ...toSave,
          conversationId,
          timestamp: serverTimestamp(),
        }
      );
    } else {
      console.log("[FirebaseAIConversationService] addMessage existing message", message);
      const toSave = sanitizeUIMessageForPersistence(message);
      await updateDoc(
        messageRef,
        {
          ...toSave,
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
    
    await updateDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`), updateData);
  }

  async createMessage(userId: string, conversationId: string, message: UIMessage): Promise<void> {
    const messageRef = doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${message.id}`);
    const messageDoc = await getDoc(messageRef);
    if (messageDoc.exists()) {
      return;
    }
    const toSave = sanitizeUIMessageForPersistence(message);
    await setDoc(messageRef, {
      ...toSave,
      conversationId,
      timestamp: serverTimestamp(),
    });
    await updateDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`), {
      lastMessageAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: increment(1),
    });
  }
  
  async getMessages(userId: string, conversationId: string): Promise<UIMessage[]> {
    const q = query(
      collection(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages`),
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
      collection(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages`),
      orderBy('timestamp', order)
    );
    
    if (limit) {
      q = query(q, limitToLast(limit));
    }
    
    if (startAfterId) {
      const startAfterDoc = await getDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${startAfterId}`));
      q = query(q, startAfter(startAfterDoc));
    }
    
    if (endBeforeId) {
      const endBeforeDoc = await getDoc(doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${endBeforeId}`));
      q = query(q, endBefore(endBeforeDoc));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.docToUIMessage(doc));
  }
  
  async updateMessage(userId: string, conversationId: string, messageId: string, updates: Partial<UIMessage> | UIMessage): Promise<void> {
    const updateData: Record<string, unknown> = { updatedAt: serverTimestamp() };
    // Only persist fields we care about and sanitize nested parts
    const maybe = updates as Partial<UIMessage>;
    if (Object.prototype.hasOwnProperty.call(maybe, 'role')) {
      updateData.role = maybe.role;
    }
    if (Object.prototype.hasOwnProperty.call(maybe, 'parts')) {
      // reuse sanitizer internals via public API
      const sanitized = sanitizeUIMessageForPersistence({
        id: messageId,
        role: (maybe.role ?? 'assistant') as UIMessage['role'],
        parts: maybe.parts as unknown,
      } as UIMessage);
      updateData.parts = sanitized.parts;
    }

    await updateDoc(
      doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${messageId}`),
      updateData as { [x: string]: FieldValue | Partial<unknown> | undefined }
    );
  }
  
  async deleteMessage(userId: string, conversationId: string, messageId: string): Promise<void> {
    await deleteDoc(
      doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages/${messageId}`)
    );
    
    // 更新对话的 messageCount
    await updateDoc(
      doc(this.getDb(), `users/${userId}/aiConversations/${conversationId}`),
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
      collection(this.getDb(), `users/${userId}/aiConversations/${conversationId}/uiMessages`),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => this.docToUIMessage(doc));
      callback(messages);
    });
  }
  
  subscribeToConversations(
    userId: string, 
    callback: (conversations: AIConversation[]) => void
  ): () => void {
    const q = this.buildConversationsQuery(userId);
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => this.docToAIConversation(doc));
      callback(conversations);
    });
  }
  
  // 辅助方法
  private buildConversationsQuery(userId: string) {
    const q = query(
      collection(this.getDb(), `users/${userId}/aiConversations`),
      orderBy('lastMessageAt', 'desc')
    );
    return q;
  }

  private docToAIConversation(doc: DocumentSnapshot): AIConversation {
    const data = doc.data()!;
    const base: AIConversation = {
      id: doc.id,
      title: data.title,
      userId: data.userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastMessageAt: data.lastMessageAt?.toDate() || new Date(),
      messageCount: data.messageCount || 0,
      isArchived: data.isArchived || false,
    };
    // Backward compatibility: map legacy channelId to contexts
    let contexts: ConversationContextConfig | null | undefined;
    if (data.contexts) {
      contexts = data.contexts as ConversationContextConfig;
    } else if (data.channelId) {
      contexts = { mode: 'channels', channelIds: [data.channelId] } as ConversationContextConfig;
    }
    return contexts ? { ...base, contexts } : base;
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
