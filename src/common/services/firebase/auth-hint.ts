const LAST_AUTH_UID_KEY = "echonote-last-auth-uid";
const LAST_AUTH_TS_KEY = "echonote-last-auth-ts";

export const authHint = {
  getLastUid(): string | null {
    try {
      const uid = localStorage.getItem(LAST_AUTH_UID_KEY);
      return uid && uid.trim() ? uid : null;
    } catch {
      return null;
    }
  },

  setLastUid(uid: string): void {
    try {
      if (!uid || !uid.trim()) return;
      localStorage.setItem(LAST_AUTH_UID_KEY, uid);
      localStorage.setItem(LAST_AUTH_TS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(LAST_AUTH_UID_KEY);
      localStorage.removeItem(LAST_AUTH_TS_KEY);
    } catch {
      // ignore
    }
  },

  getLastSetAtMs(): number | null {
    try {
      const raw = localStorage.getItem(LAST_AUTH_TS_KEY);
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  },
};

