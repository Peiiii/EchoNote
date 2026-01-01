import type { StorageProvider } from "@/core/storage/provider";
import { LocalNotesAdapter } from "@/core/storage/adapters/local/local-notes.adapter";
import { LocalAuthAdapter } from "@/core/storage/adapters/local/local-auth.adapter";

export class LocalStorageProvider implements StorageProvider {
  readonly backend = "local" as const;
  readonly notes = new LocalNotesAdapter();
  readonly auth = new LocalAuthAdapter();

  async initializeForUser(_userId: string): Promise<void> {
    // Local storage does not require backend migrations.
  }
}

