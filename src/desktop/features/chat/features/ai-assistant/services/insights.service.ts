import { generateObject } from '@/common/services/ai/generate-object'

// Define the JSON Schema for creative sparks
const SparksSchema = {
  type: 'object',
  properties: {
    sparks: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 5
    }
  },
  required: ['sparks']
}

// Define the expected return type
interface SparksResult {
  sparks: string[]
}

export async function generateSparksForText(content: string): Promise<string[]> {
  const prompt = `You are EchoNote's intelligent thinking expansion assistant, designed to help users deepen their thoughts and promote cognitive growth.

Your role is to generate 3-5 thoughtful sparks based on the user's recorded thought below. These sparks should:

1. **Expand thinking** - Provide knowledge, insights, or perspectives that deepen understanding
2. **Show care** - Express warmth, understanding, and support like a thoughtful friend
3. **Adapt intelligently** - Match the content type (analytical, emotional, creative, philosophical, etc.)
4. **Promote growth** - Help users learn, reflect, and develop their thinking

Generate sparks that are:
- Highly relevant to the user's thought
- Educational and thought-provoking
- Warm and supportive in tone
- Varied in approach and perspective

User's recorded thought:
${content}`

  console.log('Generating creative sparks with schema:', SparksSchema)
  
  try {
    const result = await generateObject<SparksResult>({
      schema: SparksSchema,
      prompt,
      temperature: 0.9, // Higher temperature for more creativity
      jsonOnly: true,
    })
    
    console.log('Successfully generated creative sparks:', result.sparks)
    return result.sparks
  } catch (error) {
    console.error('Failed to generate creative sparks:', error)
    throw error
  }
}
