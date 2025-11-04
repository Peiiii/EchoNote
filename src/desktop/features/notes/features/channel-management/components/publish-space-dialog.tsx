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
import { modal } from "@/common/components/modal/modal.store";
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
    modal.confirm({
      title: "Unpublish Space",
      description: `This will make the space "${channel.name}" private. Anyone with the share link will no longer be able to access it.`,
      okText: "Unpublish",
      okLoadingText: "Unpublishing...",
      okVariant: "destructive",
      cancelText: "Cancel",
      onOk: async () => {
        setIsLoading(true);
        try {
          await unpublishSpace(channel.id);
          setIsCopied(false);
          onOpenChange(false);
        } catch (error) {
          console.error("Error unpublishing space:", error);
        } finally {
          setIsLoading(false);
        }
      },
    });
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
            <div className={`p-2 rounded-lg ${channel.shareToken ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
              <Globe className="h-5 w-5" />
            </div>
            <span>Publish Space</span>
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
              <Label className="text-sm font-medium">Share Link</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 font-mono text-sm pr-10 bg-muted/50 border-border/50"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  {isCopied && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-primary font-medium">
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant={isCopied ? "default" : "outline"}
                  size="icon"
                  onClick={handleCopyLink}
                  className={`shrink-0 transition-all ${isCopied ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {isCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isCopied && (
                <p className="text-xs text-primary font-medium animate-in fade-in slide-in-from-top-1">
                  Link copied to clipboard!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="py-6">
            <div className="flex flex-col items-center gap-3 text-center p-6 rounded-lg bg-muted/30 border border-dashed border-border">
              <div className="p-3 rounded-full bg-muted">
                <Link2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Once published, you'll get a shareable link that anyone can use to view this space.</p>
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
              className="w-full sm:w-auto"
            >
              {isLoading ? "Unpublishing..." : "Unpublish"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handlePublish}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

