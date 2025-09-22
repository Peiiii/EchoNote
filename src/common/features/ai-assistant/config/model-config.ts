export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  model: string;
  apiUrl: string;
  temperature?: number;
  maxTokens?: number;
  isDefault?: boolean;
}

export const PRESET_MODELS: ModelConfig[] = [
  {
    id: 'qwen-plus',
    name: 'Qwen Plus',
    description: 'Alibaba Cloud Qwen model via DashScope',
    apiKey: import.meta.env.VITE_DASHSCOPE_API_KEY || '',
    model: 'qwen-plus-latest',
    apiUrl: import.meta.env.VITE_DASHSCOPE_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: true,
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Google Gemini model via OpenRouter',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'google/gemini-2.5-pro',
    apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
    temperature: 0.7,
    maxTokens: 4000,
  },
  {
    id: 'grok-4-fast',
    name: 'Grok-4 Fast',
    description: 'Fast and free Grok model via OpenRouter',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    model: 'x-ai/grok-4-fast:free',
    apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
    temperature: 0.7,
    maxTokens: 4000,
  },
];

export const getDefaultModel = (): ModelConfig => {
  return PRESET_MODELS.find(model => model.isDefault) || PRESET_MODELS[0];
};

export const getModelById = (id: string): ModelConfig | undefined => {
  return PRESET_MODELS.find(model => model.id === id);
};
