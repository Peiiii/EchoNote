import { z } from 'zod'
import { openai, defaultModelId } from './client'

export type GenerateObjectOptions<T> = {
  schema: z.ZodType<T>
  prompt: string
  system?: string
  temperature?: number
  /** Instruct model to output ONLY valid JSON for the given schema. Default true. */
  jsonOnly?: boolean
}

export async function generateObject<T>({ schema, prompt, system, temperature, jsonOnly = true }: GenerateObjectOptions<T>): Promise<T> {
  const systemPrefix = jsonOnly
    ? 'You are a strict JSON generator. Return ONLY valid JSON that conforms to the JSON schema constraints.'
    : 'You are a helpful assistant.'

  const userSuffix = jsonOnly
    ? '\nOutput format: ONLY a single JSON object, no markdown, no comments.'
    : ''

  const request = async (fixNote?: string) => {
    const completion = await openai.chat.completions.create({
      model: defaultModelId,
      messages: [
        { role: 'system', content: `${systemPrefix}${system ? `\n${system}` : ''}${fixNote ? `\n${fixNote}` : ''}` },
        { role: 'user', content: `${prompt}${userSuffix}` },
      ],
      temperature: typeof temperature === 'number' ? temperature : 0.3,
    })
    const content = completion.choices?.[0]?.message?.content
    return typeof content === 'string' ? content : ''
  }

  // First attempt
  let text = await request()
  try {
    const parsed = schema.parse(JSON.parse(text))
    return parsed
  } catch {
    // One retry with fix instruction
    const fixMsg = 'Previous output did not match the expected JSON schema. Fix strictly to the schema. '
      + 'Do not include any text besides the JSON.'
    text = await request(fixMsg)
    const parsed = schema.parse(JSON.parse(text))
    return parsed
  }
}
