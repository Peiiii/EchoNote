import { Search } from "lucide-react";
import { DisplayToolPanel, EmptyState, ErrorMessage } from "@/common/lib/agent-tools-ui";
import { ToolInvocation } from "@agent-labs/agent-chat";
import { useTranslation } from "react-i18next";

export interface GrepToolArgs {
  pattern: string;
  isRegex?: boolean;
  ignoreCase?: boolean;
  word?: boolean;
  fixedStrings?: boolean;
  before?: number;
  after?: number;
  context?: number;
  countOnly?: boolean;
  listOnly?: boolean;
  onlyMatching?: boolean;
  includeChannels?: string[];
  excludeChannels?: string[];
  tags?: string[];
  sender?: "user" | "ai";
  dateRange?: { start?: number; end?: number };
  maxMatches?: number;
  maxNotes?: number;
  snippetSize?: number;
  timeoutMs?: number;
}

export interface GrepMatchContext {
  before: string[];
  match: string;
  after: string[];
  line?: number;
  offset?: number;
}

export interface GrepMatchItem {
  noteId: string;
  channelId: string;
  timestamp: string; // human readable for renderer convenience
  contexts: GrepMatchContext[];
}

export interface GrepToolResult {
  summary: {
    scannedNotes: number;
    matchedNotes: number;
    totalMatches: number;
    tookMs: number;
    timedOut: boolean;
  };
  matches?: GrepMatchItem[];
  noteIds?: string[]; // when listOnly
  // User-facing context summary (not debug)
  scope?: string; // args | contexts:channels | contexts:all | currentChannel | global
  effectiveIncludeCount?: number; // number of channels considered in scope
}

interface GrepToolRendererProps {
  invocation: ToolInvocation<GrepToolArgs, GrepToolResult>;
}

export function GrepToolRenderer({ invocation }: GrepToolRendererProps) {
  const { t } = useTranslation();
  // Build a user-facing grep command string from args (context scope is not part of this command)
  const buildGrepCommand = (args: Partial<GrepToolArgs>): string => {
    const a = args || {};
    const parts: string[] = ["grep"];
    if (a.ignoreCase) parts.push("-i");
    if (a.word) parts.push("-w");
    if (a.fixedStrings) parts.push("-F");
    if (a.onlyMatching) parts.push("-o");
    if (a.countOnly) parts.push("-c");
    if (a.listOnly) parts.push("-l");
    if (a.context !== undefined) parts.push("-C", String(a.context));
    if (a.before !== undefined) parts.push("-B", String(a.before));
    if (a.after !== undefined) parts.push("-A", String(a.after));
    if (a.maxMatches !== undefined) parts.push("--max-count", String(a.maxMatches));
    // Do not encode channels/scope/timeout/maxNotes in grep command – these are system/runtime controls

    // Pattern
    const pattern = a.pattern ?? "";
    const quoted = `'${String(pattern).replace(/'/g, "'\\''")}'`;
    if (a.isRegex) {
      // Regex is default for grep; nothing special to add
    } else {
      // For literal, prefer -F already added; keep as-is
    }
    parts.push("--", quoted);
    return parts.join(" ");
  };

  // User-facing parameter panel: show grep command and context (scope)
  const ParamPanel = ({
    args,
    scope,
    effectiveIncludeCount,
  }: {
    args: Partial<GrepToolArgs>;
    scope?: string;
    effectiveIncludeCount?: number;
  }) => {
    const cmd = buildGrepCommand(args);
    return (
      <div className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 space-y-2">
        <div className="text-xs text-gray-600 dark:text-gray-400">{t("agentTools.grep.command")}</div>
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded overflow-x-auto">
          {cmd}
        </pre>
        <div className="text-xs text-gray-700 dark:text-gray-300">
          <span className="inline-block mr-2">
            {t("agentTools.grep.scope")}: <code>{scope || t("agentTools.grep.global")}</code>
          </span>
          {typeof effectiveIncludeCount === "number" && (
            <span className="inline-block">
              {t("agentTools.grep.channels")}: <code>{effectiveIncludeCount}</code>
            </span>
          )}
        </div>
        <div className="text-[10px] text-gray-500 dark:text-gray-400">
          {t("agentTools.grep.scopeNote")}
        </div>
      </div>
    );
  };

  return (
    <DisplayToolPanel<GrepToolArgs, GrepToolResult>
      invocation={invocation}
      icon={<Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
      title={t("agentTools.grep.title")}
      loadingText={t("agentTools.grep.searching")}
      successStatusText={result => {
        const s = result?.summary;
        if (!s) return t("agentTools.grep.finished");
        const suffix = s.timedOut ? ` (${t("agentTools.grep.timedOut")})` : "";
        return t("agentTools.grep.successStatus", {
          totalMatches: s.totalMatches,
          matchedNotes: s.matchedNotes,
          scannedNotes: s.scannedNotes,
          tookMs: s.tookMs,
          suffix
        });
      }}
      errorStatusText={() => t("agentTools.grep.failed")}
      readyStatusText={t("agentTools.grep.ready")}
      contentScrollable={true}
      headerCardClassName="border-blue-200 dark:border-blue-800"
      contentCardClassName="border-gray-200 dark:border-gray-800 mt-2"
    >
      {(args, result, error) => {
        // Parameter summary panel (always visible)
        const paramPanel = (
          <ParamPanel args={args} effectiveIncludeCount={result?.effectiveIncludeCount} />
        );
        if (error) {
          return (
            <div className="space-y-3">
              {paramPanel}
              <ErrorMessage
                error={error}
                fallbackMessage={t("agentTools.grep.errorOccurred")}
                variant="alert"
              />
            </div>
          );
        }

        if (!result) {
          return paramPanel;
        }

        if (
          result.noteIds &&
          result.noteIds.length > 0 &&
          (!result.matches || result.matches.length === 0)
        ) {
          return (
            <div className="space-y-3">
              {paramPanel}
              <div className="text-sm text-gray-600 dark:text-gray-400">{t("agentTools.grep.matchedNotes")}</div>
              <div className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <ul className="list-disc pl-6 text-sm">
                  {result.noteIds.map(id => (
                    <li key={id}>
                      <code>{id}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }

        if (!result.matches || result.matches.length === 0) {
          return (
            <div className="space-y-3">
              {paramPanel}
              <EmptyState icon={Search} message={t("agentTools.grep.noMatches")} />
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {paramPanel}
            {result.matches.map(m => (
              <div
                key={m.noteId}
                className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 space-y-2"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("agentTools.grep.noteLabel")} <code>{m.noteId}</code>
                  {" "}
                  <span aria-hidden="true">•</span> {t("agentTools.grep.channelLabel")} <code>{m.channelId}</code>
                  {" "}
                  <span aria-hidden="true">•</span> {m.timestamp}
                </div>
                <div className="font-mono text-sm">
                  {m.contexts.map((c, idx) => (
                    <div key={idx} className="mb-3">
                      {c.before?.map((t, i) => (
                        <div key={`b-${i}`} className="text-gray-500 dark:text-gray-400">
                          {t}
                        </div>
                      ))}
                      <div className="bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">
                        {c.match}
                      </div>
                      {c.after?.map((t, i) => (
                        <div key={`a-${i}`} className="text-gray-500 dark:text-gray-400">
                          {t}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </DisplayToolPanel>
  );
}
