import { AgentEvent } from "@agent-labs/agent-chat";

export class EventEncoder {
  constructor() {}

  encode(event: AgentEvent): string {
    return this.encodeSSE(event);
  }

  encodeSSE(event: AgentEvent): string {
    return `data: ${JSON.stringify(event)}\n\n`;
  }
}
