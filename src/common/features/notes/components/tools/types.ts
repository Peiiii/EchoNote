import { ToolInvocation, ToolResult } from "@agent-labs/agent-chat";

export interface ReadNoteRenderArgs {
  noteId: string;
}

export interface ReadNoteRenderResult {
  found: boolean;
  noteId: string;
  timestampReadable?: string;
  contentLength?: number;
  content: string;
}

export interface DeleteNoteRenderArgs {
  noteId: string;
}

export interface DeleteNoteRenderResult {
  status: "deleted" | "cancelled";
  message: string;
}

export interface UpdateNoteRenderArgs {
  noteId: string;
  content: string;
}

export interface UpdateNoteRenderResult {
  status: "updated" | "cancelled";
  message: string;
}

export interface CreateNoteRenderArgs {
  content: string;
}

export interface CreateNoteRenderResult {
  status: "created" | "cancelled";
  message: string;
}

export interface InteractiveToolProps<ARGS, RESULT> {
  invocation: ToolInvocation<ARGS, RESULT>;
  onResult: (result: ToolResult) => void;
  channelId: string;
}

export interface ReadNoteRenderProps {
  invocation: ToolInvocation<ReadNoteRenderArgs, ReadNoteRenderResult>;
  channelId: string;
}
