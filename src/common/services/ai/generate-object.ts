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

  // Create tool definition for function calling
  const tool = {
    type: "function" as const,
    function: {
      name: "generate_structured_data",
      description: "Generate structured data according to the specified schema",
      parameters: schema,
    },
  };

  const systemPrefix =
    system ||
    i18n.t("aiAssistant.prompts.systemPrompts.defaultStructuredData");

  try {
    const completion = await openai.chat.completions.create({
      model: defaultModelId,
      messages: [
        { role: "system", content: systemPrefix },
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
    const parsed = JSON.parse(argumentsContent);
    return parsed as T;
  } catch (error) {
    console.error("Failed to generate structured data using tools:", error);

    // Fallback to manual JSON generation
    console.warn("Falling back to manual JSON generation...");

    const schemaDescription = JSON.stringify(schema, null, 2);

    const systemPrefix = i18n.t("aiAssistant.prompts.systemPrompts.defaultJSONGenerator", { schema: schemaDescription });

    const userSuffix = `\n\nRequired output format: A single JSON object that matches the schema above. No markdown, no comments, no additional text.`;

    const request = async (fixNote?: string, attemptNumber: number = 1) => {
      const attemptInfo =
        attemptNumber > 1
          ? `\n\nThis is attempt ${attemptNumber}. Please ensure the output strictly follows the schema.`
          : "";

      const completion = await openai.chat.completions.create({
        model: defaultModelId,
        messages: [
          {
            role: "system",
            content: `${systemPrefix}${fixNote ? `\n${fixNote}` : ""}${attemptInfo}`,
          },
          { role: "user", content: `${prompt}${userSuffix}` },
        ],
        temperature: typeof temperature === "number" ? temperature : 0.3,
      });
      const content = completion.choices?.[0]?.message?.content;
      return typeof content === "string" ? content : "";
    };

    // First attempt
    let text = await request();
    let parsed: T;

    try {
      parsed = JSON.parse(text) as T;
      return parsed;
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
        parsed = JSON.parse(text) as T;
        return parsed;
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
