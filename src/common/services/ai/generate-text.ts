import { openai, defaultModelId } from "./client";
import { i18n } from "@/common/i18n";

export type GenerateTextOptions = {
  prompt: string;
  system?: string;
  temperature?: number;
};

export async function generateText({
  prompt,
  system,
  temperature,
}: GenerateTextOptions): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: defaultModelId,
    messages: [
      { role: "system", content: system ?? i18n.t("aiAssistant.prompts.systemPrompts.defaultAssistant") },
      { role: "user", content: prompt },
    ],
    temperature: typeof temperature === "number" ? temperature : 0.7,
  });

  const content = completion.choices?.[0]?.message?.content;
  return typeof content === "string" ? content : "";
}
