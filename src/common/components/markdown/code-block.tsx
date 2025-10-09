import { Copy, Check } from "lucide-react";
import { Children, useEffect, useMemo, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MermaidBlock } from "./mermaid-block";

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

// Map common language ids to Prism loader imports (dynamic). Keep this list lean.
const languageImporters: Record<string, () => Promise<unknown>> = {
  javascript: () => import("react-syntax-highlighter/dist/esm/languages/prism/javascript"),
  jsx: () => import("react-syntax-highlighter/dist/esm/languages/prism/jsx"),
  typescript: () => import("react-syntax-highlighter/dist/esm/languages/prism/typescript"),
  tsx: () => import("react-syntax-highlighter/dist/esm/languages/prism/tsx"),
  json: () => import("react-syntax-highlighter/dist/esm/languages/prism/json"),
  bash: () => import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
  shell: () => import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
  sh: () => import("react-syntax-highlighter/dist/esm/languages/prism/bash"),
  yaml: () => import("react-syntax-highlighter/dist/esm/languages/prism/yaml"),
  yml: () => import("react-syntax-highlighter/dist/esm/languages/prism/yaml"),
  markdown: () => import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
  md: () => import("react-syntax-highlighter/dist/esm/languages/prism/markdown"),
  css: () => import("react-syntax-highlighter/dist/esm/languages/prism/css"),
  scss: () => import("react-syntax-highlighter/dist/esm/languages/prism/scss"),
  html: () => import("react-syntax-highlighter/dist/esm/languages/prism/markup"),
  xml: () => import("react-syntax-highlighter/dist/esm/languages/prism/markup"),
  graphql: () => import("react-syntax-highlighter/dist/esm/languages/prism/graphql"),
  go: () => import("react-syntax-highlighter/dist/esm/languages/prism/go"),
  java: () => import("react-syntax-highlighter/dist/esm/languages/prism/java"),
  python: () => import("react-syntax-highlighter/dist/esm/languages/prism/python"),
  ruby: () => import("react-syntax-highlighter/dist/esm/languages/prism/ruby"),
  rust: () => import("react-syntax-highlighter/dist/esm/languages/prism/rust"),
  php: () => import("react-syntax-highlighter/dist/esm/languages/prism/php"),
  c: () => import("react-syntax-highlighter/dist/esm/languages/prism/c"),
  cpp: () => import("react-syntax-highlighter/dist/esm/languages/prism/cpp"),
  docker: () => import("react-syntax-highlighter/dist/esm/languages/prism/docker"),
  nginx: () => import("react-syntax-highlighter/dist/esm/languages/prism/nginx"),
  sql: () => import("react-syntax-highlighter/dist/esm/languages/prism/sql"),
  diff: () => import("react-syntax-highlighter/dist/esm/languages/prism/diff"),
};

const loadedLangs = new Set<string>();
const loadingLangs: Record<string, Promise<void>> = {};

async function ensurePrismLanguage(lang?: string) {
  if (!lang) return;
  const key = lang.toLowerCase();
  if (key === "mermaid") return; // handled separately
  if (loadedLangs.has(key)) return;
  const importer = languageImporters[key];
  if (!importer) return;
  if (!loadingLangs[key]) {
    loadingLangs[key] = importer().then(mod => {
      // Some modules export default, some named, but for prism it should be default
      const m = mod as { default?: unknown } | unknown;
      const def = (m as { default?: unknown }).default ?? (mod as unknown);
      SyntaxHighlighter.registerLanguage(key, def);
      loadedLangs.add(key);
    }).catch(err => {
      console.warn("Failed to load prism language:", key, err);
    });
  }
  await loadingLangs[key];
}
export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isInline = !className || !match;
  const [hlVersion, setHlVersion] = useState(0);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined" ? document.documentElement.classList.contains("dark") : false
  );
  const raw = useMemo(() => {
    // Join all child text nodes into a single string and trim a single trailing newline
    return Children.toArray(children)
      .map(chunk => (typeof chunk === "string" ? chunk : ""))
      .join("")
      .replace(/\n$/, "");
  }, [children]);

  // Load language definition on demand
  useMemo(() => {
    // useMemo instead of useEffect to avoid hydration mismatch; we only bump a version after promise
    (async () => {
      await ensurePrismLanguage(language);
      setHlVersion(v => v + 1);
    })();
  }, [language]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (isInline) {
    return (
      <code className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300 dark:border-gray-600">
        {children}
      </code>
    );
  }

  // Mermaid fenced code block: render diagram
  if (language === "mermaid") {
    return <MermaidBlock code={raw} />;
  }

  return (
    <div className="group/code relative my-4">
      <div className="flex items-center justify-between bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-t px-2 py-1">
        <div className="flex items-center space-x-2">
          {language && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:text-gray-300">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      {language && loadedLangs.has(language.toLowerCase()) ? (
        <SyntaxHighlighter
          key={hlVersion}
          style={isDark ? vscDarkPlus : oneLight}
          language={language}
          PreTag="div"
          className="rounded-b overflow-auto w-full max-w-full min-w-0 border border-slate-200 dark:border-gray-700 border-t-0"
          wrapLongLines
          customStyle={{
            whiteSpace: "pre",
            overflowX: "auto",
            overflowY: "auto",
            background: isDark ? "#0b0b0b" : "#f8fafc",
            margin: 0,
            padding: "0.75rem",
          }}
        >
          {raw}
        </SyntaxHighlighter>
      ) : (
        <pre className="bg-slate-50 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700 border-t-0">
          <code className="text-sm leading-relaxed font-mono text-slate-800 dark:text-gray-200">
            {raw}
          </code>
        </pre>
      )}
    </div>
  );
}
