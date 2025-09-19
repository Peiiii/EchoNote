import type { UIMessage } from '@agent-labs/agent-chat'

// Deep-sanitize arbitrary values so they are Firestore-safe (no functions/undefined/cycles)
function sanitizeValue(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value === null) return null;
  const t = typeof value;
  if (t === 'string' || t === 'number' || t === 'boolean') return value;
  if (t === 'bigint') return Number(value);
  if (t === 'symbol' || t === 'function' || t === 'undefined') return undefined;

  if (Array.isArray(value)) {
    const arr = value
      .map(v => sanitizeValue(v, seen))
      .filter(v => v !== undefined);
    return arr;
  }

  if (t === 'object') {
    const obj = value as Record<string, unknown>;
    if (seen.has(obj)) return undefined; // drop cyclic refs
    seen.add(obj);
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const sv = sanitizeValue(v, seen);
      if (sv !== undefined) out[k] = sv;
    }
    seen.delete(obj);
    return out;
  }

  return undefined;
}

// Keep only fields we actually use/render from a UIMessage
export function sanitizeUIMessageForPersistence(message: UIMessage) {
  return {
    id: message.id,
    role: message.role,
    // parts may contain tool invocation structures; sanitize to primitives only
    parts: sanitizeValue(message.parts),
  } as { id: string; role: UIMessage['role']; parts: unknown };
}

// Produce a stable hash string for change detection without throwing on complex parts
export function safeHashMessage(message: UIMessage): string {
  try {
    const core = {
      role: message.role,
      parts: sanitizeValue(message.parts),
    };
    return JSON.stringify(core);
  } catch (_e) {
    // As a last resort, fall back to role + id to avoid breaking the pipeline
    return `${message.role}:${message.id}`;
  }
}

