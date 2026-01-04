import { generateObject } from "@/common/services/ai/generate-object";
import { ConceptCardsData, ConceptCard } from "../types";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";
import { i18n } from "@/common/i18n";

const conceptCardSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A concise, descriptive title summarizing the collection of concept cards (2-5 words, same language as the notes)",
    },
    cards: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          definition: { type: "string" },
          keyPoints: {
            type: "array",
            items: { type: "string" },
          },
          relatedConcepts: {
            type: "array",
            items: { type: "string" },
          },
          examples: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["id", "title", "definition", "keyPoints", "relatedConcepts", "examples"],
      },
    },
  },
  required: ["title", "cards"],
};

function detectLanguage(text: string): string {
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

export async function generateConceptCards(
  channelIds: string[]
): Promise<ConceptCardsData> {
  const { channels } = useNotesDataStore.getState();

  if (channelIds.length === 0) {
    throw new Error("At least one channel is required");
  }

  const allNotes: Array<{ channelId: string; content: string; timestamp: Date | number }> = [];

  for (const channelId of channelIds) {
    const channelState = channelMessageService.dataContainer.get().messageByChannel[channelId];
    if (channelState?.messages) {
      const userMessages = channelState.messages.filter((msg) => msg.sender === "user");
      for (const msg of userMessages) {
        allNotes.push({
          channelId,
          content: msg.content || "",
          timestamp: msg.timestamp || new Date(0),
        });
      }
    }
  }

  if (allNotes.length === 0) {
    throw new Error("No notes found in selected channels");
  }

  const combinedText = allNotes.map((note) => note.content).join("\n\n");
  const detectedLanguage = detectLanguage(combinedText);

  const channelNames = channelIds
    .map((id) => channels.find((c) => c.id === id)?.name || id)
    .join(", ");

  const notesText = allNotes
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

  const t = i18n.t.bind(i18n);
  const systemPrompt = `${t("aiAssistant.prompts.systemPrompts.conceptCards.role")}

${t("aiAssistant.prompts.systemPrompts.conceptCards.instructions")}

${t("aiAssistant.prompts.systemPrompts.conceptCards.focus")}

${t("aiAssistant.prompts.systemPrompts.conceptCards.languageNote", { language: detectedLanguage })}

${t("aiAssistant.prompts.systemPrompts.conceptCards.count")}`;

  const userPrompt = `Based on the following notes from spaces: ${channelNames}

${notesText}

Generate concept cards that organize the key concepts from these notes. All content must be in ${detectedLanguage} language. Make sure each card is well-structured and provides value to someone trying to understand the domain.`;

  const result = await generateObject<{ title: string; cards: Omit<ConceptCard, "references">[] }>({
    schema: conceptCardSchema,
    prompt: userPrompt,
    system: systemPrompt,
    temperature: 0.7,
  });

  const cards: ConceptCard[] = result.cards.map((card) => ({
    ...card,
    references: [],
  }));

  return {
    title: result.title,
    cards,
    generatedAt: Date.now(),
    contextChannelIds: channelIds,
  };
}

