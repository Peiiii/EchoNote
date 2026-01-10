import { ApiError } from "./errors";
import { sha256Hex } from "./crypto";
import { FirestoreClient, getStringField } from "./firestore";

export async function idempotencyKeyFromRequest(req: Request): Promise<string | null> {
  const v = req.headers.get("Idempotency-Key") || "";
  const key = v.trim();
  return key ? key : null;
}

export async function computeRequestHash(input: {
  uid: string;
  method: string;
  path: string;
  body: unknown;
}): Promise<string> {
  return sha256Hex(JSON.stringify(input));
}

export type IdempotencyRecord = {
  status: number;
  resourceType: "channel" | "message";
  resourceId: string;
};

export async function loadIdempotencyRecord(options: {
  firestore: FirestoreClient;
  uid: string;
  key: string;
  requestHash: string;
}): Promise<IdempotencyRecord | null> {
  const docId = await sha256Hex(`${options.uid}:${options.key}`);
  const doc = await options.firestore.getDocument(`idempotency/${docId}`);
  if (!doc || !doc.fields) return null;
  const storedHash = getStringField(doc.fields, "requestHash");
  if (storedHash && storedHash !== options.requestHash) {
    throw new ApiError("conflict", "Idempotency-Key reused with different payload", 409);
  }
  const statusRaw = getStringField(doc.fields, "status") || "";
  const status = Number(statusRaw) || 0;
  const resourceType = getStringField(doc.fields, "resourceType") as IdempotencyRecord["resourceType"];
  const resourceId = getStringField(doc.fields, "resourceId");
  if (!status || (resourceType !== "channel" && resourceType !== "message") || !resourceId) {
    throw new ApiError("conflict", "Idempotency state incomplete", 409);
  }
  return { status, resourceType, resourceId };
}

export async function buildIdempotencyWrite(options: {
  firestore: FirestoreClient;
  uid: string;
  key: string;
  requestHash: string;
  status: number;
  resourceType: IdempotencyRecord["resourceType"];
  resourceId: string;
}): Promise<unknown> {
  const docId = await sha256Hex(`${options.uid}:${options.key}`);
  const path = `idempotency/${docId}`;
  return {
    update: {
      name: options.firestore.documentName(path),
      fields: {
        uid: { stringValue: options.uid },
        key: { stringValue: options.key },
        requestHash: { stringValue: options.requestHash },
        status: { stringValue: String(options.status) },
        resourceType: { stringValue: options.resourceType },
        resourceId: { stringValue: options.resourceId },
      },
    },
    currentDocument: { exists: false },
    updateTransforms: [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }],
  };
}
