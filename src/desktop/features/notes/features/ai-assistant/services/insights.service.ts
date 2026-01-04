import { generateObject } from "@/common/services/ai/generate-object";
import { ChannelContextService } from "./context.service";
import { openai, defaultModelId } from "@/common/services/ai/client";
import { i18n } from "@/common/i18n";

// Define the JSON Schema for creative sparks
const SparksSchema = {
  type: "object",
  properties: {
    sparks: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
    },
  },
  required: ["sparks"],
};

// Define the expected return type
interface SparksResult {
  sparks: string[];
}

// Define options for sparks generation
export interface GenerateSparksOptions {
  includeChannelContext?: boolean;
  contextOptions?: {
    maxMessages?: number;
    maxContentLength?: number;
  };
  additionalInstructions?: string;
}

// Define the main configuration for sparks generation
export interface SparksGenerationConfig {
  content: string;
  channelId?: string;
  messageId?: string;
  options?: GenerateSparksOptions;
}

// Main function with clean configuration object
export async function generateSparksForText(config: SparksGenerationConfig): Promise<string[]> {
  const { content, channelId, messageId, options = {} } = config;

  // Build context-aware prompt
  let contextInfo = "";
  if (options.includeChannelContext && channelId) {
    const context = ChannelContextService.getChannelContext(
      channelId,
      messageId,
      options.contextOptions
    );
    if (context) {
      contextInfo = ChannelContextService.formatContextForPrompt(context);
    }
  }

  const t = i18n.t.bind(i18n);
  const qualityRequirements = contextInfo
    ? t("aiAssistant.prompts.systemPrompts.sparks.qualityRequirements", { 
        contextRequirement: t("aiAssistant.prompts.systemPrompts.sparks.qualityRequirementContext")
      })
    : t("aiAssistant.prompts.systemPrompts.sparks.qualityRequirements", { contextRequirement: "" });

  const prompt = `<role>
${t("aiAssistant.prompts.systemPrompts.sparks.role")}
</role>

<task>
${t("aiAssistant.prompts.systemPrompts.sparks.task")}

<strategy>
${t("aiAssistant.prompts.systemPrompts.sparks.strategy")}

<spark_distribution_guide>
${t("aiAssistant.prompts.systemPrompts.sparks.sparkDistributionGuide")}
</spark_distribution_guide>
</strategy>
</task>

<objectives>
${t("aiAssistant.prompts.systemPrompts.sparks.objectiveExpand")}
${t("aiAssistant.prompts.systemPrompts.sparks.objectiveCare")}
${t("aiAssistant.prompts.systemPrompts.sparks.objectiveAdapt")}
${t("aiAssistant.prompts.systemPrompts.sparks.objectiveGrowth")}
${contextInfo ? t("aiAssistant.prompts.systemPrompts.sparks.objectiveContext") : ""}
${t("aiAssistant.prompts.systemPrompts.sparks.objectiveAdditional")}
</objectives>

${qualityRequirements}

<user_content>
${content}
</user_content>
${contextInfo ? `<context>${contextInfo}</context>` : ""}${options.additionalInstructions ? `\n\n<additional_instructions>${options.additionalInstructions}</additional_instructions>` : ""}`;

  console.log("Generating creative sparks with schema:", SparksSchema);

  try {
    const result = await generateObject<SparksResult>({
      schema: SparksSchema,
      prompt,
      temperature: 0.9, // Higher temperature for more creativity
      jsonOnly: true,
    });

    console.log("Successfully generated creative sparks:", result.sparks);
    return result.sparks;
  } catch (error) {
    console.error("Failed to generate creative sparks:", error);
    throw error;
  }
}

// Backward compatibility function for simple usage
export async function generateSparksForTextSimple(content: string): Promise<string[]> {
  return generateSparksForText({ content });
}

/**
 * Streaming generation of sparks.
 * This uses a simpler prompt (no tool call) and expects model to output bullet lines.
 * We incrementally parse bullets and yield the current list of sparks.
 */
export async function* generateSparksStream(
  config: SparksGenerationConfig,
  opts?: { signal?: AbortSignal }
): AsyncGenerator<string[]> {
  const { content, channelId, messageId, options = {} } = config;
  if (!content || !content.trim()) return;

  // Build optional contextual info
  let contextInfo = "";
  if (options.includeChannelContext && channelId) {
    const context = ChannelContextService.getChannelContext(
      channelId,
      messageId,
      options.contextOptions
    );
    if (context) {
      contextInfo = ChannelContextService.formatContextForPrompt(context);
    }
  }

  const t = i18n.t.bind(i18n);
  const streamingPrompt = `<role>
${t("aiAssistant.prompts.systemPrompts.sparks.roleSimple")}
</role>
<task>
${t("aiAssistant.prompts.systemPrompts.sparks.streamingTask")}
</task>
${options.additionalInstructions ? `<additional_instructions>${options.additionalInstructions}</additional_instructions>` : ""}
<user_content>
${content}
</user_content>
${contextInfo ? `<context>${contextInfo}</context>` : ""}`;

  const stream = await openai.chat.completions.create({
    model: defaultModelId,
    stream: true,
    temperature: 0.9,
    messages: [
      { role: "system", content: i18n.t("aiAssistant.prompts.systemPrompts.defaultAssistant") },
      { role: "user", content: streamingPrompt },
    ],
  });

  const sparks: string[] = [];
  let buffer = "";
  const maxSparks = 5;
  const bulletRegex = /^\s*[-*•]\s+/; // match simple bullets

  try {
    for await (const part of stream) {
      if (opts?.signal?.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }
      const delta = part.choices?.[0]?.delta?.content || "";
      if (!delta) continue;
      buffer += delta;
      // Split into lines and parse completed ones
      const lines = buffer.split(/\r?\n/);
      // Preserve last partial line in buffer
      buffer = lines.pop() || "";
      for (const raw of lines) {
        const line = String(raw).trim();
        if (!line) continue;
        const text = bulletRegex.test(line) ? line.replace(bulletRegex, "").trim() : line;
        if (!text) continue;
        // De-dup and cap
        if (!sparks.includes(text)) {
          sparks.push(text);
          if (sparks.length > maxSparks) {
            sparks.splice(maxSparks);
          }
          yield [...sparks];
        }
      }
      if (sparks.length >= 3) {
        // Already useful; continue to refine until end
      }
    }
    // Flush any final bullet in buffer
    const final = buffer.trim();
    if (final) {
      const text = bulletRegex.test(final) ? final.replace(bulletRegex, "").trim() : final;
      if (text && !sparks.includes(text) && sparks.length < maxSparks) {
        sparks.push(text);
        yield [...sparks];
      }
    }
  } catch (e) {
    if ((e as Error).name === "AbortError") {
      // Propagate abort to consumer so they can distinguish
      throw e;
    }
    console.error("generateSparksStream error:", e);
    throw e;
  }
}
