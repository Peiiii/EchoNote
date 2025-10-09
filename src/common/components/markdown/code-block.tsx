import { Copy, Check } from "lucide-react";
import { Children, useMemo, useState } from "react";
import { MermaidBlock } from "./mermaid-block";

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isInline = !className || !match;
  const raw = useMemo(() => {
    // Join all child text nodes into a single string and trim a single trailing newline
    return Children.toArray(children)
      .map(chunk => (typeof chunk === "string" ? chunk : ""))
      .join("")
      .replace(/\n$/, "");
  }, [children]);

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
    <div className="group relative my-4">
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 border-b border-gray-600 dark:border-gray-600 rounded-t px-3 py-2">
        <div className="flex items-center space-x-2">
          {language && (
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
              {language}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150 opacity-0 group-hover:opacity-100"
          title={copied ? "Copied!" : "Copy code"}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>

      <pre className="bg-gray-900 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-gray-600 dark:border-gray-600">
        <code
          className={`${className} text-sm leading-relaxed font-mono text-gray-100 dark:text-gray-200`}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}
