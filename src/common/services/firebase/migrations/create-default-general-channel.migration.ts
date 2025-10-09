import {
  addDoc,
  collection,
  getDocs,
  limit,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firebaseConfig } from "@/common/config/firebase.config";
import { MigrationExecutor } from "./types";

/**
 * Migration 1.2.0: Create default "General" channel for new users
 *
 * Behavior:
 * - If a user has no non-deleted channels on first initialization, create a default channel named "General".
 * - Runs once per user via the migrations state mechanism.
 */
export class CreateDefaultGeneralChannelMigration implements MigrationExecutor {
  version = "1.2.0";
  name = "Create default General channel";
  description = "Create a default channel named 'General' if the user has no channels";
  createdAt = new Date("2025-02-01");

  async execute(userId: string): Promise<void> {
    const db = firebaseConfig.getDb();
    const channelsRef = collection(db, `users/${userId}/channels`);

    // Check if there is already at least one non-deleted channel
    const existingSnap = await getDocs(
      query(channelsRef, where("isDeleted", "==", false), limit(1))
    );

    if (!existingSnap.empty) {
      // Nothing to do
      return;
    }

    // Create the default General channel
    await addDoc(channelsRef, {
      name: "General",
      description: "",
      // emoji intentionally omitted; UI handles optional field
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      messageCount: 0,
      isDeleted: false,
      lastMessageTime: serverTimestamp(),
    });
  }
}
