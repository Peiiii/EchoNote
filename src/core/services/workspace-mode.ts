export type WorkspaceMode = "cloud" | "local";

const MODE_KEY = "echonote-last-workspace-mode";
const MODE_TS_KEY = "echonote-last-workspace-mode-ts";

function isWorkspaceMode(v: unknown): v is WorkspaceMode {
  return v === "cloud" || v === "local";
}

export const workspaceMode = {
  get(): WorkspaceMode | null {
    try {
      const raw = localStorage.getItem(MODE_KEY);
      return isWorkspaceMode(raw) ? raw : null;
    } catch {
      return null;
    }
  },

  set(mode: WorkspaceMode): void {
    try {
      localStorage.setItem(MODE_KEY, mode);
      localStorage.setItem(MODE_TS_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(MODE_KEY);
      localStorage.removeItem(MODE_TS_KEY);
    } catch {
      // ignore
    }
  },

  getLastSetAtMs(): number | null {
    try {
      const raw = localStorage.getItem(MODE_TS_KEY);
      if (!raw) return null;
      const n = Number(raw);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  },
};

