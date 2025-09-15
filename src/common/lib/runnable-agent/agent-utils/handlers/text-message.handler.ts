import { EventType, TextDeltaEvent, TextEndEvent, TextStartEvent } from '@agent-labs/agent-chat';
import OpenAI from 'openai';
import { EventEncoder } from '../encoder';
import { StreamContext, StreamHandler } from '../types';

export class TextMessageHandler implements StreamHandler {
  constructor(private encoder: EventEncoder) {}

  async *handle(chunk: OpenAI.Chat.Completions.ChatCompletionChunk, context: StreamContext): AsyncGenerator<string, void, unknown> {
    if (!context.isMessageStarted) {
      const event: TextStartEvent = {
        type: EventType.TEXT_START,
        messageId: context.messageId,
      };
      yield this.encoder.encode(event);
      context.isMessageStarted = true;
    }

    const content = chunk.choices[0].delta.content;
    if (content) {
      context.fullResponse += content;
      const event: TextDeltaEvent = {
        type: EventType.TEXT_DELTA,
        messageId: context.messageId,
        delta: content,
      };
      yield this.encoder.encode(event);
    }
  }

  async *finalize(context: StreamContext): AsyncGenerator<string, void, unknown> {
    if (context.isMessageStarted) {
      const event: TextEndEvent = {
        type: EventType.TEXT_END,
        messageId: context.messageId,
      };
      yield this.encoder.encode(event);
    }
  }
} 