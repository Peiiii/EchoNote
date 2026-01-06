type StoredAudio = {
  blob: Blob;
  mimeType: string;
  createdAt: number;
};

const DB_NAME = "echonote-audio";
const STORE_NAME = "studio-audio";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await openDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const req = fn(store);
      req.onsuccess = () => resolve(req.result as T);
      req.onerror = () => reject(req.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export const studioAudioCache = {
  put: async (key: string, blob: Blob, mimeType: string) => {
    const value: StoredAudio = { blob, mimeType, createdAt: Date.now() };
    await withStore("readwrite", store => store.put(value, key));
  },
  get: async (key: string): Promise<StoredAudio | undefined> => {
    const value = await withStore<StoredAudio | undefined>("readonly", store => store.get(key));
    return value;
  },
  delete: async (key: string) => {
    await withStore("readwrite", store => store.delete(key));
  },
};

