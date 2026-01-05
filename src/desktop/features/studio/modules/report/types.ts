export type ReportPriority = "low" | "medium" | "high";

export interface ReportActionItem {
  id: string;
  title: string;
  rationale: string;
  nextSteps: string[];
  priority: ReportPriority;
}

export interface ReportData {
  title: string;
  executiveSummary: string;
  keyThemes: string[];
  insights: string[];
  tensions: string[];
  actionItems: ReportActionItem[];
  openQuestions: string[];
  reportMarkdown: string;
  generatedAt: number;
  contextChannelIds: string[];
}

