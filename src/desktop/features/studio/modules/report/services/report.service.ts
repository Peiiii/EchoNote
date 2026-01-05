import { generateObject } from "@/common/services/ai/generate-object";
import { i18n } from "@/common/i18n";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { ReportData, ReportPriority } from "../types";
import { getUserNotesFromChannels } from "../../shared/services/channel-user-notes.service";
import {
  detectLanguageFromText,
  formatNotesForPrompt,
  getChannelNames,
} from "../../shared/services/notes-prompt.service";

const reportSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "A concise, descriptive title (2-6 words, same language as the notes) that summarizes the report theme",
    },
    executiveSummary: {
      type: "string",
      description: "A 4-8 sentence executive summary grounded in the notes",
    },
    keyThemes: {
      type: "array",
      items: { type: "string" },
      description: "5-10 key themes, each as a short phrase",
    },
    insights: {
      type: "array",
      items: { type: "string" },
      description:
        "5-12 concrete insights, grounded in the notes; avoid generic advice",
    },
    tensions: {
      type: "array",
      items: { type: "string" },
      description:
        "0-6 tensions/contradictions/uncertainties present in the notes",
    },
    actionItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          rationale: { type: "string" },
          nextSteps: { type: "array", items: { type: "string" } },
          priority: { type: "string", enum: ["low", "medium", "high"] },
        },
        required: ["id", "title", "rationale", "nextSteps", "priority"],
      },
      description: "3-8 actionable items with concrete next steps",
    },
    openQuestions: {
      type: "array",
      items: { type: "string" },
      description:
        "3-8 open questions to help the user reflect and clarify intent",
    },
    reportMarkdown: {
      type: "string",
      description:
        "A polished markdown report that includes: title, executive summary, key themes, insights, tensions, action items, and open questions. Must be in the same language as the notes.",
    },
  },
  required: [
    "title",
    "executiveSummary",
    "keyThemes",
    "insights",
    "tensions",
    "actionItems",
    "openQuestions",
    "reportMarkdown",
  ],
};

export async function generateReport(channelIds: string[]): Promise<ReportData> {
  const { channels } = useNotesDataStore.getState();

  if (channelIds.length === 0) {
    throw new Error("At least one channel is required");
  }

  const channelNames = getChannelNames(channelIds, channels);

  const notes = await getUserNotesFromChannels(channelIds, { maxMessagesPerChannel: 250 });

  if (notes.length === 0) {
    throw new Error(`No notes found in selected channels: ${channelNames}`);
  }

  const combinedText = notes.map((n) => n.content).join("\n\n");
  const detectedLanguage = detectLanguageFromText(combinedText);
  const notesText = formatNotesForPrompt(notes, channels);

  const t = i18n.t.bind(i18n);
  const systemPrompt = `${t("aiAssistant.prompts.systemPrompts.report.role")}

${t("aiAssistant.prompts.systemPrompts.report.instructions")}

${t("aiAssistant.prompts.systemPrompts.report.constraints", { language: detectedLanguage })}
`;

  const userPrompt = `Generate a comprehensive report from the following notes.

Spaces: ${channelNames}

Notes:
${notesText}
`;

  const result = await generateObject<{
    title: string;
    executiveSummary: string;
    keyThemes: string[];
    insights: string[];
    tensions: string[];
    actionItems: Array<{
      id: string;
      title: string;
      rationale: string;
      nextSteps: string[];
      priority: ReportPriority;
    }>;
    openQuestions: string[];
    reportMarkdown: string;
  }>({
    schema: reportSchema,
    prompt: userPrompt,
    system: systemPrompt,
    temperature: 0.4,
  });

  return {
    title: result.title,
    executiveSummary: result.executiveSummary,
    keyThemes: result.keyThemes,
    insights: result.insights,
    tensions: result.tensions,
    actionItems: result.actionItems,
    openQuestions: result.openQuestions,
    reportMarkdown: result.reportMarkdown,
    generatedAt: Date.now(),
    contextChannelIds: channelIds,
  };
}

