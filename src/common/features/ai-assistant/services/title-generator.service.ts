import { generateText } from "@/common/services/ai/generate-text";
import { i18n, SUPPORTED_LANGUAGES } from "@/common/i18n";

type Inflight = { promise: Promise<string>; ts: number };

export type TitleGenMode = "deterministic" | "ai" | "auto";
import type { UIMessage } from "@agent-labs/agent-chat";
import type { AIConversation } from "@/common/types/ai-conversation";
import type { AppLanguage } from "@/common/i18n";

class TitleGeneratorService {
  private inFlight: Map<string, Inflight> = new Map();
  private queue: string[] = [];
  private running = false;
  private enabled = true;
  private minIntervalMs = 1500;
  private results: Map<string, { title?: string; error?: unknown }> = new Map();

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  request(
    conversationId: string,
    text: string,
    options?: { mode?: TitleGenMode; lng?: string }
  ): Promise<string> {
    if (!this.enabled) return Promise.resolve("");
    const existing = this.inFlight.get(conversationId);
    if (existing) return existing.promise;
    const p = new Promise<string>((resolve, reject) => {
      const mode: TitleGenMode = options?.mode || "deterministic";
      const lng = resolveTitleLanguage(options?.lng);
      this.queue.push(JSON.stringify({ id: conversationId, text, mode, lng }));
      this.runLoop().catch(() => {});
      const check = setInterval(() => {
        const done = this.results.get(conversationId);
        if (done !== undefined) {
          clearInterval(check);
          this.results.delete(conversationId);
          if (done.error) reject(done.error);
          else resolve(done.title || "");
        }
      }, 50);
    });
    this.inFlight.set(conversationId, { promise: p, ts: Date.now() });
    p.finally(() => this.inFlight.delete(conversationId));
    return p;
  }

  private async runLoop() {
    if (this.running) return;
    this.running = true;
    let lastTs = 0;
    while (this.queue.length) {
      const item = this.queue.shift();
      if (!item) break;
      const { id, text, mode, lng } = JSON.parse(item) as {
        id: string;
        text: string;
        mode: TitleGenMode;
        lng: AppLanguage;
      };
      const delta = Date.now() - lastTs;
      if (delta < this.minIntervalMs)
        await new Promise(r => setTimeout(r, this.minIntervalMs - delta));
      try {
        const title = await this.generateTitle(text, mode, lng);
        this.results.set(id, { title });
        lastTs = Date.now();
      } catch (e) {
        this.results.set(id, { error: e });
        lastTs = Date.now();
      }
    }
    this.running = false;
  }

  private async generateTitle(text: string, mode: TitleGenMode, lng: AppLanguage): Promise<string> {
    if (mode === "deterministic") {
      return this.generateDeterministicTitle(text);
    }

    if (mode === "auto" && !this.enabled) {
      return this.generateDeterministicTitle(text);
    }

    if (mode === "ai" || (mode === "auto" && this.enabled)) {
      return this.generateAITitle(text, lng);
    }

    return this.generateDeterministicTitle(text);
  }

  private generateDeterministicTitle(text: string): string {
    return text.trim().replace(/\s+/g, " ").slice(0, 200);
  }

  private async generateAITitle(text: string, lng: AppLanguage): Promise<string> {
    try {
      const prompt = this.buildTitlePrompt(text, lng);
      const aiTitle = await this.callAIService(prompt, lng);
      const validatedTitle = this.validateAndTrimTitle(aiTitle);

      if (validatedTitle) {
        return validatedTitle;
      }

      return this.generateDeterministicTitle(text);
    } catch (error) {
      console.warn("AI title generation failed, falling back to deterministic:", error);
      return this.generateDeterministicTitle(text);
    }
  }

  private buildTitlePrompt(text: string, lng: AppLanguage): string {
    if (lng === "zh-CN") {
      return `请根据以下对话内容生成一个简洁、明确的对话标题。要求：
- 最多 36 个字符
- 概括主要主题
- 避免“新对话”这类泛词
- 只输出标题本身，不要引号、不要多余解释

内容：${text}`;
    }

    return `Generate a concise, descriptive title for this conversation content. The title should be:
- Maximum 36 characters
- Capture the main topic or theme
- Be clear and informative
- Avoid generic phrases like "New Conversation"
- Output ONLY the title (no quotes, no extra text)

Content: ${text}`;
  }

  private async callAIService(prompt: string, lng: AppLanguage): Promise<string> {
    return await generateText({
      prompt,
      system: i18n.t("aiAssistant.prompts.systemPrompts.defaultTitleGenerator", { lng }),
      temperature: 0.3,
    });
  }

  private validateAndTrimTitle(title: string): string | null {
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle.length <= 36) {
      return trimmedTitle;
    }
    return null;
  }
}

export const titleGeneratorService = new TitleGeneratorService();

export interface AutoTitleSnapshotOptions {
  conversationId: string;
  conversation: AIConversation;
  messages: UIMessage[];
  autoTitleEnabled: boolean;
  autoTitleMode: TitleGenMode;
  autoTitleDone: Record<string, boolean>;
  getUserId: () => string | null | undefined;
  update: (userId: string, conversationId: string, title: string) => Promise<void> | void;
  applyLocal: (conversationId: string, title: string) => void;
  markDone: (conversationId: string) => void;
  setTitleGenerating: (conversationId: string) => void;
  completeTitleGenerating: (conversationId: string) => void;
}

export async function handleAutoTitleSnapshot(opts: AutoTitleSnapshotOptions): Promise<void> {
  if (!shouldGenerateTitle(opts)) {
    return;
  }

  const text = extractUserText(opts.messages);
  if (!text) return;

  opts.setTitleGenerating(opts.conversationId);

  try {
    const title = await generateTitleForSnapshot(opts, text);
    if (!title) {
      opts.completeTitleGenerating(opts.conversationId);
      return;
    }
    await updateConversationTitle(opts, title);
    opts.completeTitleGenerating(opts.conversationId);
  } catch (error) {
    opts.completeTitleGenerating(opts.conversationId);
    throw error;
  }
}

function shouldGenerateTitle(opts: AutoTitleSnapshotOptions): boolean {
  const { conversationId, conversation, autoTitleDone } = opts;

  if (autoTitleDone[conversationId]) return false;

  return isDefaultConversationTitle(conversation.title);
}

export function isDefaultConversationTitle(title: string | null | undefined): boolean {
  const normalized = (title ?? "").trim();
  if (!normalized) return true;
  if (normalized.toLowerCase() === "new conversation") return true;
  if (normalized.startsWith("temp-")) return true;

  // Back-compat: historically we persisted localized placeholders.
  // Treat any "new conversation" placeholder across supported languages as default.
  const placeholders = new Set<string>();
  for (const lng of SUPPORTED_LANGUAGES) {
    placeholders.add(i18n.t("aiAssistant.conversationList.newConversation", { lng }));
    placeholders.add(i18n.t("aiAssistant.conversationList.generatingTitle", { lng }));
  }
  return placeholders.has(normalized);
}

function extractUserText(messages: UIMessage[]): string {
  const firstUser = messages.find(m => m.role === "user");
  if (!firstUser) return "";

  const textPart = firstUser.parts.find(p => p.type === "text") as
    | { type: "text"; text: string }
    | undefined;
  return textPart?.text?.trim() || "";
}

async function generateTitleForSnapshot(
  opts: AutoTitleSnapshotOptions,
  text: string
): Promise<string> {
  const { conversationId, autoTitleEnabled, autoTitleMode } = opts;
  const mode: TitleGenMode = autoTitleEnabled ? autoTitleMode : "deterministic";
  const lng = resolveTitleLanguage(i18n.resolvedLanguage ?? i18n.language);

  try {
    const title = await titleGeneratorService.request(conversationId, text, { mode, lng });
    if (title) return title;
  } catch {
    return text.replace(/\s+/g, " ").slice(0, 36);
  }

  return text.replace(/\s+/g, " ").slice(0, 36);
}

async function updateConversationTitle(
  opts: AutoTitleSnapshotOptions,
  title: string
): Promise<void> {
  const { conversationId, getUserId, update, applyLocal, markDone } = opts;

  const userId = getUserId();
  if (!userId) return;

  await update(userId, conversationId, title);
  applyLocal(conversationId, title);
  markDone(conversationId);
}

function resolveTitleLanguage(input: string | null | undefined): AppLanguage {
  const lower = (input ?? "").toLowerCase();
  if (lower.startsWith("zh")) return "zh-CN";
  return "en";
}
