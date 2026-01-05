import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppLanguage } from "@/common/i18n";
import { i18n } from "@/common/i18n";

export interface LanguageState {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const LANG_STORAGE_KEY = "echonote-lang";

const normalizeLanguage = (input: string | null | undefined): AppLanguage => {
  if (!input) return "en";
  const lower = input.toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  return "en";
};

const detectInitialLanguage = (): AppLanguage => {
  if (typeof window === "undefined") return "en";

  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.state && parsed.state.language) {
          return normalizeLanguage(parsed.state.language);
        }
      } catch {
        const normalized = normalizeLanguage(stored);
        if (normalized) return normalized;
      }
    }
  } catch {
    // ignore
  }

  const nav = (navigator.languages?.[0] ?? navigator.language) || "en";
  return normalizeLanguage(nav);
};

let isUpdatingFromI18n = false;

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectInitialLanguage(),
      setLanguage: (language: AppLanguage) => {
        if (isUpdatingFromI18n) return;
        set({ language });
        if (typeof window !== "undefined" && i18n.isInitialized) {
          i18n.changeLanguage(language).then(() => {
            window.location.reload();
          });
        }
      },
    }),
    {
      name: LANG_STORAGE_KEY,
      partialize: (state) => ({ language: state.language }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined" && i18n.isInitialized) {
          const storeLanguage = state.language;
          const i18nLanguage = i18n.resolvedLanguage ?? i18n.language;
          if (storeLanguage && storeLanguage !== i18nLanguage) {
            i18n.changeLanguage(storeLanguage);
          }
        }
      },
    }
  )
);

export const syncLanguageFromI18n = (i18nLanguage: string) => {
  const normalized = normalizeLanguage(i18nLanguage);
  const currentLanguage = useLanguageStore.getState().language;
  if (currentLanguage !== normalized) {
    isUpdatingFromI18n = true;
    useLanguageStore.setState({ language: normalized });
    setTimeout(() => {
      isUpdatingFromI18n = false;
    }, 0);
  }
};
