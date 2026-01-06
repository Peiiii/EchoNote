import { Hono } from "hono";

type Env = {
  DASHSCOPE_API_KEY: string;
  ALLOWED_ORIGINS?: string;
  DASHSCOPE_AIGC_API_BASE?: string;
  DASHSCOPE_COMPAT_BASE?: string;
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

app.post("/tts", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return withCorsHeaders(c.req.raw, jsonError("Missing DASHSCOPE_API_KEY", 500), c.env);
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
    return withCorsHeaders(c.req.raw, jsonError("Invalid JSON body"), c.env);
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
    const res = jsonError("DashScope response is not JSON", 502);
    return withCorsHeaders(c.req.raw, res, c.env);
  }

  const record =
    typeof upstreamJson === "object" && upstreamJson !== null
      ? (upstreamJson as Record<string, unknown>)
      : null;
  const upstreamCode = typeof record?.code === "string" ? record.code : "";

  if (!upstreamResp.ok || upstreamCode) {
    const res = new Response(JSON.stringify(upstreamJson ?? {}), {
      status: upstreamResp.status,
      headers: { "Content-Type": "application/json" },
    });
    return withCorsHeaders(c.req.raw, res, c.env);
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
    const res = new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
      },
    });
    return withCorsHeaders(c.req.raw, res, c.env);
  }

  if (!audioUrl) {
    const res = new Response(JSON.stringify(upstreamJson), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
    return withCorsHeaders(c.req.raw, res, c.env);
  }

  const normalizedUrl = audioUrl.startsWith("http://")
    ? `https://${audioUrl.slice("http://".length)}`
    : audioUrl;

  const audioResp = await fetch(normalizedUrl);
  if (!audioResp.ok) {
    const res = jsonError(`Failed to fetch audio: HTTP ${audioResp.status}`, 502);
    return withCorsHeaders(c.req.raw, res, c.env);
  }

  const headers = new Headers(audioResp.headers);
  headers.set("Cache-Control", "no-store");
  headers.delete("Access-Control-Allow-Origin");
  headers.delete("Access-Control-Expose-Headers");
  headers.delete("Access-Control-Allow-Credentials");

  const res = new Response(audioResp.body, {
    status: 200,
    headers,
  });
  return withCorsHeaders(c.req.raw, res, c.env);
});

app.all("/openai/v1/*", async (c) => {
  if (!c.env.DASHSCOPE_API_KEY) {
    return withCorsHeaders(c.req.raw, jsonError("Missing DASHSCOPE_API_KEY", 500), c.env);
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

  const res = new Response(upstreamResp.body, {
    status: upstreamResp.status,
    statusText: upstreamResp.statusText,
    headers: upstreamResp.headers,
  });
  return withCorsHeaders(c.req.raw, res, c.env);
});

export default app;
