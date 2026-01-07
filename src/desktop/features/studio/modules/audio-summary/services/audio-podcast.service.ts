import { generateObject } from "@/common/services/ai/generate-object";
import { i18n } from "@/common/i18n";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { getUserNotesFromChannels } from "../../shared/services/channel-user-notes.service";
import {
  detectLanguageFromText,
  formatNotesForPrompt,
  getChannelNames,
  languageTypeFromAppLanguage,
} from "../../shared/services/notes-prompt.service";
import { resolvePodcastVoices } from "../../shared/services/tts-voice.service";
import { AudioPodcastData, PodcastSpeaker, PodcastTurn } from "../types";
import { concatAudioBuffers, decodeAudioArrayBuffer, encodeWav } from "@/common/utils/audio/audio-utils";
import { studioAudioCache } from "./studio-audio-cache.service";
import { qwenTtsToArrayBuffers } from "@/common/services/ai/qwen-tts";

const podcastSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    turns: {
      type: "array",
      items: {
        type: "object",
        properties: {
          speaker: { type: "string", enum: ["host", "guest"] },
          text: { type: "string" },
        },
        required: ["speaker", "text"],
      },
    },
    transcriptMarkdown: { type: "string" },
  },
  required: ["title", "description", "turns", "transcriptMarkdown"],
};

function normalizeTurns(turns: PodcastTurn[]): PodcastTurn[] {
  const out: PodcastTurn[] = [];
  for (const t of turns) {
    const speaker = t.speaker as PodcastSpeaker;
    const text = (t.text || "").trim();
    if (!text) continue;
    out.push({ speaker, text });
  }
  return out;
}

export async function generateAudioPodcast(options: {
  channelIds: string[];
  itemId: string;
}): Promise<AudioPodcastData> {
  const { channels } = useNotesDataStore.getState();
  const { channelIds, itemId } = options;

  if (channelIds.length === 0) throw new Error("At least one channel is required");

  const channelNames = getChannelNames(channelIds, channels);
  const notes = await getUserNotesFromChannels(channelIds, { maxMessagesPerChannel: 250 });

  if (notes.length === 0) {
    throw new Error(`No notes found in selected channels: ${channelNames}`);
  }

  const combinedText = notes.map((n) => n.content).join("\n\n");
  const detectedLanguage = detectLanguageFromText(combinedText);
  const uiLanguageType = languageTypeFromAppLanguage(i18n.resolvedLanguage ?? i18n.language);
  const targetLanguage = uiLanguageType || detectedLanguage;
  const notesText = formatNotesForPrompt(notes, channels);

  const t = i18n.t.bind(i18n);
  const systemPrompt = `${t("aiAssistant.prompts.systemPrompts.audioPodcast.role")}

${t("aiAssistant.prompts.systemPrompts.audioPodcast.instructions")}

${t("aiAssistant.prompts.systemPrompts.audioPodcast.constraints", { language: targetLanguage })}
`;

  const userPrompt =
    targetLanguage === "Chinese"
      ? `请基于以下笔记生成一个两个人对谈的播客脚本。

空间：${channelNames}

笔记：
${notesText}
`
      : `Create a two-person podcast conversation based on the following notes.

Spaces: ${channelNames}

Notes:
${notesText}
`;

  const script = await generateObject<{
    title: string;
    description: string;
    turns: PodcastTurn[];
    transcriptMarkdown: string;
  }>({
    schema: podcastSchema,
    prompt: userPrompt,
    system: systemPrompt,
    temperature: 0.5,
  });

  const turns = normalizeTurns(script.turns);
  if (turns.length === 0) throw new Error("Podcast script is empty");

  const ttsModel =
    (import.meta.env.VITE_DASHSCOPE_TTS_MODEL as string | undefined) ||
    (import.meta.env.VITE_TTS_MODEL as string | undefined) ||
    "qwen3-tts-flash";
  const hostOverride =
    (import.meta.env.VITE_DASHSCOPE_TTS_VOICE_HOST as string | undefined) ||
    (import.meta.env.VITE_TTS_VOICE_HOST as string | undefined);
  const guestOverride =
    (import.meta.env.VITE_DASHSCOPE_TTS_VOICE_GUEST as string | undefined) ||
    (import.meta.env.VITE_TTS_VOICE_GUEST as string | undefined);
  const voices = resolvePodcastVoices({ seed: itemId, hostOverride, guestOverride });

  let wavBlob: Blob | null = null;
  try {
    const ctx = new AudioContext();
    const perTurn: AudioBuffer[] = [];
    for (const turn of turns) {
      const voice = turn.speaker === "host" ? voices.host : voices.guest;
      const parts = await qwenTtsToArrayBuffers({
        text: turn.text,
        voice,
        model: ttsModel,
        languageType: targetLanguage,
      });
      const decodedParts: AudioBuffer[] = [];
      for (const ab of parts) {
        decodedParts.push(await decodeAudioArrayBuffer(ctx, ab));
      }
      if (decodedParts.length === 0) continue;
      perTurn.push(
        decodedParts.length === 1
          ? decodedParts[0]
          : concatAudioBuffers(ctx, decodedParts, { silenceSecondsBetween: 0 })
      );
    }
    const merged = concatAudioBuffers(ctx, perTurn, { silenceSecondsBetween: 0.28 });
    wavBlob = encodeWav(merged);
    await ctx.close();
  } catch (err) {
    console.warn("[audio-podcast] TTS failed, falling back to transcript-only", err);
  }

  const audioStorageKey = wavBlob ? `studio-audio:${itemId}` : undefined;
  const audioMimeType = wavBlob ? "audio/wav" : undefined;
  if (wavBlob && audioStorageKey) {
    await studioAudioCache.put(audioStorageKey, wavBlob, audioMimeType!);
  }

  return {
    title: script.title || "Audio",
    description: script.description || "",
    turns,
    transcriptMarkdown: script.transcriptMarkdown || "",
    audioStorageKey,
    audioMimeType,
    generatedAt: Date.now(),
    contextChannelIds: channelIds,
  };
}
