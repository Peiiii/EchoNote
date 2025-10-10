import { useState, useEffect } from "react";
import { X, Download, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/common/components/ui/button";

interface PremiumViewerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  onDownload?: () => void;
  showDownload?: boolean;
  className?: string;
}

export function PremiumViewer({
  isOpen,
  onClose,
  children,
  title,
  onDownload,
  showDownload = true,
  className = "",
}: PremiumViewerProps) {
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
          } ${className}`}
        >
          {children}
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

interface PremiumImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt?: string;
  title?: string;
  onDownload?: () => void;
  showDownload?: boolean;
}

export function PremiumImageViewer({
  isOpen,
  onClose,
  src,
  alt,
  title,
  onDownload,
  showDownload = true,
}: PremiumImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, scale * delta));
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen]);

  return (
    <PremiumViewer
      isOpen={isOpen}
      onClose={onClose}
      title={title || alt}
      onDownload={onDownload}
      showDownload={showDownload}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          className={`max-w-full max-h-full object-contain transition-all duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${isDragging ? "cursor-grabbing" : scale > 1 ? "cursor-grab" : "cursor-zoom-in"}`}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "center center",
          }}
          onLoad={() => setImageLoaded(true)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          draggable={false}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setScale(Math.max(0.1, scale * 0.9))}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-white/80 text-xs font-medium min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setScale(Math.min(5, scale * 1.1))}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-white/20" />
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </PremiumViewer>
  );
}

interface PremiumDiagramViewerProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  title?: string;
  onDownload?: () => void;
  showDownload?: boolean;
}

export function PremiumDiagramViewer({
  isOpen,
  onClose,
  content,
  title,
  onDownload,
  showDownload = true,
}: PremiumDiagramViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(5, scale * delta));
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  return (
    <PremiumViewer
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      onDownload={onDownload}
      showDownload={showDownload}
    >
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900 rounded-lg"
        onWheel={handleWheel}
      >
        <div
          className="transition-all duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transformOrigin: "center center",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setScale(Math.max(0.1, scale * 0.9))}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-white/80 text-xs font-medium min-w-[3rem] text-center">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setScale(Math.min(5, scale * 1.1))}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-white/20" />
        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="text-white/80 hover:text-white hover:bg-white/10 border-0 h-8 w-8 p-0"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </PremiumViewer>
  );
}
