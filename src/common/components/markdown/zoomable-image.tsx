import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { ImageViewer } from "@/common/components/ui/image-viewer";

interface ZoomableImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [errored, setErrored] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const filename = (() => {
    if (!src) return "image";
    try {
      const url = new URL(src, window.location.href);
      const pathname = url.pathname.split("/").pop() || "image";
      return pathname || "image";
    } catch {
      return "image";
    }
  })();

  const handleDownload = async () => {
    if (!src) return;
    try {
      // Try to fetch the image to avoid cross-origin download limitations
      const res = await fetch(src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: direct link (may be blocked by cross-origin headers)
      const a = document.createElement("a");
      a.href = src;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  return (
    <>
      <span 
        className="inline-block relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          className={`${errored ? "cursor-default" : "cursor-zoom-in"} ${className ?? ""}`}
          loading="lazy"
          onLoad={() => setErrored(false)}
          onError={() => setErrored(true)}
          onClick={() => !errored && setOpen(true)}
        />
        {!errored && isHovered && (
          <button
            type="button"
            className="absolute top-1 right-1 flex items-center justify-center w-6 h-6 rounded bg-black/50 text-white transition-opacity duration-200"
            title="View larger"
            onClick={() => setOpen(true)}
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </span>

      <ImageViewer
        isOpen={open}
        onClose={() => setOpen(false)}
        src={src || ""}
        alt={alt}
        title={alt || filename}
        onDownload={!errored ? handleDownload : undefined}
        showDownload={!errored}
      />
    </>
  );
}
