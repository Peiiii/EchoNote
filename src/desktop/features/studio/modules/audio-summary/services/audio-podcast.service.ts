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
import { AudioPodcastData, PodcastSpeaker, PodcastTurn } from "../types";
import { concatAudioBuffers, decodeAudioArrayBuffer, encodeWav } from "./audio-utils";
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

const MANDARIN_FEMALE_VOICES = [
  "Serena",
  "Maia",
  "Cherry",
  "Bella",
  "Mia",
  "Vivian",
] as const;

const MANDARIN_MALE_VOICES = ["Neil", "Ethan", "Kai", "Moon", "Andre"] as const;

function hashToUint32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)]!;
}

function resolvePodcastVoices(options: { itemId: string }): { host: string; guest: string } {
  const hostOverride =
    (import.meta.env.VITE_DASHSCOPE_TTS_VOICE_HOST as string | undefined) ||
    (import.meta.env.VITE_TTS_VOICE_HOST as string | undefined);
  const guestOverride =
    (import.meta.env.VITE_DASHSCOPE_TTS_VOICE_GUEST as string | undefined) ||
    (import.meta.env.VITE_TTS_VOICE_GUEST as string | undefined);

  if (hostOverride && guestOverride) {
    return { host: hostOverride, guest: guestOverride };
  }

  const rnd = mulberry32(hashToUint32(options.itemId));
  const host = hostOverride || pickOne(MANDARIN_FEMALE_VOICES, rnd);

  let guest = guestOverride || pickOne(MANDARIN_MALE_VOICES, rnd);
  if (guest === host) {
    guest = MANDARIN_MALE_VOICES.find((v) => v !== host) || guest;
  }

  return { host, guest };
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
  const voices = resolvePodcastVoices({ itemId });

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
