import { generateObject } from "@/common/services/ai/generate-object";
import { MindmapData, MindmapTreeNode } from "../types";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { i18n } from "@/common/i18n";
import { getUserNotesFromChannels } from "../../shared/services/channel-user-notes.service";
import {
  detectLanguageFromText,
  formatNotesForPrompt,
  getChannelNames,
} from "../../shared/services/notes-prompt.service";

const mindmapSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description:
        "A short title (2-5 words, same language as the notes) that describes the theme of the mindmap",
    },
    nodes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          importance: { type: "number" },
          group: { type: "string" },
        },
        required: ["id", "label"],
      },
    },
    edges: {
      type: "array",
      items: {
        type: "object",
        properties: {
          source: { type: "string" },
          target: { type: "string" },
          weight: { type: "number" },
        },
        required: ["source", "target"],
      },
    },
    tree: {
      type: "object",
      description: "Hierarchical mindmap structure with a single root for XMind-like layout",
      properties: {
        id: { type: "string" },
        label: { type: "string" },
        children: {
          type: "array",
          items: { "$ref": "#/properties/tree" },
        },
      },
      required: ["id", "label"],
    },
  },
  required: ["title", "nodes", "edges"],
};

export async function generateMindmap(channelIds: string[]): Promise<MindmapData> {
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
  const systemPrompt = `${t("aiAssistant.prompts.systemPrompts.mindmap.role")}

${t("aiAssistant.prompts.systemPrompts.mindmap.graphDescription")}

${t("aiAssistant.prompts.systemPrompts.mindmap.treeDescription")}

${t("aiAssistant.prompts.systemPrompts.mindmap.constraints", { language: detectedLanguage })}
`;

  const userPrompt = `Build a mindmap from the following notes from spaces: ${channelNames}

${notesText}

Return a JSON object with title, nodes, and edges. All labels must be in ${detectedLanguage}.`;

  const result = await generateObject<{
    title: string;
    nodes: { id: string; label: string; importance?: number; group?: string }[];
    edges: { source: string; target: string; weight?: number }[];
    tree?: MindmapTreeNode;
  }>({
    schema: mindmapSchema,
    prompt: userPrompt,
    system: systemPrompt,
    temperature: 0.4,
  });

  return {
    title: result.title,
    nodes: result.nodes,
    edges: result.edges,
    generatedAt: Date.now(),
    contextChannelIds: channelIds,
    tree: result.tree,
  };
}
