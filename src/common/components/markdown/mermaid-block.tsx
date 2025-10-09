import { Check, Copy } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface MermaidBlockProps {
  code: string;
}

// Render Mermaid diagrams on demand to keep bundle size small.
export function MermaidBlock({ code }: MermaidBlockProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const id = useMemo(() => `mermaid-${Math.random().toString(36).slice(2)}`, []);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const mod = await import("mermaid");
        // Theme sync with dark mode if present
        const isDark = document.documentElement.classList.contains("dark");
        mod.default.initialize({
          startOnLoad: false,
          securityLevel: "loose", // allow links and glyphs inside SVG
          theme: isDark ? "dark" : "default",
        });
        const { svg, bindFunctions } = await mod.default.render(id, code);
        if (cancelled) return;
        setSvg(svg);
        // Bind any interactions
        if (bindFunctions && containerRef.current) bindFunctions(containerRef.current);
      } catch (e: unknown) {
        if (cancelled) return;
        const msg =
          typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message)
            : "Failed to render mermaid diagram";
        setError(msg);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [code, id]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // Non-fatal: copy may fail in insecure context or without permission
      console.warn("Copy mermaid source failed:", err);
    }
  };

  if (error) {
    return (
      <div className="group relative my-4">
        <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 border-b border-gray-600 dark:border-gray-600 rounded-t px-3 py-2">
          <span className="text-xs text-red-400">Mermaid render failed</span>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150"
            title={copied ? "Copied!" : "Copy source"}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
        <pre className="bg-gray-900 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-gray-600 dark:border-gray-600">
          <code className="text-sm leading-relaxed font-mono text-gray-100 dark:text-gray-200 whitespace-pre">{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="group relative my-4" ref={containerRef}>
      <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 border-b border-gray-600 dark:border-gray-600 rounded-t px-3 py-2">
        <span className="text-xs font-medium text-gray-300">mermaid</span>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150"
          title={copied ? "Copied!" : "Copy source"}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <div
        className="bg-white dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-gray-600 dark:border-gray-600"
        // SVG markup from mermaid
        dangerouslySetInnerHTML={{ __html: svg || "" }}
      />
    </div>
  );
}
