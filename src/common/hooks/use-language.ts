import { useLanguageStore } from "@/core/stores/language.store";

export function useLanguage() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  return {
    language,
    setLanguage,
  };
}

