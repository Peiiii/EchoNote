import type { StorageProvider } from "@/core/storage/provider";
import { FirebaseNotesAdapter } from "@/core/storage/adapters/firebase/firebase-notes.adapter";
import { FirebaseAuthAdapter } from "@/core/storage/adapters/firebase/firebase-auth.adapter";
import { firebaseMigrateService } from "@/common/services/firebase/firebase-migrate.service";

export class FirebaseStorageProvider implements StorageProvider {
  readonly backend = "firebase" as const;
  readonly notes = new FirebaseNotesAdapter();
  readonly auth = new FirebaseAuthAdapter();

  async initializeForUser(userId: string): Promise<void> {
    await firebaseMigrateService.runAllMigrations(userId);
  }
}

