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

const CLOUDFLARE_WORKER_AI_PROXY_API_URL = "https://stillroot-ai-proxy.agentverse.cc";
const AI_PROXY_BASE = (import.meta.env.VITE_AI_PROXY_BASE as string | undefined) || "";
const AI_PROXY_OPENAI_BASE_URL = AI_PROXY_BASE
  ? `${AI_PROXY_BASE.replace(/\/+$/, "")}/openai/v1`
  : "";

export const PRESET_MODELS: ModelConfig[] = [
  {
    id: "qwen-plus",
    name: "Qwen Plus",
    description: "Alibaba Cloud Qwen model via DashScope",
    apiKey: AI_PROXY_OPENAI_BASE_URL ? "proxy" : import.meta.env.VITE_DASHSCOPE_API_KEY || "",
    model: "qwen-plus-latest",
    apiUrl:
      AI_PROXY_OPENAI_BASE_URL ||
      import.meta.env.VITE_DASHSCOPE_API_BASE ||
      "https://dashscope.aliyuncs.com/compatible-mode/v1",
    temperature: 0.7,
    maxTokens: 4000,
  },
  {
    id: "qwen3-max",
    name: "Qwen3 Max",
    description: "Alibaba Cloud Qwen3 Max model via DashScope",
    apiKey: AI_PROXY_OPENAI_BASE_URL ? "proxy" : import.meta.env.VITE_DASHSCOPE_API_KEY || "",
    model: "qwen3-max",
    apiUrl:
      AI_PROXY_OPENAI_BASE_URL ||
      import.meta.env.VITE_DASHSCOPE_API_BASE ||
      "https://dashscope.aliyuncs.com/compatible-mode/v1",
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: true,
  },
  {
    id: "cloudflare-worker-openrouter-google-gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Google Gemini 2.5 Pro via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/google/gemini-2.5-pro",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Google Gemini 2.5 Flash via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/google/gemini-2.5-flash",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-grok-4-fast",
    name: "Grok 4 Fast",
    description: "Grok 4 Fast via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/x-ai/grok-4-fast:free",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-grok-code-fast-1",
    name: "Grok Code Fast 1",
    description: "Grok Code Fast 1 via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/x-ai/grok-code-fast-1",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-openai-gpt-5-codex",
    name: "GPT 5 Codex",
    description: "GPT 5 Codex via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/openai/gpt-5-codex",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-openai-gpt-5-chat",
    name: "GPT 5 Chat",
    description: "GPT 5 Chat via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/openai/gpt-5-chat",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },
  {
    id: "cloudflare-worker-openrouter-claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    description: "Claude Sonnet 4.5 via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/anthropic/claude-sonnet-4.5",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },

  {
    id: "cloudflare-worker-openrouter-glm-4.6",
    name: "GLM 4.6",
    description: "GLM 4.5 via Cloudflare Worker OpenRouter",
    apiKey: "not-needed",
    model: "openrouter/z-ai/glm-4.6",
    apiUrl: CLOUDFLARE_WORKER_AI_PROXY_API_URL,
    temperature: 0.7,
    maxTokens: 4000,
    isDefault: false,
  },

  // {
  //   id: 'gemini-2.5-pro',
  //   name: 'Gemini 2.5 Pro',
  //   description: 'Google Gemini model via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'google/gemini-2.5-pro',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
  // {
  //   id: 'gemini-2.5-flash',
  //   name: 'Gemini 2.5 Flash',
  //   description: 'Fast Google Gemini model via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'google/gemini-2.5-flash',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
  // {
  //   id: 'grok-4-fast',
  //   name: 'Grok-4 Fast',
  //   description: 'Fast and free Grok model via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'x-ai/grok-4-fast:free',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
  // {
  //   id: 'grok-code-fast',
  //   name: 'Grok Code Fast',
  //   description: 'Fast Grok model optimized for coding via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'x-ai/grok-code-fast-1',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
  // {
  //   id: 'claude-sonnet-4',
  //   name: 'Claude Sonnet 4',
  //   description: 'Latest Anthropic Claude model via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'anthropic/claude-sonnet-4',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
  // {
  //   id: 'glm-4.5',
  //   name: 'GLM-4.5',
  //   description: 'Zhipu AI GLM-4.5 model via OpenRouter',
  //   apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  //   model: 'z-ai/glm-4.5',
  //   apiUrl: import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1',
  //   temperature: 0.7,
  //   maxTokens: 4000,
  // },
];

export const getDefaultModel = (): ModelConfig => {
  return PRESET_MODELS.find(model => model.isDefault) || PRESET_MODELS[0];
};

export const getModelById = (id: string): ModelConfig | undefined => {
  return PRESET_MODELS.find(model => model.id === id);
};
