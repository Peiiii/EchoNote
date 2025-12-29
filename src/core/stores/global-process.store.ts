import { create } from "zustand";

export type StepStatus = "pending" | "running" | "success" | "error";

export interface GlobalProcessStep {
  id: string;
  title: string;
  status: StepStatus;
}

export type ProcessStatus = "idle" | "running" | "success" | "error";

export type GlobalProcessDisplayMode = "dialog" | "fullscreen";

export interface GlobalProcess {
  id: string;
  title: string;
  message?: string;
  status: ProcessStatus;
  progress: number; // 0-100
  steps?: GlobalProcessStep[];
  dismissible?: boolean; // allow manual dismiss (not for critical init)
  startedAt?: number;
  endedAt?: number;
  displayMode?: GlobalProcessDisplayMode;
}

interface GlobalProcessState {
  visible: boolean;
  process: GlobalProcess | null;
  // actions
  show: (process: Omit<GlobalProcess, "status" | "progress" | "startedAt" | "endedAt"> & {
    progress?: number;
  }) => void;
  update: (patch: Partial<GlobalProcess>) => void;
  setMessage: (message: string) => void;
  setProgress: (progress: number) => void;
  setStepStatus: (stepId: string, status: StepStatus) => void;
  succeed: (message?: string) => void;
  fail: (message?: string) => void;
  hide: () => void;
}

export const useGlobalProcessStore = create<GlobalProcessState>()((set, get) => ({
  visible: false,
  process: null,

  show: process => {
    const steps = process.steps?.map(s => ({ ...s, status: s.status ?? "pending" as StepStatus }));
    set({
      visible: true,
      process: {
        id: process.id,
        title: process.title,
        message: process.message,
        status: "running",
        progress: process.progress ?? 0,
        steps,
        dismissible: process.dismissible ?? false,
        startedAt: Date.now(),
        displayMode: process.displayMode ?? "dialog",
      },
    });
  },

  update: patch => {
    const current = get().process;
    if (!current) return;
    set({ process: { ...current, ...patch } });
  },

  setMessage: message => {
    const current = get().process;
    if (!current) return;
    set({ process: { ...current, message } });
  },

  setProgress: progress => {
    const current = get().process;
    if (!current) return;
    set({ process: { ...current, progress } });
  },

  setStepStatus: (stepId, status) => {
    const current = get().process;
    if (!current || !current.steps) return;
    const steps = current.steps.map(s => (s.id === stepId ? { ...s, status } : s));
    set({ process: { ...current, steps } });
  },

  succeed: message => {
    const current = get().process;
    if (!current) return;
    set({
      process: {
        ...current,
        message: message ?? current.message,
        status: "success",
        progress: 100,
        endedAt: Date.now(),
      },
    });
  },

  fail: message => {
    const current = get().process;
    if (!current) return;
    set({ process: { ...current, message: message ?? current.message, status: "error", endedAt: Date.now() } });
  },

  hide: () => set({ visible: false, process: null }),
}));
