import { generateObject } from '@/common/services/ai/generate-object'

// Define the JSON Schema for creative sparks
const SparksSchema = {
  type: 'object',
  properties: {
    sparks: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 3
    }
  },
  required: ['sparks']
}

// Define the expected return type
interface SparksResult {
  sparks: string[]
}

export async function generateSparksForText(content: string): Promise<string[]> {
  const prompt = [
    'Based on the text below, generate exactly 3 creative sparks - let your imagination run wild!',
    '',
    'These sparks can be anything that comes to mind:',
    '- A story or narrative that this content inspires',
    '- A piece of knowledge or historical connection',
    '- A philosophical reflection or existential thought',
    '- A creative piece like a poem, metaphor, or analogy',
    '- A random but somehow connected idea',
    '- Something abstract, surreal, or seemingly unrelated',
    '',
    'Be creative, unexpected, and don\'t worry about being "correct" or "useful".',
    'The goal is to spark new thoughts, not to provide conventional insights.',
    'Feel free to be whimsical, profound, or even a bit nonsensical!',
    '',
    content,
  ].join('\n')

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
