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
import { RadioGroup, RadioGroupItem } from "@/common/components/ui/radio-group";
import { modal } from "@/common/components/modal/modal.store";
import { useNotesDataStore, ShareMode } from "@/core/stores/notes-data.store";
import { Channel } from "@/core/stores/notes-data.store";
import { Check, Copy, Globe, Lock, MessageSquare } from "lucide-react";
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
  const [selectedMode, setSelectedMode] = useState<ShareMode>("read-only");

  const shareUrl = channel.shareToken
    ? `${window.location.origin}/#/space/${channel.shareToken}`
    : "";

  const handlePublish = async () => {
    setIsLoading(true);
    try {
      await publishSpace(channel.id, selectedMode);
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
              ? channel.shareMode === "append-only"
                ? "Your space is published as a collaborative space. Anyone with the link can add messages (but cannot modify or delete)."
                : "Your space is published. Share the link below to allow others to view it."
              : "Publish this space to make it accessible via a shareable link."}
          </DialogDescription>
        </DialogHeader>

        {channel.shareToken ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Publish Mode</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                {channel.shareMode === "append-only" ? (
                  <>
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Collaborative Mode</span>
                    <span className="text-xs text-muted-foreground ml-auto">Anyone can add messages</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Read-Only Mode</span>
                    <span className="text-xs text-muted-foreground ml-auto">View only</span>
                  </>
                )}
              </div>
            </div>
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
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Publish Mode</Label>
              <RadioGroup value={selectedMode} onValueChange={(value) => setSelectedMode(value as ShareMode)}>
                <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="read-only" id="read-only" className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="read-only" className="flex items-center gap-2 cursor-pointer">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Read-Only</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Anyone with the link can view messages, but cannot add, modify, or delete them.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-y-0 rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="append-only" id="append-only" className="mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="append-only" className="flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="font-medium">Collaborative (Append-Only)</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Anyone with the link can add new messages, but cannot modify or delete existing messages. Perfect for group discussions.
                    </p>
                  </div>
              </div>
              </RadioGroup>
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

