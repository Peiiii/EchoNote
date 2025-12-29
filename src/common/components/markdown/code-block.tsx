import { Copy, Check } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { MermaidBlock } from "./mermaid-block";

type PreProps = DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement> & {
  node?: unknown;
};

type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  node?: unknown;
};

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
    loadingLangs[key] = importer()
      .then(mod => {
        // Some modules export default, some named, but for prism it should be default
        const m = mod as { default?: unknown } | unknown;
        const def = (m as { default?: unknown }).default ?? (mod as unknown);
        SyntaxHighlighter.registerLanguage(key, def);
        loadedLangs.add(key);
      })
      .catch(err => {
        console.warn("Failed to load prism language:", key, err);
      });
  }
  await loadingLangs[key];
}

const getLanguageFromClassName = (className?: string) => {
  const match = /language-([a-z0-9]+)/i.exec(className || "");
  return match ? match[1] : "";
};

const flattenText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenText(node.props.children);
  }
  return "";
};

const normalizeCodeText = (children: ReactNode): string =>
  flattenText(children).replace(/\n$/, "");

interface CodeBlockRendererProps {
  code: string;
  languageHint: string;
  containerClassName?: string;
}

const CodeBlockRenderer = ({
  code,
  languageHint,
  containerClassName,
}: CodeBlockRendererProps) => {
  const normalizedLanguage = languageHint.toLowerCase();
  const [hlVersion, setHlVersion] = useState(0);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );
  const [copied, setCopied] = useState(false);
  const canHighlight = Boolean(normalizedLanguage && loadedLangs.has(normalizedLanguage));

  useMemo(() => {
    if (!normalizedLanguage || normalizedLanguage === "mermaid") {
      return;
    }
    (async () => {
      await ensurePrismLanguage(normalizedLanguage);
      setHlVersion(v => v + 1);
    })();
  }, [normalizedLanguage]);

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
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={["group/code relative my-4", containerClassName].filter(Boolean).join(" ")}>
      <div className="flex items-center justify-between bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-t px-2 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:text-gray-300">
            {languageHint || "text"}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      {canHighlight ? (
        <SyntaxHighlighter
          key={hlVersion}
          style={isDark ? vscDarkPlus : oneLight}
          language={normalizedLanguage}
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
          {code}
        </SyntaxHighlighter>
      ) : (
        <pre className="bg-slate-50 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700 border-t-0">
          <code className="text-sm leading-relaxed font-mono text-slate-800 dark:text-gray-200">
            {code}
          </code>
        </pre>
      )}
    </div>
  );
};

export const MarkdownCodeBlock = ({
  children,
  className,
}: PreProps) => {
  const childArray = Children.toArray(children);
  const languageHint =
    getLanguageFromClassName(className) ||
    childArray.reduce<string>((lang, child) => {
      if (lang) return lang;
      if (
        isValidElement<{ className?: string }>(child) &&
        typeof child.props.className === "string"
      ) {
        return getLanguageFromClassName(child.props.className) || lang;
      }
      return lang;
    }, "");

  const codeText = normalizeCodeText(children);

  if (!codeText) {
    return (
      <pre className={className}>
        {children}
      </pre>
    );
  }

  if (languageHint.toLowerCase() === "mermaid") {
    return <MermaidBlock code={codeText} />;
  }

  return (
    <CodeBlockRenderer
      code={codeText}
      languageHint={languageHint}
      containerClassName={className}
    />
  );
};

export const MarkdownInlineCode = ({
  className,
  children,
  ...props
}: CodeProps) => {
  return (
    <code
      className={`inline-block bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-300 dark:border-gray-600${
        className ? ` ${className}` : ""
      }`}
      {...props}
    >
      {children}
    </code>
  );
};
