import OpenAI from "openai";

const proxyBase = (import.meta.env.VITE_AI_PROXY_BASE as string | undefined) || "";
const apiKey = proxyBase
  ? "proxy"
  : (import.meta.env.VITE_DASHSCOPE_API_KEY as string | undefined) || "";
const baseURL = proxyBase
  ? `${proxyBase.replace(/\/+$/, "")}/openai/v1`
  : import.meta.env.VITE_DASHSCOPE_API_BASE || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
export const defaultModelId: string =
  (import.meta.env.VITE_DASHSCOPE_MODEL as string | undefined) || "qwen3-max";

export const openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true });
