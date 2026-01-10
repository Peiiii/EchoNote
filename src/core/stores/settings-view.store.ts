import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SettingsTab = "general" | "apiAccess";

export interface SettingsViewState {
  activeTab: SettingsTab;
  setActiveTab: (tab: SettingsTab) => void;
}

export const useSettingsViewStore = create<SettingsViewState>()(
  persist(
    set => ({
      activeTab: "general",
      setActiveTab: tab => set({ activeTab: tab }),
    }),
    {
      name: "echonote-settings-view",
      partialize: state => ({ activeTab: state.activeTab }),
    }
  )
);

