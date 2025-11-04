import { Button } from "@/common/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { Channel } from "@/core/stores/notes-data.store";
import { Check, Copy, Globe, Link2 } from "lucide-react";
import { useState } from "react";

interface PublishSpaceDialogProps {
  channel: Channel;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PublishSpaceDialog({
  channel,
  isOpen,
  onOpenChange,
}: PublishSpaceDialogProps) {
  const { publishSpace, unpublishSpace } = useNotesDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = channel.shareToken
    ? `${window.location.origin}/#/space/${channel.shareToken}`
    : "";

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await publishSpace(channel.id);
    } catch (error) {
      console.error("Error publishing space:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnpublish = async () => {
    setIsLoading(true);
    try {
      await unpublishSpace(channel.id);
      setIsCopied(false);
    } catch (error) {
      console.error("Error unpublishing space:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publish Space
          </DialogTitle>
          <DialogDescription>
            {channel.shareToken
              ? "Your space is published. Share the link below to allow others to view it."
              : "Publish this space to make it accessible via a shareable link."}
          </DialogDescription>
        </DialogHeader>

        {channel.shareToken ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 font-mono text-sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 className="h-4 w-4" />
              <span>Once published, you'll get a shareable link</span>
            </div>
          </div>
        )}

        <DialogFooter>
          {channel.shareToken ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleUnpublish}
              disabled={isLoading}
            >
              {isLoading ? "Unpublishing..." : "Unpublish"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

