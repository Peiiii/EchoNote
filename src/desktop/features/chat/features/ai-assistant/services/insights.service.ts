import { generateObject } from '@/common/services/ai/generate-object'
import { ChannelContextService } from './context.service'

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

// Define options for sparks generation
export interface GenerateSparksOptions {
  includeChannelContext?: boolean;
  contextOptions?: {
    maxMessages?: number;
    maxContentLength?: number;
  };
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
  let contextInfo = '';
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

  const prompt = `You are EchoNote's intelligent thinking expansion assistant, designed to help users deepen their thoughts and promote cognitive growth.

Your role is to generate 3-5 thoughtful sparks based on the user's recorded thought below. These sparks should:

1. **Expand thinking** - Provide knowledge, insights, or perspectives that deepen understanding
2. **Show care** - Express warmth, understanding, and support like a thoughtful friend
3. **Adapt intelligently** - Match the content type (analytical, emotional, creative, philosophical, etc.)
4. **Promote growth** - Help users learn, reflect, and develop their thinking
${contextInfo ? '5. **Connect contextually** - Consider related thoughts from the same channel to provide more relevant and connected insights' : ''}

Generate sparks that are:
- Highly relevant to the user's thought
- Educational and thought-provoking
- Warm and supportive in tone
- Varied in approach and perspective
${contextInfo ? '- Connected to the broader context of their thinking journey' : ''}

User's recorded thought:
${content}${contextInfo}`

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

// Backward compatibility function for simple usage
export async function generateSparksForTextSimple(content: string): Promise<string[]> {
  return generateSparksForText({ content });
}
