import { Check, Copy, Download, Maximize2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";

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
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150"
            title="View larger"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150"
            title="Download SVG"
          >
            <Download className="w-3 h-3" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center w-6 h-6 text-xs text-gray-400 hover:text-gray-200 bg-gray-700 hover:bg-gray-600 rounded transition-all duration-150"
            title={copied ? "Copied!" : "Copy source"}
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
      <div
        className="bg-white dark:bg-gray-950 rounded-b p-3 overflow-x-auto border border-gray-600 dark:border-gray-600 cursor-zoom-in"
        onDoubleClick={() => setOpen(true)}
        // SVG markup from mermaid
        dangerouslySetInnerHTML={{ __html: svg || "" }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>Diagram Preview</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-auto rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div dangerouslySetInnerHTML={{ __html: svg || "" }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDownloadSvg} size="sm">
              <Download className="w-4 h-4 mr-2" /> Download SVG
            </Button>
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
