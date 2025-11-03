import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StudioModuleId = "audio-summary" | "mindmap" | "wiki-card" | "report";

export interface StudioContext {
  channelIds: string[];
  mode: "auto" | "none" | "all" | "custom";
}

export interface StudioContentItem {
  id: string;
  moduleId: StudioModuleId;
  title: string;
  contextChannelIds: string[];
  createdAt: number;
  updatedAt: number;
  data: unknown;
  status: "idle" | "generating" | "completed" | "error";
  // Optional UX metadata
  pinned?: boolean;
  errorMessage?: string;
}

export interface StudioState {
  currentContext: StudioContext | null;
  currentModule: StudioModuleId | null;
  contentItems: Record<StudioModuleId, StudioContentItem[]>;
  activeItemId: string | null;
  isGenerating: boolean;

  setCurrentContext: (context: StudioContext) => void;
  setCurrentModule: (moduleId: StudioModuleId | null) => void;
  addContentItem: (item: StudioContentItem) => void;
  updateContentItem: (itemId: string, updates: Partial<StudioContentItem>) => void;
  deleteContentItem: (itemId: string) => void;
  setActiveItem: (itemId: string | null) => void;
  setGenerating: (isGenerating: boolean) => void;
  togglePin: (itemId: string) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      currentContext: null,
      currentModule: null,
      contentItems: {
        "audio-summary": [],
        mindmap: [],
        "wiki-card": [],
        report: [],
      },
      activeItemId: null,
      isGenerating: false,

      setCurrentContext: (context) => set({ currentContext: context }),
      setCurrentModule: (moduleId) => set({ currentModule: moduleId }),
      addContentItem: (item) =>
        set((state) => ({
          contentItems: {
            ...state.contentItems,
            [item.moduleId]: [...state.contentItems[item.moduleId], item],
          },
        })),
      updateContentItem: (itemId, updates) =>
        set((state) => {
          const updatedItems = { ...state.contentItems };
          for (const moduleId in updatedItems) {
            const idx = updatedItems[moduleId as StudioModuleId].findIndex((item) => item.id === itemId);
            if (idx >= 0) {
              updatedItems[moduleId as StudioModuleId] = [
                ...updatedItems[moduleId as StudioModuleId].slice(0, idx),
                { ...updatedItems[moduleId as StudioModuleId][idx], ...updates },
                ...updatedItems[moduleId as StudioModuleId].slice(idx + 1),
              ];
              break;
            }
          }
          return { contentItems: updatedItems };
        }),
      deleteContentItem: (itemId) =>
        set((state) => {
          const updatedItems = { ...state.contentItems };
          for (const moduleId in updatedItems) {
            updatedItems[moduleId as StudioModuleId] = updatedItems[moduleId as StudioModuleId].filter(
              (item) => item.id !== itemId
            );
          }
          return { contentItems: updatedItems, activeItemId: state.activeItemId === itemId ? null : state.activeItemId };
        }),
      setActiveItem: (itemId) => set({ activeItemId: itemId }),
      setGenerating: (isGenerating) => set({ isGenerating }),
      togglePin: (itemId) =>
        set((state) => {
          const updated = { ...state.contentItems };
          for (const moduleId in updated) {
            const items = updated[moduleId as StudioModuleId];
            const idx = items.findIndex((i) => i.id === itemId);
            if (idx >= 0) {
              const current = items[idx];
              items[idx] = { ...current, pinned: !current.pinned };
              break;
            }
          }
          return { contentItems: updated };
        }),
    }),
    {
      name: "echonote-studio",
      partialize: (state) => ({
        contentItems: state.contentItems,
        currentContext: state.currentContext,
      }),
    }
  )
);
