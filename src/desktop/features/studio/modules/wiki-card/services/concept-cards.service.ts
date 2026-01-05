import { generateObject } from "@/common/services/ai/generate-object";
import { ConceptCardsData, ConceptCard } from "../types";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { i18n } from "@/common/i18n";
import { getUserNotesFromChannels } from "../../shared/services/channel-user-notes.service";
import {
  detectLanguageFromText,
  formatNotesForPrompt,
  getChannelNames,
} from "../../shared/services/notes-prompt.service";

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

export async function generateConceptCards(
  channelIds: string[]
): Promise<ConceptCardsData> {
  const { channels } = useNotesDataStore.getState();

  if (channelIds.length === 0) {
    throw new Error("At least one channel is required");
  }

  const channelNames = getChannelNames(channelIds, channels);

  const allNotes = await getUserNotesFromChannels(channelIds, { maxMessagesPerChannel: 200 });

  if (allNotes.length === 0) {
    throw new Error(`No notes found in selected channels: ${channelNames}`);
  }

  const combinedText = allNotes.map((note) => note.content).join("\n\n");
  const detectedLanguage = detectLanguageFromText(combinedText);
  const notesText = formatNotesForPrompt(allNotes, channels);

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
