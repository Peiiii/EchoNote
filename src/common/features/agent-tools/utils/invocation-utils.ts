import type { ToolInvocation } from '@agent-labs/agent-chat';
// no react hooks here after ToolPanel adoption

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getParsedArgs<Args>(invocation: ToolInvocation<Args, any>): Partial<Args> | null {
  try {
    if (invocation.parsedArgs) return invocation.parsedArgs as Partial<Args>;
    const raw = invocation.args as unknown;
    if (typeof raw === 'string') return JSON.parse(raw) as Partial<Args>;
    if (raw && typeof raw === 'object') return raw as Partial<Args>;
    return null;
  } catch (_err) {
    return null;
  }
}

// Simple local collapsible state shared by many tool UIs
// (intentionally left without hooks; ToolPanel now manages collapsible state)
