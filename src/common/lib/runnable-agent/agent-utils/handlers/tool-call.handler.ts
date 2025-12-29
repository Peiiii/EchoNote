import {
  EventType,
  ToolCallArgsDeltaEvent,
  ToolCallEndEvent,
  ToolCallStartEvent,
} from "@agent-labs/agent-chat";
import OpenAI from "openai";
import { EventEncoder } from "../encoder";
import { StreamContext, StreamHandler } from "../types";

export class ToolCallHandler implements StreamHandler {
  constructor(private encoder: EventEncoder) {}

  async *handle(
    chunk: OpenAI.Chat.Completions.ChatCompletionChunk,
    context: StreamContext
  ): AsyncGenerator<string, void, unknown> {
    const toolCall = chunk.choices[0].delta.tool_calls?.[0];
    if (!toolCall) {
      return;
    }

    if (!context.isToolCallStarted) {
      context.toolCallId = toolCall.id ?? "";
      context.toolCallName = toolCall.function?.name ?? "";
      context.isToolCallStarted = true;

      const event: ToolCallStartEvent = {
        type: EventType.TOOL_CALL_START,
        toolCallId: context.toolCallId,
        toolName: context.toolCallName,
      };
      yield this.encoder.encode(event);
    }

    if (toolCall.function?.arguments) {
      context.toolCallArgs += toolCall.function.arguments;
      const event: ToolCallArgsDeltaEvent = {
        type: EventType.TOOL_CALL_ARGS_DELTA,
        toolCallId: context.toolCallId,
        argsDelta: toolCall.function.arguments,
      };
      yield this.encoder.encode(event);
    }
  }

  async *finalize(context: StreamContext): AsyncGenerator<string, void, unknown> {
    if (context.isToolCallStarted) {
      const event: ToolCallEndEvent = {
        type: EventType.TOOL_CALL_END,
        toolCallId: context.toolCallId,
      };
      yield this.encoder.encode(event);
    }
  }
}
