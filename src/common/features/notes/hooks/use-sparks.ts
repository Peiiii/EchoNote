import { useCallback, useMemo, useRef, useState } from "react";
import { Message, useNotesDataStore } from "@/core/stores/notes-data.store";
import {
  generateSparksForText,
  generateSparksStream,
} from "@/desktop/features/notes/features/ai-assistant/services/insights.service";
import { buildTaggedPrompt } from "@/common/lib/tag-analysis.service";
import { channelMessageService } from "@/core/services/channel-message.service";

export type SparksMode = "batch" | "stream";

export interface UseSparksOptions {
  enableContextEnhancement?: boolean;
  mode?: SparksMode;
  minContentLength?: number;
}

/**
 * Shared hook to generate AI "sparks" for a thought record.
 * - Unifies desktop/mobile logic
 * - Supports batch and streaming generation
 * - Handles tag-enhanced prompts and context inclusion
 */
export function useSparks(message: Message, options?: UseSparksOptions) {
  const {
    enableContextEnhancement = true,
    mode = "batch",
    minContentLength = 8,
  } = options || {};

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localSparks, setLocalSparks] = useState<string[] | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const contentTooShort = (message.content || "").trim().length < minContentLength;

  const { hasTagContext, enhancedPrompt } = useMemo(
    () => buildTaggedPrompt(message.content, message.tags || []),
    [message.content, message.tags]
  );

  const updateRemote = useCallback(
    async (sparks: string[]) => {
      const { userId } = useNotesDataStore.getState();
      if (!userId) {
        throw new Error("User not authenticated");
      }
      await channelMessageService.updateMessage({
        messageId: message.id,
        channelId: message.channelId,
        updates: {
          aiAnalysis: {
            ...(message.aiAnalysis || {}),
            insights: sparks,
            keywords: message.aiAnalysis?.keywords ?? [],
            topics: message.aiAnalysis?.topics ?? [],
            sentiment: message.aiAnalysis?.sentiment ?? "neutral",
            summary: message.aiAnalysis?.summary ?? "",
            tags: message.aiAnalysis?.tags ?? [],
            relatedTopics: message.aiAnalysis?.relatedTopics ?? [],
          },
        },
        userId,
      });
    },
    [message.id, message.channelId, message.aiAnalysis]
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const doGenerateBatch = useCallback(async () => {
    setError(null);
    setIsGenerating(true);
    try {
      const sparks = await generateSparksForText({
        content: message.content,
        channelId: message.channelId,
        messageId: message.id,
        options: {
          includeChannelContext: enableContextEnhancement,
          additionalInstructions: hasTagContext ? enhancedPrompt : undefined,
        },
      });
      setLocalSparks(sparks);
      await updateRemote(sparks);
    } finally {
      setIsGenerating(false);
    }
  }, [
    message.content,
    message.channelId,
    message.id,
    enableContextEnhancement,
    hasTagContext,
    enhancedPrompt,
    updateRemote,
  ]);

  const doGenerateStream = useCallback(async () => {
    setError(null);
    setIsGenerating(true);
    setIsStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    const sparks: string[] = [];
    try {
      for await (const next of generateSparksStream(
        {
          content: message.content,
          channelId: message.channelId,
          messageId: message.id,
          options: {
            includeChannelContext: enableContextEnhancement,
            additionalInstructions: hasTagContext ? enhancedPrompt : undefined,
          },
        },
        { signal: controller.signal }
      )) {
        setLocalSparks(next);
      }
      // After stream completes, persist
      if (sparks.length === 0 && localSparks?.length) {
        await updateRemote(localSparks);
      } else if (sparks.length > 0) {
        await updateRemote(sparks);
      }
    } catch (e) {
      if ((e as Error)?.name === "AbortError") {
        // cancelled by user
      } else {
        setError((e as Error).message || "Failed to generate sparks");
      }
    } finally {
      setIsStreaming(false);
      setIsGenerating(false);
      abortRef.current = null;
    }
  }, [
    message.content,
    message.channelId,
    message.id,
    enableContextEnhancement,
    hasTagContext,
    enhancedPrompt,
    updateRemote,
    localSparks,
  ]);

  const generate = useCallback(async () => {
    if (isGenerating || contentTooShort) return;
    if (mode === "stream") {
      await doGenerateStream();
    } else {
      await doGenerateBatch();
    }
  }, [isGenerating, contentTooShort, mode, doGenerateBatch, doGenerateStream]);

  const regenerate = useCallback(async () => {
    setLocalSparks(null);
    await generate();
  }, [generate]);

  return {
    isGenerating,
    isStreaming,
    error,
    hasTagContext,
    contentTooShort,
    sparks: localSparks,
    generate,
    regenerate,
    cancel,
  };
}

