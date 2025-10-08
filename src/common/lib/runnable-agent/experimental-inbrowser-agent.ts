import { AgentEvent, EventType, IAgent, RunAgentInput, UIMessage, type TextUIPart, type ToolInvocationUIPart } from "@agent-labs/agent-chat";
import { Observable } from "rxjs";
import { catchError, filter } from "rxjs/operators";
import { AgentConfig, OpenAIAgent } from "./agent-utils/openai-agent";
import { decodeEventStream } from "./sse-json-decoder";

const DEFAULT_CONTEXT_CHAR_LIMIT = 30000;

export class ExperimentalInBrowserAgent implements IAgent {
  private openaiAgent: OpenAIAgent;
  private currentConfig: AgentConfig;
  // Character-limit for input context; only user/assistant history is trimmed.
  private contextCharLimit: number;

  constructor(config?: Partial<AgentConfig>) {
    this.currentConfig = {
      apiKey:
        config?.apiKey || import.meta.env.VITE_OPENAI_API_KEY || "",
      model:
        config?.model || import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo",
      temperature: config?.temperature || 0.7,
      maxTokens: config?.maxTokens || 1000,
      baseURL:
        config?.baseURL ||
        import.meta.env.VITE_OPENAI_API_URL ||
        "https://api.openai.com/v1",
    };

    // Resolve context char limit from, in order: explicit config, env (VITE_CONTEXT_CHAR_LIMIT or CONTEXT_CHAR_LIMIT), default 30000.
    const parsedLimit = Number(import.meta.env.VITE_CONTEXT_CHAR_LIMIT) || DEFAULT_CONTEXT_CHAR_LIMIT;
    this.contextCharLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : DEFAULT_CONTEXT_CHAR_LIMIT;

    if (!this.currentConfig.apiKey) {
      throw new Error(
        "API key is required. Please set the appropriate API key environment variable."
      );
    }

    this.openaiAgent = new OpenAIAgent(this.currentConfig);
  }
  
  abortRun() {
    this.openaiAgent.abort();
  }

  run(input: RunAgentInput) {
    // Pre-trim input messages by character limit before sending to the underlying agent.
    const trimmedInput = this.trimInputByCharLimit(input, this.contextCharLimit);
    console.log("🔔 [ExperimentalInBrowserAgent][run] trimmedInput:", {
      input,
      trimmedInput,
      contextCharLimit: this.contextCharLimit,
    });
    const createChunkObservable = (generator: AsyncGenerator<string>) =>
      new Observable<string>(subscriber => {
        (async () => {
          try {
            for await (const chunk of generator) {
              subscriber.next(chunk);
            }
            subscriber.complete();
          } catch (err) {
            subscriber.error(err);
          }
        })();
      });

    return new Observable<AgentEvent>(observer => {
      const process = async () => {
        try {
          const acceptHeader = "application/json";
          const generator = this.openaiAgent.run(trimmedInput, acceptHeader);

          createChunkObservable(generator).pipe(
            decodeEventStream(), // event解码步骤
            filter((event: unknown) => !!event && !!(event as { type?: unknown }).type),  // 业务处理可继续扩展
            // 你可以在这里继续添加更多 operator
            catchError(err => {
              observer.next({
                type: EventType.RUN_ERROR,

              });
              observer.error(err);
              return [];
            })
          ).subscribe({
            next: (event: unknown) => {
              console.log("event", event);
              observer.next(event as AgentEvent);
            },
            error: err => observer.error(err),
            complete: () => {
              observer.complete();
            }
          });
        } catch (error) {
          observer.next({
            type: EventType.RUN_ERROR,
          });
          observer.error(error);
        }
      };
      process();
      return () => {
        // 可以在这里添加取消逻辑
      };
    });
  }

  setConfig(config: Partial<AgentConfig>): void {
    this.currentConfig = {
      ...this.currentConfig,
      ...config,
    };

    // Update context limit if provided
    const newLimit = (config as unknown as { contextCharLimit?: number })?.contextCharLimit;
    if (typeof newLimit === "number" && Number.isFinite(newLimit) && newLimit > 0) {
      this.contextCharLimit = newLimit;
    }

    if (!this.currentConfig.apiKey) {
      throw new Error(
        "API key is required. Please set the appropriate API key environment variable."
      );
    }

    this.openaiAgent = new OpenAIAgent(this.currentConfig);
  }

  getConfig() {
    return {
      ...this.currentConfig,
      hasApiKey: !!this.currentConfig.apiKey,
      contextCharLimit: this.contextCharLimit,
    };
  }

  /**
   * Trim the input conversation by character length.
   * - Uses character count (not tokens)
   * - Preserves all system messages and any non user/assistant roles
   * - Only removes whole user/assistant messages from the oldest until within limit
   * - If system-only content exceeds the limit, keep as-is and log a warning
   */
  private trimInputByCharLimit(input: RunAgentInput, limit: number): RunAgentInput {
    try {
      const messages: UIMessage[] = input.messages || [];

      // Helper: count characters for any part (text, tool-invocation, etc.)
      const isTextPart = (p: UIMessage["parts"][number]): p is TextUIPart =>
        (p as TextUIPart).type === "text" && typeof (p as TextUIPart).text === "string";
      const isToolInvocationPart = (
        p: UIMessage["parts"][number]
      ): p is ToolInvocationUIPart =>
        (p as ToolInvocationUIPart).type === "tool-invocation" && !!(p as ToolInvocationUIPart).toolInvocation;
      const countPart = (p: UIMessage["parts"][number]): number => {
        if (isTextPart(p)) return p.text.length;
        if (isToolInvocationPart(p)) {
          const inv = p.toolInvocation;
          let len = 0;
          len += inv.toolName ? inv.toolName.length : 0;
          if (typeof inv.args === "string") len += inv.args.length;
          if (inv.toolCallId) len += inv.toolCallId.length;
          if (inv.result !== undefined) {
            len += typeof inv.result === "string" ? inv.result.length : JSON.stringify(inv.result).length;
          }
          if (inv.error !== undefined) {
            len += typeof inv.error === "string" ? inv.error.length : JSON.stringify(inv.error).length;
          }
          return len;
        }
        try {
          return JSON.stringify(p).length;
        } catch {
          return 0;
        }
      };
      const countMessage = (m: UIMessage): number => (m.parts || []).reduce((acc, part) => acc + countPart(part), 0);

      // History messages eligible for trimming: user/assistant (limit applies ONLY to these)
      const historyMessages = messages.filter((m) => m.role === "user" || m.role === "assistant");
      const historyChars = historyMessages.reduce((acc, m) => acc + countMessage(m), 0);
      // System messages and context are NOT counted towards the limit.
      if (historyChars <= limit) {
        return input;
      }

      // Remove oldest history messages until within limit
      const historyQueue = [...historyMessages];
      const toRemove = new Set<string>();
      let currentHistoryChars = historyChars;
      while (currentHistoryChars > limit && historyQueue.length > 0) {
        const removed = historyQueue.shift()!;
        toRemove.add(removed.id);
        currentHistoryChars -= countMessage(removed);
      }

      const trimmedMessages = messages.filter((m) => !toRemove.has(m.id));
      // After trimming, history-only chars should be within limit. No warning needed since system/context are excluded.

      return {
        ...input,
        messages: trimmedMessages,
      };
    } catch (e) {
      console.warn("trimInputByCharLimit failed, fallback to original input:", e);
      return input;
    }
  }
}
