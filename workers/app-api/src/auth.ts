import { createRemoteJWKSet, jwtVerify } from "jose";
import { ApiError } from "./errors";
import { sha256Hex } from "./crypto";
import { FirestoreClient, getStringArrayField, getStringField, getTimestampField } from "./firestore";

export type PatScope = "notes:read" | "notes:write";

export type PatAuthContext = {
  uid: string;
  scopes: PatScope[];
  patId: string;
  tokenId: string;
};

function bearerToken(req: Request): string | null {
  const header = req.headers.get("Authorization") || "";
  const m = header.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() || null;
}

function requireBearer(req: Request): string {
  const token = bearerToken(req);
  if (!token) throw new ApiError("unauthorized", "Missing Authorization bearer token", 401);
  return token;
}

export async function authenticateFirebaseIdToken(options: {
  req: Request;
  firebaseProjectId: string;
}): Promise<{ uid: string }> {
  const token = requireBearer(options.req);
  const issuer = `https://securetoken.google.com/${options.firebaseProjectId}`;
  const jwks = createRemoteJWKSet(
    new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
  );

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience: options.firebaseProjectId,
    });
    const uid = typeof payload.user_id === "string" ? payload.user_id : typeof payload.sub === "string" ? payload.sub : "";
    if (!uid) throw new ApiError("unauthorized", "Invalid Firebase token (missing uid)", 401);
    return { uid };
  } catch {
    throw new ApiError("unauthorized", "Invalid Firebase ID token", 401);
  }
}

export async function authenticatePat(options: {
  req: Request;
  firestore: FirestoreClient;
  tokenPepper: string;
  requiredScope: PatScope;
  ctx: ExecutionContext;
}): Promise<PatAuthContext> {
  const token = requireBearer(options.req);
  if (!token.startsWith("sr_pat_")) throw new ApiError("unauthorized", "Invalid token", 401);
  const tokenId = await sha256Hex(`${token}:${options.tokenPepper}`);
  const tokenDocPath = `pat_tokens/${tokenId}`;
  const doc = await options.firestore.getDocument(tokenDocPath);
  if (!doc || !doc.fields) throw new ApiError("unauthorized", "Invalid token", 401);

  const uid = getStringField(doc.fields, "uid");
  const patId = getStringField(doc.fields, "patId");
  const scopes = (getStringArrayField(doc.fields, "scopes") ?? []) as PatScope[];
  const revokedAt = getTimestampField(doc.fields, "revokedAt");
  const expiresAt = getTimestampField(doc.fields, "expiresAt");

  if (!uid || !patId) throw new ApiError("unauthorized", "Invalid token", 401);
  if (revokedAt) throw new ApiError("unauthorized", "Token revoked", 401);
  if (expiresAt && Date.parse(expiresAt) <= Date.now()) throw new ApiError("unauthorized", "Token expired", 401);
  if (!scopes.includes(options.requiredScope)) throw new ApiError("forbidden", "Insufficient scope", 403);

  options.ctx.waitUntil(
    options.firestore.commit([
      {
        transform: {
          document: options.firestore.documentName(tokenDocPath),
          fieldTransforms: [{ fieldPath: "lastUsedAt", setToServerValue: "REQUEST_TIME" }],
        },
        currentDocument: { exists: true },
      },
      {
        transform: {
          document: options.firestore.documentName(`users/${uid}/pats/${patId}`),
          fieldTransforms: [{ fieldPath: "lastUsedAt", setToServerValue: "REQUEST_TIME" }],
        },
        currentDocument: { exists: true },
      },
    ])
  );

  return { uid, scopes, patId, tokenId };
}
