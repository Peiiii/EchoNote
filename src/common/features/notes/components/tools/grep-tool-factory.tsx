import { Tool } from "@agent-labs/agent-chat";
import {
  GrepToolRenderer,
  GrepToolArgs,
  GrepToolResult,
  GrepMatchItem,
} from "@/common/features/agent-tools/renderers/grep-tool-renderer";
import { localDataManager } from "@/common/features/note-search/services/local-data-manager.service";
import type { Note, NoteFilters } from "@/common/features/note-search/search.types";
import { firstValueFrom } from "rxjs";
import React from "react";
// import { firebaseAuthService } from '@/common/services/firebase/firebase-auth.service';
// import { firebaseNotesService } from '@/common/services/firebase/firebase-notes.service';
import { useConversationStore } from "@/common/features/ai-assistant/stores/conversation.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";

// Escape regex special characters for fixed string searches
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMatcher(args: GrepToolArgs): {
  test: (text: string) => { matched: boolean; matchText?: string; index?: number };
} {
  const pattern = args.pattern ?? "";
  const flags = args.ignoreCase ? "i" : "";

  if (!pattern) {
    return { test: () => ({ matched: false }) };
  }

  if (args.fixedStrings) {
    const term = args.ignoreCase ? pattern.toLowerCase() : pattern;
    return {
      test: (text: string) => {
        const hay = args.ignoreCase ? text.toLowerCase() : text;
        const idx = hay.indexOf(term);
        return { matched: idx >= 0, matchText: pattern, index: idx >= 0 ? idx : undefined };
      },
    };
  }

  // Regex or plain substring
  const source = args.isRegex ? pattern : escapeRegExp(pattern);
  const wordWrapped = args.word ? `\\b${source}\\b` : source;
  let re: RegExp;
  try {
    re = new RegExp(wordWrapped, flags);
  } catch {
    // Fallback to safe literal search
    const term = args.ignoreCase ? pattern.toLowerCase() : pattern;
    return {
      test: (text: string) => {
        const hay = args.ignoreCase ? text.toLowerCase() : text;
        const idx = hay.indexOf(term);
        return { matched: idx >= 0, matchText: pattern, index: idx >= 0 ? idx : undefined };
      },
    };
  }
  return {
    test: (text: string) => {
      const m = re.exec(text);
      return { matched: !!m, matchText: m?.[0], index: m?.index };
    },
  };
}

async function grepExecute(args: GrepToolArgs): Promise<GrepToolResult> {
  const start = Date.now();
  const timeoutMs = Math.max(500, Math.min(args.timeoutMs ?? 3000, 15000));
  const maxMatches = Math.max(1, Math.min(args.maxMatches ?? 200, 5000));
  const maxNotes = Math.max(1, Math.min(args.maxNotes ?? 500, 5000));
  const lineBefore = args.context !== undefined ? args.context : (args.before ?? 0);
  const lineAfter = args.context !== undefined ? args.context : (args.after ?? 0);

  // Build filters for initial note subset, respecting current context
  const filters: NoteFilters = {};
  let scopeSource: "args" | "contexts:channels" | "contexts:all" | "currentChannel" | "global" =
    "global";

  // Derive effective channels: args > conversation contexts > currentChannel > all
  let effectiveInclude: string[] | null = null; // null => all
  if (args.includeChannels && args.includeChannels.length > 0) {
    effectiveInclude = args.includeChannels;
    scopeSource = "args";
  } else {
    const convState = useConversationStore.getState();
    const convId = convState.currentConversationId;
    const conv = convState.conversations.find(c => c.id === convId);
    const mode = conv?.contexts?.mode;
    if (mode === "channels" && conv?.contexts?.channelIds && conv.contexts.channelIds.length > 0) {
      effectiveInclude = conv.contexts.channelIds;
      scopeSource = "contexts:channels";
    } else if (mode === "all") {
      effectiveInclude = null; // search all
      scopeSource = "contexts:all";
    } else {
      const { currentChannelId } = useNotesViewStore.getState();
      if (currentChannelId) {
        effectiveInclude = [currentChannelId];
        scopeSource = "currentChannel";
      } else {
        effectiveInclude = null;
        scopeSource = "global";
      }
    }
  }

  if (effectiveInclude && effectiveInclude.length > 0) {
    filters.channelIds = effectiveInclude;
  }
  if (args.tags && args.tags.length > 0) {
    filters.tags = args.tags;
  }
  if (args.sender) {
    filters.sender = args.sender;
  }
  if (args.dateRange) {
    const startTs = args.dateRange.start ?? 0;
    const endTs = args.dateRange.end ?? Number.MAX_SAFE_INTEGER;
    filters.dateRange = { start: startTs, end: endTs } as unknown as { start: number; end: number };
  }

  let allNotes: Note[] = await firstValueFrom(localDataManager.getNotes(filters));
  // If index is empty (or target channels have no notes), try a quick refresh
  if (
    allNotes.length === 0 ||
    (args.includeChannels &&
      args.includeChannels.every(cid => !allNotes.some(n => n.channelId === cid)))
  ) {
    try {
      if (args.includeChannels && args.includeChannels.length > 0) {
        for (const cid of args.includeChannels) {
          await localDataManager.updateChannel(cid);
        }
      } else {
        await localDataManager.updateAll();
      }
      allNotes = await firstValueFrom(localDataManager.getNotes(filters));
    } catch (_e) {
      // ignore refresh error
    }
  }
  if (args.excludeChannels && args.excludeChannels.length > 0) {
    const exclude = new Set(args.excludeChannels);
    allNotes = allNotes.filter(n => !exclude.has(n.channelId));
  }

  let scanned = 0;
  let matchedNotes = 0;
  let totalMatches = 0;
  const matches: GrepMatchItem[] = [];

  const matcher = buildMatcher(args);

  for (const note of allNotes) {
    if (Date.now() - start > timeoutMs) break;
    if (scanned >= maxNotes) break;
    scanned++;

    const content = note.content || "";
    if (!content) continue;

    const lines = content.split(/\r?\n/);
    const contexts: GrepMatchItem["contexts"] = [];
    let noteHasMatch = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const res = matcher.test(line);
      if (res.matched) {
        noteHasMatch = true;
        totalMatches++;

        // Context
        const before: string[] = [];
        const after: string[] = [];
        for (let b = Math.max(0, i - lineBefore); b < i; b++) before.push(lines[b]);
        for (let a = i + 1; a <= Math.min(lines.length - 1, i + lineAfter); a++)
          after.push(lines[a]);

        const matchText = args.onlyMatching && res.matchText ? res.matchText : line;
        contexts.push({ before, match: matchText, after, line: i + 1, offset: res.index });

        if (totalMatches >= maxMatches) break;
      }
      if (Date.now() - start > timeoutMs) break;
    }

    if (noteHasMatch) {
      matchedNotes++;
      if (!args.countOnly) {
        matches.push({
          noteId: note.id,
          channelId: note.channelId,
          timestamp: note.timestamp?.toLocaleString?.() || "",
          contexts,
        });
      }
    }

    if (totalMatches >= maxMatches) break;
  }

  const result: GrepToolResult = {
    summary: {
      scannedNotes: scanned,
      matchedNotes,
      totalMatches,
      tookMs: Date.now() - start,
      timedOut: Date.now() - start > timeoutMs,
    },
    scope: scopeSource,
    effectiveIncludeCount: effectiveInclude ? effectiveInclude.length : undefined,
  };

  if (args.countOnly) {
    // only summary
  } else if (args.listOnly) {
    result.noteIds = matches.map(m => m.noteId);
  } else {
    result.matches = matches;
  }

  return result;
}

export function createGrepTool(): Tool<GrepToolArgs, GrepToolResult> {
  return {
    name: "grepNotes",
    description:
      "Search notes with grep-like semantics. Supports regex, case-insensitive, word boundary, context lines, and filtering by channel/tags/date.",
    parameters: {
      type: "object",
      properties: {
        pattern: {
          type: "string",
          description: "Search pattern (string or regex source when isRegex=true)",
        },
        isRegex: { type: "boolean" },
        ignoreCase: { type: "boolean" },
        word: { type: "boolean" },
        fixedStrings: { type: "boolean" },
        before: { type: "number" },
        after: { type: "number" },
        context: { type: "number" },
        countOnly: { type: "boolean" },
        listOnly: { type: "boolean" },
        onlyMatching: { type: "boolean" },
        includeChannels: { type: "array", items: { type: "string" } },
        excludeChannels: { type: "array", items: { type: "string" } },
        tags: { type: "array", items: { type: "string" } },
        sender: { type: "string", enum: ["user", "ai"] },
        dateRange: {
          type: "object",
          properties: {
            start: { type: "number" },
            end: { type: "number" },
          },
        },
        maxMatches: { type: "number" },
        maxNotes: { type: "number" },
        snippetSize: { type: "number" },
        timeoutMs: { type: "number" },
      },
      required: ["pattern"],
    },
    execute: async toolCallArgs => {
      const result = await grepExecute(toolCallArgs as GrepToolArgs);
      return result;
    },
    render: invocation => React.createElement(GrepToolRenderer, { invocation }),
  };
}
