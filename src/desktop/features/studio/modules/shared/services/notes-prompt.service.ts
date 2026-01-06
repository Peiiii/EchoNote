import type { Channel } from "@/core/types/notes";
import type { ChannelUserNote } from "./channel-user-notes.service";

export function detectLanguageFromText(text: string): string {
  const chineseRegex = /[\u4e00-\u9fff]/;
  const japaneseRegex = /[\u3040-\u309f\u30a0-\u30ff]/;
  const koreanRegex = /[\uac00-\ud7af]/;
  const arabicRegex = /[\u0600-\u06ff]/;
  const cyrillicRegex = /[\u0400-\u04ff]/;

  if (chineseRegex.test(text)) return "Chinese";
  if (japaneseRegex.test(text)) return "Japanese";
  if (koreanRegex.test(text)) return "Korean";
  if (arabicRegex.test(text)) return "Arabic";
  if (cyrillicRegex.test(text)) return "Russian";
  return "English";
}

export function languageTypeFromAppLanguage(appLanguage: string | undefined | null): string {
  const normalized = (appLanguage || "").toLowerCase();
  if (normalized.startsWith("zh")) return "Chinese";
  if (normalized.startsWith("ja")) return "Japanese";
  if (normalized.startsWith("ko")) return "Korean";
  if (normalized.startsWith("ru")) return "Russian";
  if (normalized.startsWith("ar")) return "Arabic";
  return "English";
}

export function getChannelNames(channelIds: string[], channels: Channel[]): string {
  return channelIds.map((id) => channels.find((c) => c.id === id)?.name || id).join(", ");
}

export function formatNotesForPrompt(notes: ChannelUserNote[], channels: Channel[]): string {
  return notes
    .slice()
    .sort((a, b) => {
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp;
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp;
      return timeB - timeA;
    })
    .map((note, idx) => {
      const channelName = channels.find((c) => c.id === note.channelId)?.name || note.channelId;
      return `Note ${idx + 1} (from ${channelName}):\n${note.content}`;
    })
    .join("\n\n---\n\n");
}
