import { openai, defaultModelId } from "./client";
import { i18n } from "@/common/i18n";

export type GenerateObjectOptions = {
  schema: Record<string, unknown>; // JSON Schema object
  prompt: string;
  system?: string;
  temperature?: number;
  /** Instruct model to output ONLY valid JSON for the given schema. Default true. */
  jsonOnly?: boolean;
};

function stripMarkdownCodeFence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function extractJsonObjectSubstring(text: string): string {
  const stripped = stripMarkdownCodeFence(text);
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start >= 0 && end > start) return stripped.slice(start, end + 1).trim();
  return stripped.trim();
}

function removeTrailingCommas(text: string): string {
  // Common model mistake: trailing commas before } or ]
  return text.replace(/,\s*([}\]])/g, "$1");
}

function parseModelJson<T>(raw: string): T {
  const candidates = [
    raw,
    stripMarkdownCodeFence(raw),
    extractJsonObjectSubstring(raw),
    removeTrailingCommas(extractJsonObjectSubstring(raw)),
  ];

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Failed to parse JSON: ${String(lastError)}`);
}

export async function generateObject<T = unknown>({
  schema,
  prompt,
  system,
  temperature,
  jsonOnly = true,
}: GenerateObjectOptions): Promise<T> {
  if (!jsonOnly) {
    // For non-JSON output, use regular chat completion
    const completion = await openai.chat.completions.create({
      model: defaultModelId,
      messages: [
        { role: "system", content: system || i18n.t("aiAssistant.prompts.systemPrompts.defaultAssistant") },
        { role: "user", content: prompt },
      ],
      temperature: typeof temperature === "number" ? temperature : 0.3,
    });
    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content generated");
    }
    // For non-JSON, we can't validate against schema, so return as any
    return content as T;
  }

  const schemaDescription = JSON.stringify(schema, null, 2);
  const baseSystem =
    system || i18n.t("aiAssistant.prompts.systemPrompts.defaultStructuredData");
  const jsonSystem = i18n.t("aiAssistant.prompts.systemPrompts.defaultJSONGenerator", { schema: schemaDescription });
  const jsonOnlySystem = `${baseSystem}\n\n${jsonSystem}`;
  const userSuffix = `\n\nRequired output format: A single JSON object that matches the schema above. No markdown, no comments, no additional text.`;

  // Prefer JSON mode (more reliable than tool arguments on some compat providers)
  try {
    const create = async (useJsonMode: boolean) =>
      openai.chat.completions.create({
        model: defaultModelId,
        messages: [
          { role: "system", content: jsonOnlySystem },
          { role: "user", content: `${prompt}${userSuffix}` },
        ],
        ...(useJsonMode ? { response_format: { type: "json_object" as const } } : {}),
        temperature: typeof temperature === "number" ? temperature : 0.3,
      });

    let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;
    try {
      completion = await create(true);
    } catch (_err) {
      completion = await create(false);
    }

    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content generated");
    return parseModelJson<T>(content);
  } catch (error) {
    // Fall through to tool calling + iterative repair fallback.
    console.warn("[generateObject] JSON mode failed, trying tool calling:", error);
  }

  // Create tool definition for function calling
  const tool = {
    type: "function" as const,
    function: {
      name: "generate_structured_data",
      description: "Generate structured data according to the specified schema",
      parameters: schema,
    },
  };

  try {
    const completion = await openai.chat.completions.create({
      model: defaultModelId,
      messages: [
        { role: "system", content: baseSystem },
        { role: "user", content: prompt },
      ],
      tools: [tool],
      tool_choice: { type: "function" as const, function: { name: "generate_structured_data" } },
      temperature: typeof temperature === "number" ? temperature : 0.3,
    });

    const toolCall = completion.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.type !== "function") {
      throw new Error("No tool call generated");
    }

    if (toolCall.function.name !== "generate_structured_data") {
      throw new Error("Unexpected tool call function name");
    }

    const argumentsContent = toolCall.function.arguments;
    if (!argumentsContent) {
      throw new Error("No arguments in tool call");
    }

    // Parse the arguments and return
    return parseModelJson<T>(argumentsContent);
  } catch (error) {
    console.error("Failed to generate structured data using tools:", error);

    // Fallback to manual JSON generation
    console.warn("Falling back to manual JSON generation...");

    const request = async (fixNote?: string, attemptNumber: number = 1) => {
      const attemptInfo =
        attemptNumber > 1
          ? `\n\nThis is attempt ${attemptNumber}. Please ensure the output strictly follows the schema.`
          : "";

      const create = async (useJsonMode: boolean) =>
        openai.chat.completions.create({
          model: defaultModelId,
          messages: [
            {
              role: "system",
              content: `${jsonOnlySystem}${fixNote ? `\n${fixNote}` : ""}${attemptInfo}`,
            },
            { role: "user", content: `${prompt}${userSuffix}` },
          ],
          ...(useJsonMode ? { response_format: { type: "json_object" as const } } : {}),
          temperature: typeof temperature === "number" ? temperature : 0.3,
        });

      let completion: Awaited<ReturnType<typeof openai.chat.completions.create>>;
      try {
        completion = await create(true);
      } catch (_err) {
        completion = await create(false);
      }
      const content = completion.choices?.[0]?.message?.content;
      return typeof content === "string" ? content : "";
    };

    // First attempt
    let text = await request();

    try {
      return parseModelJson<T>(text);
    } catch (fallbackError) {
      console.warn("First fallback attempt failed, retrying...", fallbackError);

      // Second attempt with more specific instructions
      const fixMsg = `The previous output did not match the expected JSON schema. 
Please fix the output to strictly conform to this schema:

${schemaDescription}

Common issues to avoid:
- Extra text before or after JSON
- Missing required fields
- Wrong data types
- Extra commas or syntax errors

Output ONLY the valid JSON object.`;

      text = await request(fixMsg, 2);

      try {
        return parseModelJson<T>(text);
      } catch (secondError) {
        console.error("All attempts failed:", secondError);
        console.error("Generated text:", text);
        throw new Error(
          `Failed to generate valid JSON. Tool-based generation failed and fallback also failed. Last error: ${secondError}`
        );
      }
    }
  }
}
