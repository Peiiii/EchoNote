import { Check, Copy, Download, Maximize2, Code2, Image as ImageIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PremiumDiagramViewer } from "@/common/components/ui/premium-viewer";

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
  const [open, setOpen] = useState(false);
  const [showSource, setShowSource] = useState(false);

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

  const handleDownloadSvg = () => {
    if (!svg) return;
    try {
      const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "diagram.svg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Download SVG failed:", err);
    }
  };

  if (error) {
    return (
      <div className="group/code relative my-4">
        <div className="flex items-center justify-between bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-t px-2 py-1">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:text-gray-300">MERMAID</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSource(s => !s)}
              className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
              title={showSource ? "View diagram" : "View source"}
            >
              {showSource ? <ImageIcon className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
              title={copied ? "Copied!" : "Copy source"}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
        {showSource ? (
          <pre className="bg-slate-50 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700 border-t-0">
            <code className="text-sm leading-relaxed font-mono text-slate-800 dark:text-gray-200 whitespace-pre">{code}</code>
          </pre>
        ) : (
          <div className="bg-white dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700">
            <code className="text-sm text-red-400">Failed to render mermaid diagram</code>
          </div>
        )}
      </div>
    );
  }

  return (
      <div className="group/code relative my-4" ref={containerRef}>
      <div className="flex items-center justify-between bg-slate-100 dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-t px-2 py-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-600 dark:text-gray-300">MERMAID</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSource(s => !s)}
            className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
            title={showSource ? "View diagram" : "View source"}
          >
            {showSource ? <ImageIcon className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
          </button>
          {!showSource && (
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
              title="View larger"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={showSource ? () => {
              // download .mmd
              try {
                const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'diagram.mmd';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (err) {
                console.warn('Download mmd failed:', err);
              }
            } : handleDownloadSvg}
            className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
            title={showSource ? "Download .mmd" : "Download SVG"}
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-6 h-6 text-xs text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-black/10 dark:hover:bg-gray-700/70 rounded transition-all duration-150 opacity-0 group-hover/code:opacity-100"
            title={copied ? "Copied!" : "Copy source"}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
      {showSource ? (
        <pre className="bg-slate-50 dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700">
          <code className="text-sm leading-relaxed font-mono text-slate-800 dark:text-gray-200 whitespace-pre">{code}</code>
        </pre>
      ) : (
        <div
          className="bg-white dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-slate-200 dark:border-gray-700 border-t-0 cursor-zoom-in"
          onDoubleClick={() => setOpen(true)}
          // SVG markup from mermaid
          dangerouslySetInnerHTML={{ __html: svg || "" }}
        />
      )}

      <PremiumDiagramViewer
        isOpen={open}
        onClose={() => setOpen(false)}
        content={svg || ""}
        title="Diagram Preview"
        onDownload={handleDownloadSvg}
        showDownload={!!svg}
      />
    </div>
  );
}
