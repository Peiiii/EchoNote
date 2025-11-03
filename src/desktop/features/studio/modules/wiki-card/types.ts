export interface ConceptCard {
  id: string;
  title: string;
  definition: string;
  keyPoints: string[];
  relatedConcepts: string[];
  examples: string[];
  references?: string[];
}

export interface ConceptCardsData {
  cards: ConceptCard[];
  generatedAt: number;
  contextChannelIds: string[];
}

