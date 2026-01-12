import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export type AppLanguage = "en" | "zh-CN";

export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ["en", "zh-CN"] as const;

const LANG_STORAGE_KEY = "stillroot-lang";

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

let initPromise: Promise<void> | null = null;

export const initI18n = (): Promise<void> => {
  if (initPromise) return initPromise;

  const initialLanguage = typeof window === "undefined" ? "en" : detectInitialLanguage();

  initPromise = i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      lng: initialLanguage,
      fallbackLng: "en",
      supportedLngs: [...SUPPORTED_LANGUAGES],

      ns: ["common"],
      defaultNS: "common",

      backend: {
        loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`,
      },

      interpolation: {
        escapeValue: false,
      },

      returnNull: false,
    })
    .then(async () => {
      if (typeof window === "undefined") return;
      
      const { syncLanguageFromI18n, useLanguageStore } = await import("@/core/stores/language.store");
      
      const storeLanguage = useLanguageStore.getState().language;
      const i18nLanguage = i18n.resolvedLanguage ?? i18n.language;
      
      if (storeLanguage && storeLanguage !== i18nLanguage) {
        i18n.changeLanguage(storeLanguage);
      } else {
        syncLanguageFromI18n(i18nLanguage);
      }
      
      i18n.on("languageChanged", (lng: string) => {
        syncLanguageFromI18n(lng);
      });
    });

  return initPromise;
};

export { i18n };
