import { Hono } from "hono";
import { applyCors } from "./cors";
import { ApiError, errorResponse } from "./errors";
import { OPENAPI_DOCUMENT } from "./openapi";
import { FirestoreClient, docIdFromName, fv, getStringArrayField, getStringField, getTimestampField } from "./firestore";
import { authenticateFirebaseIdToken, authenticatePat, type PatScope } from "./auth";
import { base64UrlDecodeJson, base64UrlEncodeJson, sha256Hex } from "./crypto";
import {
  buildIdempotencyWrite,
  computeRequestHash,
  idempotencyKeyFromRequest,
  loadIdempotencyRecord,
} from "./idempotency";

type Env = {
  ALLOWED_ORIGINS?: string;
  FIREBASE_PROJECT_ID: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
  TOKEN_PEPPER: string;
};

const app = new Hono<{ Bindings: Env; Variables: { rid: string } }>();

function json(res: unknown, status: number, requestIdHeader: string, extraHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(res), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestIdHeader,
      ...extraHeaders,
    },
  });
}

function parseJsonBody<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseIncludeSenders(value: string | null | undefined): Array<"user" | "ai"> {
  const raw = (value || "user,ai")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  const allowed = raw.filter(s => s === "user" || s === "ai") as Array<"user" | "ai">;
  return allowed.length ? allowed : ["user", "ai"];
}

function requireEnv(env: Env): void {
  const missing: string[] = [];
  if (!env.FIREBASE_PROJECT_ID) missing.push("FIREBASE_PROJECT_ID");
  if (!env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  if (!env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) missing.push("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  if (!env.TOKEN_PEPPER) missing.push("TOKEN_PEPPER");
  if (!missing.length) return;

  throw new ApiError(
    "internal",
    `Missing required env vars: ${missing.join(", ")}. For local dev, set them in workers/app-api/.dev.vars (see docs/logs/2026-01-10-stillroot-api-v1/README.md).`,
    500,
  );
}

app.use("*", async (c, next) => {
  c.set("rid", crypto.randomUUID());
  await next();
});

app.onError((err, c) => {
  const rid = c.get("rid") || crypto.randomUUID();
  const apiErr =
    err instanceof ApiError
      ? err
      : new ApiError("internal", err instanceof Error ? err.message : "Internal error", 500);
  return errorResponse(apiErr, rid);
});

app.notFound(c => {
  const rid = c.get("rid") || crypto.randomUUID();
  return errorResponse(new ApiError("not_found", "Not found", 404), rid);
});

function firestoreFromEnv(env: Env): FirestoreClient {
  return new FirestoreClient({
    firebaseProjectId: env.FIREBASE_PROJECT_ID,
    serviceAccountEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    serviceAccountPrivateKey: env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
  });
}

async function fetchChannelDto(firestore: FirestoreClient, uid: string, channelId: string) {
  const doc = await firestore.getDocument(`users/${uid}/channels/${channelId}`);
  if (!doc || !doc.fields) throw new ApiError("conflict", "Idempotency resource missing", 409);
  return {
    id: channelId,
    name: getStringField(doc.fields, "name"),
    description: getStringField(doc.fields, "description"),
    emoji: getStringField(doc.fields, "emoji") || undefined,
    createdAt: getTimestampField(doc.fields, "createdAt") || new Date().toISOString(),
    updatedAt: getTimestampField(doc.fields, "updatedAt") || undefined,
  };
}

async function fetchMessageDto(firestore: FirestoreClient, uid: string, messageId: string) {
  const doc = await firestore.getDocument(`users/${uid}/messages/${messageId}`);
  if (!doc || !doc.fields) throw new ApiError("conflict", "Idempotency resource missing", 409);
  return {
    id: messageId,
    channelId: getStringField(doc.fields, "channelId"),
    content: getStringField(doc.fields, "content"),
    sender: getStringField(doc.fields, "sender") || "user",
    timestamp: getTimestampField(doc.fields, "timestamp") || new Date().toISOString(),
    tags: getStringArrayField(doc.fields, "tags") ?? undefined,
  };
}

app.options("*", c => {
  const rid = c.get("rid");
  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-Id": rid,
    },
  });
});

app.get("/openapi.json", c => {
  const rid = c.get("rid");
  return json(OPENAPI_DOCUMENT, 200, rid, { "Cache-Control": "public, max-age=300" });
});

app.get("/v1/channels", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticatePat({
    req: c.req.raw,
    firestore,
    tokenPepper: c.env.TOKEN_PEPPER,
    requiredScope: "notes:read",
    ctx: c.executionCtx,
  });

  const docs = await firestore.runQuery(`users/${auth.uid}`, {
    from: [{ collectionId: "channels" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "isDeleted" },
        op: "EQUAL",
        value: { booleanValue: false },
      },
    },
    orderBy: [{ field: { fieldPath: "lastMessageTime" }, direction: "DESCENDING" }],
  });

  const items = docs.map(d => {
    const id = docIdFromName(d.name);
    const fields = d.fields ?? {};
    return {
      id,
      name: getStringField(fields, "name"),
      description: getStringField(fields, "description"),
      emoji: getStringField(fields, "emoji") || undefined,
      createdAt: getTimestampField(fields, "createdAt") || new Date().toISOString(),
      updatedAt: getTimestampField(fields, "updatedAt") || undefined,
    };
  });

  return json({ items }, 200, rid);
});

app.post("/v1/channels", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticatePat({
    req: c.req.raw,
    firestore,
    tokenPepper: c.env.TOKEN_PEPPER,
    requiredScope: "notes:write",
    ctx: c.executionCtx,
  });

  const body = await parseJsonBody<Record<string, unknown>>(c.req.raw);
  const name = asString(body.name).trim();
  if (!name) throw new ApiError("invalid_request", "name is required", 400);
  const description = asString(body.description);
  const emoji = asString(body.emoji) || undefined;

  const idemKey = await idempotencyKeyFromRequest(c.req.raw);
  const requestHash = idemKey
    ? await computeRequestHash({
        uid: auth.uid,
        method: "POST",
        path: "/v1/channels",
        body: { name, description, emoji },
      })
    : "";

  if (idemKey) {
    const record = await loadIdempotencyRecord({ firestore, uid: auth.uid, key: idemKey, requestHash });
    if (record) {
      const channel = await fetchChannelDto(firestore, auth.uid, record.resourceId);
      return json({ channel }, record.status, rid);
    }
  }

  const channelId = crypto.randomUUID();
  const channelPath = `users/${auth.uid}/channels/${channelId}`;
  const idempotencyWrite = idemKey
    ? await buildIdempotencyWrite({
        firestore,
        uid: auth.uid,
        key: idemKey,
        requestHash,
        status: 201,
        resourceType: "channel",
        resourceId: channelId,
      })
    : null;

  const writes: unknown[] = [
    ...(idempotencyWrite ? [idempotencyWrite] : []),
    {
      update: {
        name: firestore.documentName(channelPath),
        fields: {
          name: fv.str(name),
          description: fv.str(description),
          ...(emoji ? { emoji: fv.str(emoji) } : {}),
          messageCount: fv.int(0),
          isDeleted: fv.bool(false),
        },
      },
      currentDocument: { exists: false },
      updateTransforms: [
        { fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" },
        { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
        { fieldPath: "lastMessageTime", setToServerValue: "REQUEST_TIME" },
      ],
    },
  ];

  try {
    await firestore.commit(writes);
  } catch (err) {
    if (idemKey) {
      const record = await loadIdempotencyRecord({ firestore, uid: auth.uid, key: idemKey, requestHash });
      if (record) {
        const channel = await fetchChannelDto(firestore, auth.uid, record.resourceId);
        return json({ channel }, record.status, rid);
      }
    }
    throw err;
  }

  const channel = await fetchChannelDto(firestore, auth.uid, channelId);
  return json({ channel }, 201, rid);
});

app.get("/v1/messages", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticatePat({
    req: c.req.raw,
    firestore,
    tokenPepper: c.env.TOKEN_PEPPER,
    requiredScope: "notes:read",
    ctx: c.executionCtx,
  });

  const channelId = c.req.query("channelId") || "";
  if (!channelId.trim()) throw new ApiError("invalid_request", "channelId is required", 400);
  const limitRaw = c.req.query("limit");
  const limit = Math.min(200, Math.max(1, Number(limitRaw || 50)));
  const includeSenders = parseIncludeSenders(c.req.query("includeSenders"));
  const cursor = c.req.query("cursor");

  const orderBy = [
    { field: { fieldPath: "timestamp" }, direction: "DESCENDING" },
    { field: { fieldPath: "__name__" }, direction: "DESCENDING" },
  ];

  const whereFilters: unknown[] = [
    {
      fieldFilter: {
        field: { fieldPath: "isDeleted" },
        op: "EQUAL",
        value: { booleanValue: false },
      },
    },
    {
      fieldFilter: {
        field: { fieldPath: "channelId" },
        op: "EQUAL",
        value: { stringValue: channelId },
      },
    },
  ];

  if (includeSenders.length === 1) {
    whereFilters.push({
      fieldFilter: {
        field: { fieldPath: "sender" },
        op: "EQUAL",
        value: { stringValue: includeSenders[0] },
      },
    });
  }

  const startAt = cursor
    ? (() => {
        const decoded = base64UrlDecodeJson<{ ts: string; id: string }>(cursor);
        if (!decoded?.ts || !decoded?.id) throw new ApiError("invalid_request", "Invalid cursor", 400);
        return {
          before: false,
          values: [
            { timestampValue: decoded.ts },
            { referenceValue: firestore.documentName(`users/${auth.uid}/messages/${decoded.id}`) },
          ],
        };
      })()
    : undefined;

  const docs = await firestore.runQuery(`users/${auth.uid}`, {
    from: [{ collectionId: "messages" }],
    where: { compositeFilter: { op: "AND", filters: whereFilters } },
    orderBy,
    ...(startAt ? { startAt } : {}),
    limit: limit + 1,
  });

  const sliced = docs.slice(0, limit);
  const hasMore = docs.length > limit;
  const items = sliced.map(d => {
    const id = docIdFromName(d.name);
    const fields = d.fields ?? {};
    return {
      id,
      channelId: getStringField(fields, "channelId"),
      content: getStringField(fields, "content"),
      sender: getStringField(fields, "sender") || "user",
      timestamp: getTimestampField(fields, "timestamp") || new Date().toISOString(),
      tags: getStringArrayField(fields, "tags") ?? undefined,
    };
  });

  const nextCursor =
    hasMore && items.length
      ? base64UrlEncodeJson({ ts: items[items.length - 1].timestamp, id: items[items.length - 1].id })
      : null;

  return json({ items, nextCursor }, 200, rid);
});

app.post("/v1/messages", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticatePat({
    req: c.req.raw,
    firestore,
    tokenPepper: c.env.TOKEN_PEPPER,
    requiredScope: "notes:write",
    ctx: c.executionCtx,
  });

  const body = await parseJsonBody<Record<string, unknown>>(c.req.raw);
  const channelId = asString(body.channelId).trim();
  const content = asString(body.content).trim();
  const sender = asString(body.sender) === "ai" ? "ai" : "user";
  const tags = Array.isArray(body.tags) ? body.tags.filter(t => typeof t === "string") : undefined;

  if (!channelId) throw new ApiError("invalid_request", "channelId is required", 400);
  if (!content) throw new ApiError("invalid_request", "content is required", 400);

  const idemKey = await idempotencyKeyFromRequest(c.req.raw);
  const requestHash = idemKey
    ? await computeRequestHash({
        uid: auth.uid,
        method: "POST",
        path: "/v1/messages",
        body: { channelId, content, sender, tags },
      })
    : "";

  if (idemKey) {
    const record = await loadIdempotencyRecord({ firestore, uid: auth.uid, key: idemKey, requestHash });
    if (record) {
      const message = await fetchMessageDto(firestore, auth.uid, record.resourceId);
      return json({ message }, record.status, rid);
    }
  }

  const messageId = crypto.randomUUID();
  const messagePath = `users/${auth.uid}/messages/${messageId}`;
  const channelPath = `users/${auth.uid}/channels/${channelId}`;
  const idempotencyWrite = idemKey
    ? await buildIdempotencyWrite({
        firestore,
        uid: auth.uid,
        key: idemKey,
        requestHash,
        status: 201,
        resourceType: "message",
        resourceId: messageId,
      })
    : null;

  const messageFields = {
    channelId: fv.str(channelId),
    content: fv.str(content),
    sender: fv.str(sender),
    isDeleted: fv.bool(false),
    ...(tags?.length ? { tags: fv.arr(tags.map(t => fv.str(t))) } : {}),
  };

  const writes: unknown[] = [
    ...(idempotencyWrite ? [idempotencyWrite] : []),
    {
      update: {
        name: firestore.documentName(messagePath),
        fields: messageFields,
      },
      currentDocument: { exists: false },
      updateTransforms: [{ fieldPath: "timestamp", setToServerValue: "REQUEST_TIME" }],
    },
    {
      update: {
        name: firestore.documentName(channelPath),
        fields: {},
      },
      currentDocument: { exists: true },
      updateTransforms: [
        { fieldPath: "lastMessageTime", setToServerValue: "REQUEST_TIME" },
        { fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" },
        { fieldPath: "messageCount", increment: { integerValue: "1" } },
      ],
    },
  ];

  try {
    await firestore.commit(writes);
  } catch (err) {
    if (idemKey) {
      const record = await loadIdempotencyRecord({ firestore, uid: auth.uid, key: idemKey, requestHash });
      if (record) {
        const message = await fetchMessageDto(firestore, auth.uid, record.resourceId);
        return json({ message }, record.status, rid);
      }
    }
    throw err;
  }

  const message = await fetchMessageDto(firestore, auth.uid, messageId);
  return json({ message }, 201, rid);
});

app.get("/v1/pats", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticateFirebaseIdToken({
    req: c.req.raw,
    firebaseProjectId: c.env.FIREBASE_PROJECT_ID,
  });

  const docs = await firestore.runQuery(`users/${auth.uid}`, {
    from: [{ collectionId: "pats" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "revokedAt" },
        op: "EQUAL",
        value: { nullValue: null },
      },
    },
    orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }],
  });

  const items = docs.map(d => {
    const id = docIdFromName(d.name);
    const fields = d.fields ?? {};
    return {
      id,
      name: getStringField(fields, "name"),
      prefix: getStringField(fields, "prefix"),
      scopes: (getStringArrayField(fields, "scopes") ?? []) as PatScope[],
      createdAt: getTimestampField(fields, "createdAt") || new Date().toISOString(),
      expiresAt: getTimestampField(fields, "expiresAt") ?? null,
      lastUsedAt: getTimestampField(fields, "lastUsedAt") ?? null,
    };
  });

  return json({ items }, 200, rid);
});

app.post("/v1/pats", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticateFirebaseIdToken({
    req: c.req.raw,
    firebaseProjectId: c.env.FIREBASE_PROJECT_ID,
  });

  const body = await parseJsonBody<Record<string, unknown>>(c.req.raw);
  const name = asString(body.name).trim();
  if (!name) throw new ApiError("invalid_request", "name is required", 400);
  const scopesRaw = Array.isArray(body.scopes) ? body.scopes : [];
  const scopes = scopesRaw.filter(s => s === "notes:read" || s === "notes:write") as PatScope[];
  if (!scopes.length) throw new ApiError("invalid_request", "scopes is required", 400);

  const expiresAtRaw = asString(body.expiresAt).trim();
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw).toISOString() : null;

  const tokenSecret = `sr_pat_${crypto.randomUUID().replace(/-/g, "")}${crypto.randomUUID().replace(/-/g, "")}`;
  const tokenId = await sha256Hex(`${tokenSecret}:${c.env.TOKEN_PEPPER}`);
  const patId = crypto.randomUUID();
  const prefix = tokenSecret.slice(0, 12);

  const globalPath = `pat_tokens/${tokenId}`;
  const userPath = `users/${auth.uid}/pats/${patId}`;

  const fields = {
    uid: fv.str(auth.uid),
    patId: fv.str(patId),
    name: fv.str(name),
    prefix: fv.str(prefix),
    scopes: fv.arr(scopes.map(s => fv.str(s))),
    lastUsedAt: fv.null(),
    revokedAt: fv.null(),
    ...(expiresAt ? { expiresAt: fv.ts(expiresAt) } : { expiresAt: fv.null() }),
  };

  const writes: unknown[] = [
    {
      update: { name: firestore.documentName(globalPath), fields },
      currentDocument: { exists: false },
      updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
    },
    {
      update: { name: firestore.documentName(userPath), fields: { ...fields, tokenId: fv.str(tokenId) } },
      currentDocument: { exists: false },
      updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
    },
  ];

  const commit = await firestore.commit(writes);
  const pat = {
    id: patId,
    name,
    prefix,
    scopes,
    createdAt: commit.commitTime,
    expiresAt,
    lastUsedAt: null,
  };

  return json({ pat, token: tokenSecret }, 201, rid);
});

app.delete("/v1/pats/:patId", async c => {
  const rid = c.get("rid");
  requireEnv(c.env);
  const firestore = firestoreFromEnv(c.env);
  const auth = await authenticateFirebaseIdToken({
    req: c.req.raw,
    firebaseProjectId: c.env.FIREBASE_PROJECT_ID,
  });
  const patId = c.req.param("patId");
  if (!patId) throw new ApiError("invalid_request", "patId is required", 400);

  const userDoc = await firestore.getDocument(`users/${auth.uid}/pats/${patId}`);
  if (!userDoc || !userDoc.fields) throw new ApiError("not_found", "PAT not found", 404);
  const tokenId = getStringField(userDoc.fields, "tokenId");
  if (!tokenId) throw new ApiError("internal", "PAT tokenId missing", 500);

  const writes: unknown[] = [
    {
      update: { name: firestore.documentName(`users/${auth.uid}/pats/${patId}`), fields: {} },
      currentDocument: { exists: true },
      updateTransforms: [{ fieldPath: "revokedAt", setToServerValue: "REQUEST_TIME" }],
    },
    {
      update: { name: firestore.documentName(`pat_tokens/${tokenId}`), fields: {} },
      currentDocument: { exists: true },
      updateTransforms: [{ fieldPath: "revokedAt", setToServerValue: "REQUEST_TIME" }],
    },
  ];
  await firestore.commit(writes);

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
      "X-Request-Id": rid,
    },
  });
});

export default {
  fetch(req: Request, env: Env, ctx: ExecutionContext) {
    return Promise.resolve(app.fetch(req, env, ctx)).then((res: Response) =>
      applyCors(req, res, env.ALLOWED_ORIGINS)
    );
  },
};
