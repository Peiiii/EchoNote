import { generateObject } from '@/common/services/ai/generate-object'

// Define the JSON Schema directly
const InsightsSchema = {
  type: 'object',
  properties: {
    insights: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3
    }
  },
  required: ['insights']
}

// Define the expected return type
interface InsightsResult {
  insights: string[]
}

export async function generateInsightsForText(content: string): Promise<string[]> {
  const prompt = [
    'Given the text below, generate exactly 3 insightful paragraphs that help with thinking and learning:',
    '',
    '1. **Perspective Shift**: Offer a different angle or viewpoint to reconsider this content',
    '2. **Knowledge Connections**: Identify connections to existing knowledge or concepts',
    '3. **Question Generation**: Pose thought-provoking questions that deepen understanding',
    '',
    // 'Each paragraph should be 50-100 words, focused on promoting deeper thinking rather than just summarizing.',
    content,
  ].join('\n')

  console.log('Generating insights with schema:', InsightsSchema)
  
  try {
    const result = await generateObject<InsightsResult>({
      schema: InsightsSchema,
      prompt,
      temperature: 0.7,
      jsonOnly: true,
    })
    
    console.log('Successfully generated insights:', result.insights)
    return result.insights
  } catch (error) {
    console.error('Failed to generate insights:', error)
    throw error
  }
}
