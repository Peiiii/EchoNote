export interface LLMProviderConfig {
  model: string;
  baseUrl: string;
  apiKey: string;
}

export function getLLMProviderConfig(): { providerConfig: LLMProviderConfig } {
  return {
    providerConfig: {
      model: import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      baseUrl: import.meta.env.VITE_OPENAI_API_URL || "https://api.openai.com/v1",
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
    }
  };
}
