import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface MermaidViewerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
  onDownload?: () => void;
  showDownload?: boolean;
}

export function MermaidViewer({
  isOpen,
  onClose,
  content,
  title,
  onDownload,
  showDownload = true,
}: MermaidViewerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoaded(false);
      setShowHint(true);
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && showHint) {
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showHint]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900 rounded-lg p-4"
          >
            <div
              className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:h-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
        {title && (
          <div className="text-white/90 text-sm font-medium truncate max-w-[60%] bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            {title}
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {showDownload && onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDownload}
              className="text-white/80 hover:text-white hover:bg-black/70 border-0 h-8 w-8 p-0 bg-black/50 backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-black/70 border-0 h-8 w-8 p-0 bg-black/50 backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
        aria-label="Close viewer"
      />

      <div className={`absolute top-16 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white/60 text-xs transition-all duration-500 ${
        showHint ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
      }`}>
        Press <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-xs font-mono">ESC</kbd> to close
      </div>

    </div>
  );
}
