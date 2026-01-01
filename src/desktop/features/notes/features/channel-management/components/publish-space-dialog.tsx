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
import { useNotesDataStore, ShareMode } from "@/core/stores/notes-data.store";
import { Channel } from "@/core/stores/notes-data.store";
import { Check, Copy, Lock, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/common/lib/utils";
import { useAuthStore } from "@/core/stores/auth.store";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { toast } from "sonner";

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
  const { publishSpace, unpublishSpace, updatePublishMode } = useNotesDataStore();
  const currentUser = useAuthStore(s => s.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ShareMode>(
    channel.shareMode || "read-only"
  );

  useEffect(() => {
    setSelectedMode(channel.shareMode || "read-only");
  }, [channel.shareMode]);

  const hasModeChanged = channel.shareToken && selectedMode !== channel.shareMode;
  const shouldShowLink = channel.shareToken && !hasModeChanged;

  const shareUrl = channel.shareToken
    ? `${window.location.origin}/#/space/${channel.shareToken}`
    : "";

  const handlePublish = async () => {
    if (!currentUser) {
      toast("Sign in to publish this space");
      openLoginModal({
        title: "Sign in to publish",
        description: "Publishing creates a shareable cloud link for this space.",
      });
      return;
    }
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
    if (!currentUser) {
      toast("Sign in to unpublish this space");
      openLoginModal({
        title: "Sign in to manage publishing",
        description: "Unpublishing is a cloud action and requires an account.",
      });
      return;
    }
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

  const handleModeSelect = (newMode: ShareMode) => {
    if (newMode === selectedMode) return;
    setSelectedMode(newMode);
  };

  const handleConfirmModeChange = async () => {
    if (!channel.shareToken || !hasModeChanged) return;
    if (!currentUser) {
      toast("Sign in to update publish mode");
      openLoginModal({
        title: "Sign in to update publish mode",
        description: "Updating publish mode is a cloud action and requires an account.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updatePublishMode(channel.id, selectedMode);
    } catch (error) {
      console.error("Error updating publish mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelModeChange = () => {
    setSelectedMode(channel.shareMode || "read-only");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Space</DialogTitle>
          <DialogDescription>
            {channel.shareToken
              ? channel.shareMode === "append-only"
                ? "Your space is published. Anyone with the link can view and add messages."
                : "Your space is published. Anyone with the link can view messages."
              : "Make this space accessible via a shareable link."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Mode</Label>
            <div className="space-y-1">
              <div
                onClick={() => handleModeSelect("read-only")}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200",
                  selectedMode === "read-only" ? "bg-primary/8 text-primary" : "hover:bg-accent/30 text-foreground"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={cn("transition-colors", selectedMode === "read-only" ? "text-primary" : "text-muted-foreground")}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Read-Only</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground/70">View only</span>
                </div>
              </div>
              <div
                onClick={() => handleModeSelect("append-only")}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all duration-200",
                  selectedMode === "append-only" ? "bg-primary/8 text-primary" : "hover:bg-accent/30 text-foreground"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={cn("transition-colors", selectedMode === "append-only" ? "text-primary" : "text-muted-foreground")}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Collaborative</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground/70">Anyone can add</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedMode === "read-only" 
                  ? "Anyone with the link can view messages, but cannot add, modify, or delete them."
                  : "Anyone with the link can view and add messages. Existing messages cannot be modified or deleted."}
              </p>
            </div>
          </div>
          {shouldShowLink && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Share Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1 font-mono text-xs bg-muted/30 border-border/60"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0 h-9 w-9"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

            <DialogFooter>
              {channel.shareToken ? (
                hasModeChanged ? (
                  <div className="flex items-center gap-2 w-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelModeChange}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirmModeChange}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "Changing..." : "Confirm Change"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUnpublish}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Unpublishing..." : "Unpublish"}
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Publishing..." : "Publish"}
                </Button>
              )}
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
