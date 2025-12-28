import type { NotesRepository } from "@/core/storage/repositories/notes.repository";
import type { AuthRepository } from "@/core/storage/repositories/auth.repository";
import { FirebaseStorageProvider } from "@/core/storage/adapters/firebase/firebase-storage.provider";

export type StorageBackend = "firebase";

export interface StorageProvider {
  readonly backend: StorageBackend;
  readonly notes: NotesRepository;
  readonly auth: AuthRepository;

  /**
   * Backend-specific initialization for a signed-in user (e.g., migrations).
   * No-op for providers that don't need it.
   */
  initializeForUser(userId: string): Promise<void>;
}

export const createStorageProvider = (backend: StorageBackend): StorageProvider => {
  switch (backend) {
    case "firebase":
      return new FirebaseStorageProvider();
  }
};

let singleton: StorageProvider | null = null;

export const getStorageProvider = (): StorageProvider => {
  if (singleton) return singleton;
  const backend = (import.meta.env.VITE_STORAGE_BACKEND as StorageBackend | undefined) ?? "firebase";
  singleton = createStorageProvider(backend);
  return singleton;
};

