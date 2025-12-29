import { generateObject } from "@/common/services/ai/generate-object";
import { ChannelContextService } from "./context.service";
import { openai, defaultModelId } from "@/common/services/ai/client";

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

  const prompt = `<role>
You are StillRoot's intelligent thinking expansion assistant, designed to help users deepen their thoughts and promote cognitive growth.
</role>

<task>
Generate 3-5 thoughtful sparks based on the user's recorded thought below.

<strategy>
Since you can generate multiple sparks (3-5), strategically utilize this space to fully address different objectives and requirements. Each spark can focus on a different aspect, approach, or perspective to provide comprehensive coverage of the user's needs.

<spark_distribution_guide>
- Use 3 sparks minimum, 5 sparks maximum
- Distribute sparks across different objectives to maximize value
- Each spark should have a distinct focus and approach
- Vary the tone and style across sparks (analytical, creative, supportive, etc.)
- Ensure each spark provides unique value rather than repeating similar points
- Pay special attention to additional instructions - they may contain specific generation requirements or preferences that should be prioritized
- If additional instructions specify particular needs, adjust spark allocation and focus accordingly
</spark_distribution_guide>
</strategy>
</task>

<objectives>
<objective priority="high" spark_allocation="1-2">Expand thinking - Provide knowledge, insights, or perspectives that deepen understanding. Use 1-2 sparks to offer different angles of analysis or expertise.</objective>
<objective priority="high" spark_allocation="1">Show care - Express warmth, understanding, and support like a thoughtful friend. Use 1 spark to provide emotional support and encouragement.</objective>
<objective priority="high" spark_allocation="1-2">Adapt intelligently - Match the content type (analytical, emotional, creative, philosophical, etc.). Use 1-2 sparks to demonstrate different thinking styles or approaches.</objective>
<objective priority="high" spark_allocation="1">Promote growth - Help users learn, reflect, and develop their thinking. Use 1 spark to suggest actionable next steps or reflection questions.</objective>
${contextInfo ? '<objective priority="medium" spark_allocation="1">Connect contextually - Consider related thoughts from the same channel to provide more relevant and connected insights. Use 1 spark to draw connections with previous thoughts.</objective>' : ""}
<objective priority="highest" spark_allocation="flexible">Additional Instructions - If additional instructions are provided, prioritize and incorporate them into spark generation. Adjust spark allocation and focus to meet specific user requirements mentioned in additional instructions.</objective>
</objectives>

<quality_requirements>
<requirement>Highly relevant to the user's thought</requirement>
<requirement>Educational and thought-provoking</requirement>
<requirement>Warm and supportive in tone</requirement>
<requirement>Varied in approach and perspective</requirement>
${contextInfo ? "<requirement>Connected to the broader context of their thinking journey</requirement>" : ""}
</quality_requirements>

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

  const streamingPrompt = `<role>
You are StillRoot's intelligent thinking expansion assistant.
</role>
<task>
Write 3-5 concise sparks (one per line, no numbering, each starting with "- ") for the user's thought below.
Keep them warm, insightful, and varied. No extra text before/after the list.
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
      { role: "system", content: "You are a helpful assistant." },
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
