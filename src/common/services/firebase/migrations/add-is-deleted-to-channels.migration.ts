import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "@/common/config/firebase.config";
import { MigrationExecutor } from "./types";

/**
 * Migration 1.1.0: Add isDeleted field to channels
 * Ensure all channels have the isDeleted field to support soft delete functionality
 */
export class AddIsDeletedToChannelsMigration implements MigrationExecutor {
  version = "1.1.0";
  name = "Add isDeleted field to channels";
  description = "Add isDeleted field to all channels to support soft delete functionality";
  createdAt = new Date("2025-01-27");

  async execute(userId: string): Promise<void> {
    const db = firebaseConfig.getDb();
    const channelsCollectionRef = collection(db, `users/${userId}/channels`);
    const channelsSnapshot = await getDocs(channelsCollectionRef);
    let migratedCount = 0;
    
    for (const channelDoc of channelsSnapshot.docs) {
      const channelData = channelDoc.data();
      
      // If the channel does not have the isDeleted field, add isDeleted: false
      if (channelData.isDeleted === undefined) {
        const channelRef = doc(channelsCollectionRef, channelDoc.id);
        await updateDoc(channelRef, {
          isDeleted: false,
        });
        migratedCount++;
      }
    }
    
    // Only log if there were actual changes
    if (migratedCount > 0) {
      console.log(`   📊 Updated ${migratedCount} channels with isDeleted field`);
    } else {
      console.log(`   ℹ️  No channels needed updating`);
    }
  }
}
