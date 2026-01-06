export type PodcastSpeaker = "host" | "guest";

export interface PodcastTurn {
  speaker: PodcastSpeaker;
  text: string;
}

export interface AudioPodcastData {
  title: string;
  description: string;
  turns: PodcastTurn[];
  transcriptMarkdown: string;
  audioStorageKey?: string;
  audioMimeType?: string;
  generatedAt: number;
  contextChannelIds: string[];
}

