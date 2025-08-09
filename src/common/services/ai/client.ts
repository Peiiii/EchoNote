import OpenAI from 'openai'

const apiKey = (import.meta.env.VITE_DASHSCOPE_API_KEY as string | undefined) || ''
const baseURL = import.meta.env.VITE_DASHSCOPE_API_BASE || 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'
export const defaultModelId: string = (import.meta.env.VITE_DASHSCOPE_MODEL as string | undefined) || 'qwen-plus-latest'

export const openai = new OpenAI({ apiKey, baseURL, dangerouslyAllowBrowser: true })
