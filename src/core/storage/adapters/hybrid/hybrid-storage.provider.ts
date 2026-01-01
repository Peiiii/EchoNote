import type { StorageProvider } from "@/core/storage/provider";
import { HybridNotesAdapter } from "@/core/storage/adapters/hybrid/hybrid-notes.adapter";
import { FirebaseAuthAdapter } from "@/core/storage/adapters/firebase/firebase-auth.adapter";
import { firebaseMigrateService } from "@/common/services/firebase/firebase-migrate.service";
import { isGuestUserId } from "@/core/services/guest-id";

export class HybridStorageProvider implements StorageProvider {
  readonly backend = "hybrid" as const;
  readonly notes = new HybridNotesAdapter();
  readonly auth = new FirebaseAuthAdapter();

  async initializeForUser(userId: string): Promise<void> {
    if (isGuestUserId(userId)) return;
    await firebaseMigrateService.runAllMigrations(userId);
  }
}

