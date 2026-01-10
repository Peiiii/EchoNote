import { ApiError } from "./errors";
import { getGoogleAccessToken } from "./google-auth";

type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { referenceValue: string };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

type RunQueryResponse = {
  document?: FirestoreDocument;
};

type EnvAuth = {
  firebaseProjectId: string;
  serviceAccountEmail: string;
  serviceAccountPrivateKey: string;
};

export class FirestoreClient {
  private readonly projectId: string;
  private readonly serviceAccountEmail: string;
  private readonly serviceAccountPrivateKey: string;

  constructor(env: EnvAuth) {
    this.projectId = env.firebaseProjectId;
    this.serviceAccountEmail = env.serviceAccountEmail;
    this.serviceAccountPrivateKey = env.serviceAccountPrivateKey;
  }

  docBase(): string {
    return `projects/${this.projectId}/databases/(default)/documents`;
  }

  documentName(path: string): string {
    return `${this.docBase()}/${path.replace(/^\/+/, "")}`;
  }

  async getDocument(path: string): Promise<FirestoreDocument | null> {
    const url = `https://firestore.googleapis.com/v1/${this.documentName(path)}`;
    const res = await this.authedFetch(url, { method: "GET" });
    if (res.status === 404) return null;
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Firestore get failed (${res.status}): ${text}`);
    }
    return (await res.json()) as FirestoreDocument;
  }

  async runQuery(parentPath: string, structuredQuery: unknown): Promise<FirestoreDocument[]> {
    const url = `https://firestore.googleapis.com/v1/${this.documentName(parentPath)}:runQuery`;
    const res = await this.authedFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ structuredQuery }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Firestore runQuery failed (${res.status}): ${text}`);
    }
    const rows = (await res.json()) as RunQueryResponse[];
    return rows.map(r => r.document).filter((d): d is FirestoreDocument => !!d);
  }

  async commit(writes: unknown[]): Promise<{ commitTime: string }> {
    const url = `https://firestore.googleapis.com/v1/projects/${this.projectId}/databases/(default)/documents:commit`;
    const res = await this.authedFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ writes }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Firestore commit failed (${res.status}): ${text}`);
    }
    const json = (await res.json()) as { commitTime: string };
    return { commitTime: json.commitTime };
  }

  async createDocument(path: string, fields: Record<string, FirestoreValue>): Promise<void> {
    const writes = [
      {
        update: { name: this.documentName(path), fields },
        currentDocument: { exists: false },
      },
    ];
    await this.commit(writes);
  }

  async updateDocument(
    path: string,
    fields: Record<string, FirestoreValue>,
    transforms?: unknown[],
    options?: { requireExists?: boolean }
  ): Promise<void> {
    const writes = [
      {
        update: { name: this.documentName(path), fields },
        currentDocument: { exists: options?.requireExists ?? true },
        updateTransforms: transforms,
      },
    ];
    await this.commit(writes);
  }

  private async authedFetch(url: string, init: RequestInit): Promise<Response> {
    const accessToken = await getGoogleAccessToken({
      serviceAccountEmail: this.serviceAccountEmail,
      serviceAccountPrivateKeyPem: this.serviceAccountPrivateKey,
    });
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(url, { ...init, headers });
  }
}

export const fv = {
  null(): FirestoreValue {
    return { nullValue: null };
  },
  bool(v: boolean): FirestoreValue {
    return { booleanValue: v };
  },
  int(v: number): FirestoreValue {
    return { integerValue: String(Math.trunc(v)) };
  },
  str(v: string): FirestoreValue {
    return { stringValue: v };
  },
  ts(v: string): FirestoreValue {
    return { timestampValue: v };
  },
  arr(values: FirestoreValue[]): FirestoreValue {
    return { arrayValue: { values } };
  },
  ref(docName: string): FirestoreValue {
    return { referenceValue: docName };
  },
};

export function docIdFromName(docName: string): string {
  const parts = docName.split("/");
  return parts[parts.length - 1] || "";
}

export function getStringField(fields: Record<string, FirestoreValue> | undefined, key: string): string {
  const v = fields?.[key] as { stringValue?: string } | undefined;
  return typeof v?.stringValue === "string" ? v.stringValue : "";
}

export function getTimestampField(
  fields: Record<string, FirestoreValue> | undefined,
  key: string
): string | undefined {
  const v = fields?.[key] as { timestampValue?: string } | undefined;
  return typeof v?.timestampValue === "string" ? v.timestampValue : undefined;
}

export function getStringArrayField(
  fields: Record<string, FirestoreValue> | undefined,
  key: string
): string[] | undefined {
  const v = fields?.[key] as { arrayValue?: { values?: Array<{ stringValue?: string }> } } | undefined;
  const values = v?.arrayValue?.values;
  if (!Array.isArray(values)) return undefined;
  return values.map(x => x.stringValue).filter((s): s is string => typeof s === "string");
}

export function toApiError(e: unknown): ApiError {
  const message = e instanceof Error ? e.message : "Unknown error";
  return new ApiError("internal", message, 500);
}

