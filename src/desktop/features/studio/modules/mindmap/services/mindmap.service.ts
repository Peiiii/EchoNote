import { generateObject } from "@/common/services/ai/generate-object";
import { MindmapData } from "../types";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { channelMessageService } from "@/core/services/channel-message.service";

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

export async function generateMindmap(channelIds: string[]): Promise<MindmapData> {
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

  const systemPrompt = `You are a knowledge organizer. Build two complementary structures from notes:

1) A graph representation (for free-form exploration):
   - nodes: 12–30 key concepts (unique id + label)
   - edges: 15–50 relations (source -> target)
   - optional: node importance (1–5), edge weight (0.5–2.0)

2) A hierarchical mindmap (for XMind-like view):
   - tree: a single root topic with nested children (3–5 branches per level is ideal)
   - keep tree labels concise (2–4 words) and avoid duplicates

Constraints:
- Everything must be in ${detectedLanguage}
- Normalize concept labels and merge duplicates
- Prefer recurring and connective concepts as higher-level topics
`;

  const userPrompt = `Build a mindmap from the following notes from spaces: ${channelNames}

${notesText}

Return a JSON object with title, nodes, and edges. All labels must be in ${detectedLanguage}.`;

  const result = await generateObject<{
    title: string;
    nodes: { id: string; label: string; importance?: number; group?: string }[];
    edges: { source: string; target: string; weight?: number }[];
    tree?: { id: string; label: string; children?: any[] };
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
