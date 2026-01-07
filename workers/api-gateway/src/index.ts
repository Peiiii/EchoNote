import { Hono } from "hono";

type Env = {
  DASHSCOPE_API_KEY: string;
  ALLOWED_ORIGINS?: string;
  DASHSCOPE_AIGC_API_BASE?: string;
  DASHSCOPE_COMPAT_BASE?: string;
  DASHSCOPE_ASR_MODEL?: string;
  TEMP_AUDIO: DurableObjectNamespace;
  VOICE_CALL: DurableObjectNamespace;
};

const app = new Hono<{ Bindings: Env }>();

function parseAllowedOrigins(value: string | undefined): string[] {
  return (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeParseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isOriginAllowed(origin: string, allowed: string[]): boolean {
  if (allowed.length === 0) return false;
  if (allowed.includes("*")) return true;

  const originUrl = safeParseUrl(origin);
  if (!originUrl) return false;

  for (const rule of allowed) {
    if (rule === origin) return true;

    if (rule.endsWith(":*")) {
      const base = rule.slice(0, -2);
      const baseUrl = safeParseUrl(base);
      if (!baseUrl) continue;
      if (originUrl.protocol === baseUrl.protocol && originUrl.hostname === baseUrl.hostname) return true;
      continue;
    }

    if (rule.startsWith("https://*.")) {
      const suffix = rule.slice("https://*.".length);
      if (originUrl.protocol === "https:" && originUrl.hostname.endsWith(`.${suffix}`)) return true;
      continue;
    }

    if (rule.startsWith("http://*.")) {
      const suffix = rule.slice("http://*.".length);
      if (originUrl.protocol === "http:" && originUrl.hostname.endsWith(`.${suffix}`)) return true;
      continue;
    }

    if (rule.startsWith("*.")) {
      const suffix = rule.slice("*.".length);
      if (originUrl.hostname.endsWith(`.${suffix}`)) return true;
      continue;
    }
  }

  return false;
}

function withCorsHeaders(req: Request, res: Response, env: Env): Response {
  // Don't wrap websocket upgrade responses (it would drop the webSocket handle).
  const maybeWebSocket = (res as unknown as { webSocket?: unknown }).webSocket;
  if (maybeWebSocket) return res;

  const origin = req.headers.get("Origin") || "";
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const headers = new Headers(res.headers);

  if (origin && isOriginAllowed(origin, allowed)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Expose-Headers", "Content-Type, Content-Length");
  }

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function jsonError(message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function guessAudioFormat(file: File): string | undefined {
  const type = (file.type || "").toLowerCase();
  if (type.includes("wav")) return "wav";
  if (type.includes("mpeg") || type.includes("mp3")) return "mp3";
  if (type.includes("mp4") || type.includes("m4a")) return "m4a";
  if (type.includes("ogg")) return "ogg";
  if (type.includes("webm")) return "webm";

  const name = (file.name || "").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : "";
  if (ext) return ext;
  return undefined;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

function extractAsrText(payload: unknown): string {
  const root =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : null;
  const output =
    typeof root?.output === "object" && root.output !== null
      ? (root.output as Record<string, unknown>)
      : null;

  const direct =
    (typeof output?.text === "string" && output.text.trim()) ||
    (typeof output?.result === "string" && output.result.trim()) ||
    (typeof output?.transcription === "string" && output.transcription.trim());
  if (direct) return direct;

  const results = output?.results;
  if (Array.isArray(results)) {
    const parts: string[] = [];
    for (const r of results) {
      if (typeof r === "string") {
        if (r.trim()) parts.push(r.trim());
        continue;
      }
      if (typeof r === "object" && r !== null) {
        const obj = r as Record<string, unknown>;
        const t =
          (typeof obj.text === "string" && obj.text.trim()) ||
          (typeof obj.transcription === "string" && obj.transcription.trim()) ||
          "";
        if (t) parts.push(t);
      }
    }
    if (parts.length) return parts.join(" ");
  }

  const sentences = output?.sentences;
  if (Array.isArray(sentences)) {
    const parts: string[] = [];
    for (const s of sentences) {
      if (typeof s === "string") {
        if (s.trim()) parts.push(s.trim());
        continue;
      }
      if (typeof s === "object" && s !== null) {
        const r = s as Record<string, unknown>;
        const t = typeof r.text === "string" ? r.text.trim() : "";
        if (t) parts.push(t);
      }
    }
    if (parts.length) return parts.join(" ");
  }

  return "";
}

function extractTranscriptionUrl(payload: unknown): string {
  const root =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : null;
  const output =
    typeof root?.output === "object" && root.output !== null
      ? (root.output as Record<string, unknown>)
      : null;

  const results = output?.results;
  if (!Array.isArray(results)) return "";

  for (const r of results) {
    if (typeof r !== "object" || r === null) continue;
    const obj = r as Record<string, unknown>;
    const u = typeof obj.transcription_url === "string" ? obj.transcription_url.trim() : "";
    if (u) return u;
  }
  return "";
}

function extractTextFromTranscriptionFile(payload: unknown): string {
  const root =
    typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : null;
  const transcripts = root?.transcripts;
  if (Array.isArray(transcripts)) {
    const parts: string[] = [];
    for (const t of transcripts) {
      if (typeof t !== "object" || t === null) continue;
      const obj = t as Record<string, unknown>;
      const text = typeof obj.text === "string" ? obj.text.trim() : "";
      if (text) parts.push(text);
    }
    if (parts.length) return parts.join("\n");
  }
  const direct = typeof root?.text === "string" ? root.text.trim() : "";
  return direct;
}

async function startAsrTask(options: {
  env: Env;
  requestOrigin: string;
  file: File;
}): Promise<{ taskId: string; taskUrl: string }> {
  const { env, requestOrigin, file } = options;
  const base = (env.DASHSCOPE_AIGC_API_BASE || "https://dashscope.aliyuncs.com/api/v1").replace(/\/+$/, "");
  const url = `${base}/services/audio/asr/transcription`;
  const model = (env.DASHSCOPE_ASR_MODEL || "paraformer-v2").trim() || "paraformer-v2";

  const format = guessAudioFormat(file);
  const parameters: Record<string, unknown> = {};
  if (format) parameters.format = format;

  const audioId = crypto.randomUUID();
  const token = crypto.randomUUID();
  const stub = env.TEMP_AUDIO.get(env.TEMP_AUDIO.idFromName(audioId));
  const putResp = await stub.fetch("https://temp-audio/put", {
    method: "POST",
    headers: {
      "x-token": token,
      "content-type": file.type || "application/octet-stream",
    },
    body: await file.arrayBuffer(),
  });
  if (!putResp.ok) {
    throw new Error("Failed to store audio");
  }

  const fileUrl = new URL(`${requestOrigin}/tmp-audio/${audioId}`);
  fileUrl.searchParams.set("token", token);

  const upstreamResp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/json",
      "X-DashScope-Async": "enable",
    },
    body: JSON.stringify({
      model,
      input: { file_urls: [fileUrl.toString()] },
      ...(Object.keys(parameters).length ? { parameters } : {}),
    }),
  });

  let upstreamJson: unknown = null;
  try {
    upstreamJson = await upstreamResp.json();
  } catch {
    throw new Error("DashScope response is not JSON");
  }

  const record =
    typeof upstreamJson === "object" && upstreamJson !== null
      ? (upstreamJson as Record<string, unknown>)
      : null;
  const upstreamCode = typeof record?.code === "string" ? record.code : "";
  if (!upstreamResp.ok || upstreamCode) {
    throw new Error(
      typeof record?.message === "string" && record.message.trim()
        ? record.message.trim()
        : `DashScope ASR HTTP ${upstreamResp.status}`
    );
  }

  const output =
    typeof record?.output === "object" && record.output !== null
      ? (record.output as Record<string, unknown>)
      : null;
  const taskId = typeof output?.task_id === "string" ? output.task_id.trim() : "";
  if (!taskId) throw new Error("Missing task_id from DashScope");

  return { taskId, taskUrl: `${base}/tasks/${encodeURIComponent(taskId)}` };
}

async function fetchAsrTaskStatus(options: {
  env: Env;
  taskId: string;
}): Promise<
  | { status: "running"; task: unknown }
  | { status: "failed"; task: unknown }
  | { status: "succeeded"; task: unknown; text: string }
> {
  const base = (options.env.DASHSCOPE_AIGC_API_BASE || "https://dashscope.aliyuncs.com/api/v1").replace(/\/+$/, "");
  const taskUrl = `${base}/tasks/${encodeURIComponent(options.taskId)}`;

  const taskResp = await fetch(taskUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${options.env.DASHSCOPE_API_KEY}` },
  });
  if (!taskResp.ok) {
    return { status: "running", task: null };
  }

  let taskJson: unknown = null;
  try {
    taskJson = await taskResp.json();
  } catch {
    return { status: "running", task: null };
  }

  const taskRecord =
    typeof taskJson === "object" && taskJson !== null ? (taskJson as Record<string, unknown>) : null;
  const taskStatus = typeof taskRecord?.output === "object" && taskRecord.output !== null
    ? (taskRecord.output as Record<string, unknown>)
    : null;
  const statusRaw =
    typeof taskStatus?.task_status === "string" ? taskStatus.task_status.toUpperCase() : "";

  if (statusRaw === "FAILED" || statusRaw === "CANCELLED") {
    return { status: "failed", task: taskJson };
  }
  if (statusRaw !== "SUCCEEDED") {
    return { status: "running", task: taskJson };
  }

  const directText = extractAsrText(taskJson);
  if (directText) return { status: "succeeded", task: taskJson, text: directText };

  const transcriptionUrl = extractTranscriptionUrl(taskJson);
  if (!transcriptionUrl) return { status: "succeeded", task: taskJson, text: "" };

  const normalizedUrl = transcriptionUrl.startsWith("http://")
    ? `https://${transcriptionUrl.slice("http://".length)}`
    : transcriptionUrl;
  const trResp = await fetch(normalizedUrl);
  if (!trResp.ok) return { status: "succeeded", task: taskJson, text: "" };
  try {
    const trJson: unknown = await trResp.json();
    const trText = extractTextFromTranscriptionFile(trJson);
    return { status: "succeeded", task: taskJson, text: trText || "" };
  } catch {
    return { status: "succeeded", task: taskJson, text: "" };
  }
}

type TempAudioMeta = {
  token: string;
  contentType: string;
  createdAt: number;
};

export class TempAudio {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env
  ) {}

  async alarm(): Promise<void> {
    await this.state.storage.deleteAll();
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/put") {
      const token = req.headers.get("x-token") || "";
      if (!token) return jsonError("Missing token", 400);
      const contentType = req.headers.get("content-type") || "application/octet-stream";
      const ab = await req.arrayBuffer();
      if (ab.byteLength === 0) return jsonError("Empty audio", 400);
      if (ab.byteLength > 10 * 1024 * 1024) return jsonError("Audio too large", 413);

      const meta: TempAudioMeta = { token, contentType, createdAt: Date.now() };
      await this.state.storage.put("meta", meta);
      await this.state.storage.put("audio", ab);
      await this.state.storage.setAlarm(Date.now() + 2 * 60 * 1000);
      return new Response(null, { status: 204 });
    }

    if (req.method === "GET" && url.pathname === "/get") {
      const token = url.searchParams.get("token") || "";
      const meta = (await this.state.storage.get<TempAudioMeta>("meta")) || null;
      if (!meta || !meta.token) return jsonError("Not found", 404);
      if (!token || token !== meta.token) return jsonError("Unauthorized", 401);
      const audio = await this.state.storage.get<ArrayBuffer>("audio");
      if (!audio) return jsonError("Not found", 404);

      // Keep it available briefly for retries; alarm will clean up.
      return new Response(audio, {
        status: 200,
        headers: {
          "Content-Type": meta.contentType || "application/octet-stream",
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(null, { status: 404 });
  }
}

type VoiceCallInitMessage = {
  type: "init";
  language?: string;
  maxSentenceSilenceMs?: number;
};

type VoiceCallServerMessage =
  | { type: "ready" }
  | { type: "asr"; text: string }
  | { type: "error"; error: string };

function safeJsonParse(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function makeTaskId(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 32);
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(n)));
}

export class VoiceCallSession {
  private client: WebSocket | null = null;
  private upstream: WebSocket | null = null;
  private upstreamReady = false;
  private pendingAudio: ArrayBuffer[] = [];
  private init: VoiceCallInitMessage | null = null;
  private taskId = "";

  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env
  ) {}

  private send(msg: VoiceCallServerMessage) {
    const ws = this.client;
    if (!ws) return;
    try {
      ws.send(JSON.stringify(msg));
    } catch {
      // ignore
    }
  }

  private async connectUpstream() {
    if (this.upstream) return;
    if (!this.env.DASHSCOPE_API_KEY) {
      this.send({ type: "error", error: "Missing DASHSCOPE_API_KEY" });
      return;
    }

    const url = "https://dashscope.aliyuncs.com/api-ws/v1/inference";
    const resp = await fetch(url, {
      headers: {
        Upgrade: "websocket",
        Authorization: `bearer ${this.env.DASHSCOPE_API_KEY}`,
        "X-DashScope-DataInspection": "enable",
      },
    });

    const ws = (resp as unknown as { webSocket?: WebSocket }).webSocket;
    if (!ws) {
      this.send({ type: "error", error: `Upstream websocket not available: HTTP ${resp.status}` });
      return;
    }

    ws.accept();
    this.upstream = ws;
    this.taskId = makeTaskId();

    const language = (this.init?.language || "").trim();
    const maxSentenceSilenceMs = clampInt(this.init?.maxSentenceSilenceMs, 200, 3000, 650);

    ws.send(
      JSON.stringify({
        header: {
          action: "run-task",
          task_id: this.taskId,
          streaming: "duplex",
        },
        payload: {
          task_group: "audio",
          task: "asr",
          function: "recognition",
          model: "paraformer-realtime-v2",
          parameters: {
            sample_rate: 16000,
            format: "pcm",
            max_sentence_silence: maxSentenceSilenceMs,
            ...(language ? { language_hints: [language] } : {}),
          },
          input: {},
        },
      })
    );

    ws.addEventListener("message", (ev) => {
      const data = ev.data;
      if (typeof data !== "string") return;
      const parsed = safeJsonParse(data);
      if (!isRecord(parsed)) return;
      const header = isRecord(parsed.header) ? parsed.header : null;
      const event = typeof header?.event === "string" ? header.event : "";

      if (event === "task-started") {
        this.upstreamReady = true;
        this.send({ type: "ready" });

        const pending = this.pendingAudio.slice();
        this.pendingAudio = [];
        for (const buf of pending) {
          try {
            ws.send(buf);
          } catch {
            // ignore
          }
        }
        return;
      }

      if (event === "result-generated") {
        const payload = isRecord(parsed.payload) ? parsed.payload : null;
        const output = payload && isRecord(payload.output) ? payload.output : null;
        const sentence = output && isRecord(output.sentence) ? output.sentence : null;
        const text = typeof sentence?.text === "string" ? sentence.text.trim() : "";
        if (text) this.send({ type: "asr", text });
        return;
      }

      if (event === "task-failed") {
        const errorMessage =
          typeof header?.error_message === "string" && header.error_message.trim()
            ? header.error_message.trim()
            : "Upstream task failed";
        this.send({ type: "error", error: errorMessage });
        return;
      }
    });

    ws.addEventListener("close", () => {
      if (this.upstream === ws) {
        this.upstream = null;
        this.upstreamReady = false;
      }
    });
  }

  private closeUpstream() {
    const ws = this.upstream;
    if (!ws) return;
    this.upstream = null;
    this.upstreamReady = false;

    try {
      if (this.taskId) {
        ws.send(
          JSON.stringify({
            header: { action: "finish-task", task_id: this.taskId, streaming: "duplex" },
            payload: { input: {} },
          })
        );
      }
    } catch {
      // ignore
    }

    try {
      ws.close();
    } catch {
      // ignore
    }
  }

  async fetch(req: Request): Promise<Response> {
    const upgrade = req.headers.get("Upgrade") || "";
    if (upgrade.toLowerCase() !== "websocket") {
      return new Response("Expected websocket", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair) as [WebSocket, WebSocket];
    server.accept();

    this.client = server;
    this.upstreamReady = false;
    this.pendingAudio = [];
    this.init = null;
    this.taskId = "";

    const onClose = () => {
      if (this.client === server) this.client = null;
      this.closeUpstream();
    };
    server.addEventListener("close", onClose);
    server.addEventListener("error", onClose);

    server.addEventListener("message", (ev) => {
      const data = ev.data;
      if (typeof data === "string") {
        const msg = safeJsonParse(data);
        if (!isRecord(msg)) return;
        const type = typeof msg.type === "string" ? msg.type : "";
        if (type === "init") {
          this.init = msg as VoiceCallInitMessage;
          void this.connectUpstream();
        }
        if (type === "close") {
          try {
            server.close();
          } catch {
            // ignore
          }
        }
        return;
      }

      const ab: ArrayBuffer =
        data instanceof ArrayBuffer
          ? data
          : ArrayBuffer.isView(data)
            ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
            : new ArrayBuffer(0);
      if (ab.byteLength === 0) return;

      const upstream = this.upstream;
      if (!upstream || !this.upstreamReady) {
        this.pendingAudio.push(ab);
        if (this.pendingAudio.length > 60) {
          this.pendingAudio.splice(0, this.pendingAudio.length - 60);
        }
        return;
      }

      try {
        upstream.send(ab);
      } catch {
        // ignore
      }
    });

    return new Response(null, { status: 101, webSocket: client });
  }
}

app.use("*", async (c, next) => {
  await next();
  c.res = withCorsHeaders(c.req.raw, c.res, c.env);
});

app.options("*", (c) => {
  const origin = c.req.header("Origin") || "";
  const allowed = parseAllowedOrigins(c.env.ALLOWED_ORIGINS);
  if (!origin || !isOriginAllowed(origin, allowed)) {
    return new Response(null, { status: 204 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": c.req.header("Access-Control-Request-Headers") || "*",
      "Access-Control-Max-Age": "86400",
    },
  });
});

app.get("/health", (c) => c.json({ ok: true }));

app.get("/voice-call/ws", (c) => {
  const upgrade = c.req.header("Upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return jsonError("Expected websocket upgrade", 426);
  }
  const sessionId = c.req.query("sessionId") || "default";
  const stub = c.env.VOICE_CALL.get(c.env.VOICE_CALL.idFromName(sessionId));
  return stub.fetch(c.req.raw);
});

app.get("/tmp-audio/:id", async (c) => {
  const id = c.req.param("id");
  const token = c.req.query("token") || "";
  if (!id) return jsonError("Missing id", 400);
  if (!token) return jsonError("Missing token", 400);

  const stub = c.env.TEMP_AUDIO.get(c.env.TEMP_AUDIO.idFromName(id));
  const url = new URL("https://temp-audio/get");
  url.searchParams.set("token", token);
  return await stub.fetch(url.toString(), { method: "GET" });
});

app.post("/asr", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return jsonError("Missing DASHSCOPE_API_KEY", 500);
  }

  const contentType = c.req.header("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return jsonError("Expected multipart/form-data", 415);
  }

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return jsonError("Invalid multipart body");
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("Missing file field", 400);
  }

  try {
    const origin = new URL(c.req.url).origin;
    const { taskId } = await startAsrTask({ env: c.env, requestOrigin: origin, file });
    return c.json({ taskId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonError(message || "Failed to start ASR", 502);
  }
});

app.get("/asr/:taskId", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return jsonError("Missing DASHSCOPE_API_KEY", 500);
  }
  const taskId = c.req.param("taskId") || "";
  if (!taskId) return jsonError("Missing taskId", 400);

  const debug = c.req.query("debug") === "1";
  const result = await fetchAsrTaskStatus({ env: c.env, taskId });
  if (result.status === "failed") {
    return new Response(JSON.stringify(result.task ?? {}), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (result.status === "succeeded") {
    return c.json({ status: "succeeded", text: result.text, ...(debug ? { task: result.task } : {}) });
  }
  return c.json({ status: "running", ...(debug ? { task: result.task } : {}) });
});

app.post("/tts", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return jsonError("Missing DASHSCOPE_API_KEY", 500);
  }

  const base = (c.env.DASHSCOPE_AIGC_API_BASE || "https://dashscope.aliyuncs.com/api/v1").replace(
    /\/+$/,
    ""
  );
  const url = `${base}/services/aigc/multimodal-generation/generation`;

  let body: unknown = null;
  try {
    body = await c.req.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const upstreamResp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.env.DASHSCOPE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let upstreamJson: unknown = null;
  try {
    upstreamJson = await upstreamResp.json();
  } catch {
    return jsonError("DashScope response is not JSON", 502);
  }

  const record =
    typeof upstreamJson === "object" && upstreamJson !== null
      ? (upstreamJson as Record<string, unknown>)
      : null;
  const upstreamCode = typeof record?.code === "string" ? record.code : "";

  if (!upstreamResp.ok || upstreamCode) {
    return new Response(JSON.stringify(upstreamJson ?? {}), {
      status: upstreamResp.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const output =
    typeof record?.output === "object" && record.output !== null
      ? (record.output as Record<string, unknown>)
      : null;
  const audio =
    typeof output?.audio === "object" && output.audio !== null
      ? (output.audio as Record<string, unknown>)
      : null;

  const audioUrl = typeof audio?.url === "string" ? audio.url.trim() : "";
  const audioData = typeof audio?.data === "string" ? audio.data.trim() : "";

  if (audioData) {
    const bytes = Uint8Array.from(atob(audioData), (ch) => ch.charCodeAt(0));
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
  }

  if (!audioUrl) {
    return new Response(JSON.stringify(upstreamJson), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const normalizedUrl = audioUrl.startsWith("http://")
    ? `https://${audioUrl.slice("http://".length)}`
    : audioUrl;

  const audioResp = await fetch(normalizedUrl);
  if (!audioResp.ok) {
    return jsonError(`Failed to fetch audio: HTTP ${audioResp.status}`, 502);
  }

  const headers = new Headers(audioResp.headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("Access-Control-Allow-Origin");
  headers.delete("Access-Control-Expose-Headers");
  headers.delete("Access-Control-Allow-Credentials");

  return new Response(audioResp.body, {
    status: 200,
    headers,
  });
});

// DashScope compatible-mode currently does not implement `/audio/transcriptions`.
// Provide an OpenAI-shaped endpoint backed by DashScope ASR so frontend can keep using the OpenAI SDK.
app.post("/openai/v1/audio/transcriptions", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return jsonError("Missing DASHSCOPE_API_KEY", 500);
  }

  const contentType = c.req.header("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    return jsonError("Expected multipart/form-data", 415);
  }

  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return jsonError("Invalid multipart body");
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return jsonError("Missing file field", 400);
  }
  const origin = new URL(c.req.url).origin;
  let taskId: string;
  try {
    taskId = (await startAsrTask({ env: c.env, requestOrigin: origin, file })).taskId;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonError(message || "Failed to start ASR", 502);
  }

  // Best-effort sync: poll briefly, otherwise return 202 so callers can switch to `/asr/:taskId`.
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await sleep(500);
    const status = await fetchAsrTaskStatus({ env: c.env, taskId });
    if (status.status === "failed") {
      return new Response(JSON.stringify(status.task ?? {}), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (status.status === "succeeded" && status.text) {
      return c.json({ text: status.text });
    }
  }

  return new Response(JSON.stringify({ taskId, status: "running" }), {
    status: 202,
    headers: { "Content-Type": "application/json" },
  });
});

app.all("/openai/v1/*", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return jsonError("Missing DASHSCOPE_API_KEY", 500);
  }

  const base = (c.env.DASHSCOPE_COMPAT_BASE || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(
    /\/+$/,
    ""
  );

  const incoming = c.req.raw;
  const incomingUrl = new URL(incoming.url);
  const path = incomingUrl.pathname.replace(/^\/openai\/v1/, "");
  const targetUrl = new URL(`${base}${path}${incomingUrl.search}`);

  const headers = new Headers(incoming.headers);
  headers.set("Authorization", `Bearer ${c.env.DASHSCOPE_API_KEY}`);
  headers.delete("host");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("content-length");

  const upstreamResp = await fetch(targetUrl.toString(), {
    method: incoming.method,
    headers,
    body: incoming.body,
    redirect: "manual",
  });

  return new Response(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: upstreamResp.headers,
  });
});

export default app;
