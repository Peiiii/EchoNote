import { collection, doc, getDocs, updateDoc, serverTimestamp, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/common/config/firebase.config";
import { MigrationExecutor } from "./types";

/**
 * Migration 1.0.1: Add lastMessageTime to channels
 * Ensure all channels have the lastMessageTime field for sorting and statistics
 */
export class AddLastMessageTimeToChannelsMigration implements MigrationExecutor {
  version = "1.0.1";
  name = "Add lastMessageTime to channels";
  description = "Add lastMessageTime and messageCount fields to all channels for sorting and statistics";
  createdAt = new Date("2025-01-27");

  async execute(userId: string): Promise<void> {
    const channelsCollectionRef = collection(db, `users/${userId}/channels`);
    const channelsSnapshot = await getDocs(channelsCollectionRef);
    let migratedCount = 0;
    
    for (const channelDoc of channelsSnapshot.docs) {
      const channelData = channelDoc.data();
      
      // If the channel does not have the lastMessageTime field, add it
      if (!channelData.lastMessageTime) {
        const channelRef = doc(channelsCollectionRef, channelDoc.id);
        
        // Get the latest message time for this channel
        const messagesQuery = query(
          collection(db, `users/${userId}/messages`),
          where("channelId", "==", channelDoc.id),
          orderBy("timestamp", "desc"),
          limit(1)
        );
        
        const messagesSnapshot = await getDocs(messagesQuery);
        
        if (!messagesSnapshot.empty) {
          // If there are messages, use the latest message time
          const latestMessage = messagesSnapshot.docs[0];
          const latestTimestamp = latestMessage.data().timestamp;
          
          await updateDoc(channelRef, {
            lastMessageTime: latestTimestamp,
            messageCount: messagesSnapshot.size
          });
        } else {
          // If there are no messages, use the creation time
          await updateDoc(channelRef, {
            lastMessageTime: channelData.createdAt || serverTimestamp(),
            messageCount: 0
          });
        }
        migratedCount++;
      }
    }
    
    // Only log if there were actual changes
    if (migratedCount > 0) {
      console.log(`   📊 Updated ${migratedCount} channels with lastMessageTime field`);
    } else {
      console.log(`   ℹ️  No channels needed updating`);
    }
  }
}
