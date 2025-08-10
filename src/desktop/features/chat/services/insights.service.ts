import { z } from 'zod'
import { generateObject } from '@/common/services/ai/generate-object'

const InsightsSchema = z.object({ insights: z.array(z.string()).length(3) })

export async function generateInsightsForText(content: string): Promise<string[]> {
  const prompt = [
    'Given the text below, generate exactly 3 insightful paragraphs that help with thinking and learning:',
    '',
    '1. **Perspective Shift**: Offer a different angle or viewpoint to reconsider this content',
    '2. **Knowledge Connections**: Identify connections to existing knowledge or concepts',
    '3. **Question Generation**: Pose thought-provoking questions that deepen understanding',
    '',
    'Each paragraph should be 50-100 words, focused on promoting deeper thinking rather than just summarizing.',
    content,
  ].join('\n')

  const { insights } = await generateObject({
    schema: InsightsSchema,
    prompt,
    temperature: 0.7,
  })

  return insights
}
