import { firebaseConfig } from "@/common/config/firebase.config";

export type PatScope = "notes:read" | "notes:write";

export type PatMeta = {
  id: string;
  name: string;
  prefix: string;
  scopes: PatScope[];
  createdAt: string;
  expiresAt: string | null;
  lastUsedAt: string | null;
};

export type CreatePatRequest = {
  name: string;
  scopes: PatScope[];
  expiresAt: string | null;
};

export type CreatePatResponse = {
  pat: PatMeta;
  token: string;
};

type ApiErrorResponse = {
  error?: { code?: string; message?: string };
};

export function apiBase(): string {
  const configured = import.meta.env.VITE_APP_API_BASE as string | undefined;
  if (configured && configured.trim()) return configured;
  if (import.meta.env.DEV) return "http://localhost:8787";
  return "https://api.stillroot.app";
}

export type AgentHandoffConfig = {
  baseUrl: string;
  openapiUrl: string;
  token: string;
  scopes: PatScope[];
  expiresAt: string | null;
};

export function buildAgentHandoffText(cfg: AgentHandoffConfig): string {
  const payload = {
    stillroot: {
      baseUrl: cfg.baseUrl,
      openapiUrl: cfg.openapiUrl,
      token: cfg.token,
      scopes: cfg.scopes,
      expiresAt: cfg.expiresAt,
    },
  };

  return [
    "你现在可以通过 StillRoot API 访问我的笔记。",
    "",
    "规则：",
    "- 所有请求都要带 Authorization: Bearer <token>",
    "- 先 GET /v1/channels 选择一个 channelId",
    "- messages 必须携带 channelId（查询参数/请求体都要；响应也会返回 channelId）",
    "- 接口规范在 openapiUrl（优先按 OpenAPI 生成调用）",
    "",
    "配置（JSON）：",
    JSON.stringify(payload, null, 2),
  ].join("\n");
}

async function requireFirebaseIdToken(): Promise<string> {
  const auth = firebaseConfig.getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Please sign in to manage API tokens.");
  }
  // Enforce verified-only to reduce abuse and match existing cloud mode semantics.
  if (!user.emailVerified) {
    throw new Error("Please verify your email before creating API tokens.");
  }
  return await user.getIdToken();
}

async function apiFetch(path: string, init: RequestInit): Promise<Response> {
  const token = await requireFirebaseIdToken();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return fetch(`${apiBase()}${path}`, { ...init, headers });
}

async function parseApiError(res: Response): Promise<string> {
  try {
    const json = (await res.json()) as ApiErrorResponse;
    const msg = json?.error?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  } catch {
    // ignore
  }
  return `Request failed (${res.status})`;
}

export class ApiAccessManager {
  async listPats(): Promise<{ items: PatMeta[] }> {
    const res = await apiFetch("/v1/pats", { method: "GET" });
    if (!res.ok) throw new Error(await parseApiError(res));
    return (await res.json()) as { items: PatMeta[] };
  }

  async createPat(req: CreatePatRequest): Promise<CreatePatResponse> {
    const res = await apiFetch("/v1/pats", { method: "POST", body: JSON.stringify(req) });
    if (!res.ok) throw new Error(await parseApiError(res));
    return (await res.json()) as CreatePatResponse;
  }

  async revokePat(patId: string): Promise<void> {
    const res = await apiFetch(`/v1/pats/${encodeURIComponent(patId)}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(await parseApiError(res));
  }
}
