function parseAllowedOrigins(value: string | undefined): string[] {
  return (value || "")
    .split(",")
    .map(s => s.trim())
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

export function applyCors(req: Request, res: Response, allowedOriginsEnv: string | undefined): Response {
  const origin = req.headers.get("Origin") || "";
  const allowed = parseAllowedOrigins(allowedOriginsEnv);
  const headers = new Headers(res.headers);

  if (origin && isOriginAllowed(origin, allowed)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type, Idempotency-Key");
    headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    headers.set("Access-Control-Expose-Headers", "X-Request-Id");
  }

  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

