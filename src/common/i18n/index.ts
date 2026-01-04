import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export type AppLanguage = "en" | "zh-CN";

export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ["en", "zh-CN"] as const;

const LANG_STORAGE_KEY = "echonote-lang";

const normalizeLanguage = (input: string | null | undefined): AppLanguage => {
  if (!input) return "en";
  const lower = input.toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  return "en";
};

const detectInitialLanguage = (): AppLanguage => {
  try {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored) return normalizeLanguage(stored);
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
      nonExplicitSupportedLngs: true,

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
    .then(() => {
      if (typeof window === "undefined") return;
      const persist = (lng: string) => {
        try {
          localStorage.setItem(LANG_STORAGE_KEY, normalizeLanguage(lng));
        } catch {
          // ignore
        }
      };
      persist(i18n.resolvedLanguage ?? i18n.language);
      i18n.on("languageChanged", persist);
    });

  return initPromise;
};

export { i18n };
