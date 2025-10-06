import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "@/common/config/firebase.config";
import { MigrationExecutor } from "./types";

/**
 * Migration 1.0.0: Add isDeleted field to messages
 * Ensure all messages have the isDeleted field to support soft delete functionality
 */
export class AddIsDeletedToMessagesMigration implements MigrationExecutor {
  version = "1.0.0";
  name = "Add isDeleted field to messages";
  description = "Add isDeleted field to all messages to support soft delete functionality";
  createdAt = new Date("2025-01-27");

  async execute(userId: string): Promise<void> {
    const db = firebaseConfig.getDb();
    const messagesCollectionRef = collection(db, `users/${userId}/messages`);
    const messagesSnapshot = await getDocs(messagesCollectionRef);
    let migratedCount = 0;
    
    for (const messageDoc of messagesSnapshot.docs) {
      const messageData = messageDoc.data();
      
      // If the message does not have the isDeleted field, add isDeleted: false
      if (messageData.isDeleted === undefined) {
        const messageRef = doc(messagesCollectionRef, messageDoc.id);
        await updateDoc(messageRef, {
          isDeleted: false,
        });
        migratedCount++;
      }
    }
    
    // Only log if there were actual changes
    if (migratedCount > 0) {
      console.log(`   📊 Updated ${migratedCount} messages with isDeleted field`);
    } else {
      console.log(`   ℹ️  No messages needed updating`);
    }
  }
}
