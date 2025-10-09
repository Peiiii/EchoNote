import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/common/components/ui/dialog";
import { Button } from "@/common/components/ui/button";
import { Download, Maximize2 } from "lucide-react";

interface ZoomableImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

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
      <span className="group inline-block relative">
        <img
          src={src}
          alt={alt}
          className={`cursor-zoom-in ${className ?? ""}`}
          loading="lazy"
          onClick={() => setOpen(true)}
        />
        <button
          type="button"
          className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center w-6 h-6 rounded bg-black/50 text-white"
          title="View larger"
          onClick={() => setOpen(true)}
        >
          <Maximize2 className="w-3 h-3" />
        </button>
      </span>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw]">
          <DialogHeader>
            <DialogTitle>{alt || filename}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] overflow-auto">
            <img src={src} alt={alt} className="mx-auto max-w-[90vw] max-h-[78vh] object-contain" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDownload} size="sm">
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <DialogClose asChild>
              <Button size="sm">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

