import { SignJWT, importPKCS8 } from "jose";

type AccessTokenCache = {
  token: string;
  expiresAtMs: number;
};

let cache: AccessTokenCache | null = null;

export async function getGoogleAccessToken(options: {
  serviceAccountEmail: string;
  serviceAccountPrivateKeyPem: string;
}): Promise<string> {
  const now = Date.now();
  if (cache && cache.expiresAtMs - 60_000 > now) return cache.token;

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const scope = "https://www.googleapis.com/auth/datastore";
  const iat = Math.floor(now / 1000);
  const exp = iat + 3600;

  const privateKey = await importPKCS8(normalizePem(options.serviceAccountPrivateKeyPem), "RS256");
  const assertion = await new SignJWT({ scope })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(options.serviceAccountEmail)
    .setSubject(options.serviceAccountEmail)
    .setAudience(tokenUrl)
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(privateKey);

  const body = new URLSearchParams();
  body.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  body.set("assertion", assertion);

  const resp = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    throw new Error(`Failed to get Google access token (${resp.status}): ${text}`);
  }
  const json = (await resp.json()) as { access_token: string; expires_in: number };
  const token = json.access_token;
  const expiresIn = Math.max(0, json.expires_in || 0);
  cache = { token, expiresAtMs: now + expiresIn * 1000 };
  return token;
}

function normalizePem(pem: string): string {
  const trimmed = (pem || "").trim();
  if (!trimmed) return "";
  // Wrangler secrets often store newlines escaped as "\n".
  return trimmed.includes("\\n") ? trimmed.replace(/\\n/g, "\n") : trimmed;
}

