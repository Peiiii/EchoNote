export interface MindmapNode {
  id: string;
  label: string;
  /** Higher number -> more important. 1-5 recommended. */
  importance?: number;
  /** Optional grouping/category hint from the generator */
  group?: string;
  /** Optional persisted position (SVG pixels). When present, skip auto layout. */
  x?: number;
  y?: number;
}

export interface MindmapEdge {
  source: string;
  target: string;
  /** Strength/weight of relationship, 1.0 default */
  weight?: number;
}

export interface MindmapData {
  title: string;
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  generatedAt: number;
  contextChannelIds: string[];
  /** Optional hierarchical representation for XMind-like layout */
  tree?: MindmapTreeNode;
}

export interface MindmapTreeNode {
  id: string;
  label: string;
  children?: MindmapTreeNode[];
}
