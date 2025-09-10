// Universal tag analysis service for AI prompt enhancement
export interface TagAnalysisResult {
  enhancedPrompt: string;
  hasTagContext: boolean;
}

// Tag rule definition interface
export interface TagRule {
  pattern: RegExp | string;
  handler: (tag: string, content: string) => string;
  priority?: number;
  description?: string;
}

// Universal tag processing framework
export class TagProcessor {
  private rules: TagRule[] = [];

  constructor() {
    this.initializeDefaultRules();
  }

  // Add a new tag rule
  addRule(rule: TagRule): void {
    this.rules.push(rule);
    // Sort by priority (higher priority first)
    this.rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  // Remove a rule by pattern
  removeRule(pattern: string | RegExp): void {
    this.rules = this.rules.filter(rule => 
      rule.pattern.toString() !== pattern.toString()
    );
  }

  // Process tags using the rule engine
  processTags(content: string, tags: string[]): TagAnalysisResult {
    const tagPrompts: string[] = [];
    
    for (const tag of tags) {
      const rule = this.findMatchingRule(tag);
      if (rule) {
        const result = rule.handler(tag, content);
        if (result) {
          tagPrompts.push(result);
        }
      }
    }

    if (tagPrompts.length === 0) {
      return {
        enhancedPrompt: content,
        hasTagContext: false
      };
    }

    const enhancedPrompt = `${content}\n\nSpecial instructions:\n${tagPrompts.join('\n')}`;
    
    return {
      enhancedPrompt,
      hasTagContext: true
    };
  }

  // Check if a tag has context
  hasTagContext(tag: string): boolean {
    return this.findMatchingRule(tag) !== null;
  }

  // Get all supported patterns
  getSupportedPatterns(): Array<{pattern: string, description: string, priority: number}> {
    return this.rules.map(rule => ({
      pattern: rule.pattern.toString(),
      description: rule.description || 'No description',
      priority: rule.priority || 0
    }));
  }

  private findMatchingRule(tag: string): TagRule | null {
    for (const rule of this.rules) {
      if (typeof rule.pattern === 'string') {
        if (tag.toLowerCase() === rule.pattern.toLowerCase()) {
          return rule;
        }
      } else {
        if (rule.pattern.test(tag)) {
          return rule;
        }
      }
    }
    return null;
  }

  private initializeDefaultRules(): void {
    // Exact match rules
    this.addRule({
      pattern: 'prompt',
      handler: (_tag, content) => `<instruction>${content}</instruction>`,
      priority: 10,
      description: 'Convert content to instruction'
    });

    this.addRule({
      pattern: 'translate',
      handler: (_tag, content) => `<translate>${content}</translate>`,
      priority: 10,
      description: 'Translate content'
    });

    this.addRule({
      pattern: 'to-english',
      handler: (_tag, content) => `<translate-to-english>${content}</translate-to-english>`,
      priority: 10,
      description: 'Translate content to English'
    });

    // Prefix-based rules
    this.addRule({
      pattern: /^prompt:/i,
      handler: (tag) => {
        const instruction = tag.substring(7).trim();
        return instruction ? `<instruction>${instruction}</instruction>` : '';
      },
      priority: 20,
      description: 'Any tag starting with prompt: becomes an instruction'
    });

    // You can easily add more rules here or through the addRule method
  }
}

// Global tag processor instance
const tagProcessor = new TagProcessor();

/**
 * Build enhanced prompt based on tags using the universal rule engine
 * Uses XML tags for clear instruction structure
 * Supports both exact match and pattern-based rules
 */
export function buildTaggedPrompt(content: string, tags: string[]): TagAnalysisResult {
  return tagProcessor.processTags(content, tags);
}

/**
 * Check if a tag has special analysis context
 * Uses the universal rule engine for pattern matching
 */
export function hasTagContext(tag: string): boolean {
  return tagProcessor.hasTagContext(tag);
}

/**
 * Get all supported patterns and their descriptions
 * Returns detailed information about all registered rules
 */
export function getSupportedTags(): Array<{pattern: string, description: string, priority: number}> {
  return tagProcessor.getSupportedPatterns();
}

/**
 * Add a new tag rule to the processor
 * This allows dynamic extension of tag processing capabilities
 */
export function addTagRule(rule: TagRule): void {
  tagProcessor.addRule(rule);
}

/**
 * Remove a tag rule from the processor
 */
export function removeTagRule(pattern: string | RegExp): void {
  tagProcessor.removeRule(pattern);
}

/**
 * Get the global tag processor instance for advanced usage
 */
export function getTagProcessor(): TagProcessor {
  return tagProcessor;
}
