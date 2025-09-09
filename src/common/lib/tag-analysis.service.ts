// Simple tag analysis service for AI prompt enhancement
export interface TagAnalysisResult {
  enhancedPrompt: string;
  hasTagContext: boolean;
}

// XML tag handlers - easily extensible
// Note: tags are stored without # prefix, # is only for display
const TAG_HANDLERS: Record<string, (content: string) => string> = {
  'prompt': (content: string) => `<instruction>${content}</instruction>`,
  'translate': (content: string) => `<translate>${content}</translate>`,
  'to-english': (content: string) => `<translate-to-english>${content}</translate-to-english>`,
};

/**
 * Build enhanced prompt based on tags using XML format
 * Extensible design - supports multiple tag handlers in parallel
 * Uses XML tags for clear instruction structure
 */
export function buildTaggedPrompt(content: string, tags: string[]): TagAnalysisResult {
  // Filter for relevant tags (no # prefix handling needed)
  const relevantTags = tags.filter(tag => TAG_HANDLERS[tag.toLowerCase()]);
  
  if (relevantTags.length === 0) {
    return {
      enhancedPrompt: content,
      hasTagContext: false
    };
  }
  
  // Apply all relevant tag handlers in parallel using XML format
  const tagPrompts = relevantTags.map(tag => TAG_HANDLERS[tag.toLowerCase()](content));
  const enhancedPrompt = `${content}\n\nSpecial instructions:\n${tagPrompts.join('\n')}`;
  
  return {
    enhancedPrompt,
    hasTagContext: true
  };
}

/**
 * Check if a tag has special analysis context
 */
export function hasTagContext(tag: string): boolean {
  return TAG_HANDLERS[tag.toLowerCase()] !== undefined;
}

/**
 * Get all supported tags
 */
export function getSupportedTags(): string[] {
  return Object.keys(TAG_HANDLERS);
}
