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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
      toast(t("channelManagement.publishSpace.signInToPublish"));
      openLoginModal({
        title: t("channelManagement.publishSpace.signInTitle"),
        description: t("channelManagement.publishSpace.signInDescription"),
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
      toast(t("channelManagement.publishSpace.signInToUnpublish"));
      openLoginModal({
        title: t("channelManagement.publishSpace.signInToManageTitle"),
        description: t("channelManagement.publishSpace.signInToManageDescription"),
      });
      return;
    }
    modal.confirm({
      title: t("channelManagement.publishSpace.unpublishTitle"),
      description: t("channelManagement.publishSpace.unpublishDescription", { channelName: channel.name }),
      okText: t("channelManagement.publishSpace.unpublish"),
      okLoadingText: t("channelManagement.publishSpace.unpublishing"),
      okVariant: "destructive",
      cancelText: t("common.cancel"),
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
      toast(t("channelManagement.publishSpace.signInToUpdateMode"));
      openLoginModal({
        title: t("channelManagement.publishSpace.signInToUpdateModeTitle"),
        description: t("channelManagement.publishSpace.signInToUpdateModeDescription"),
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
          <DialogTitle>{t("channelManagement.publishSpace.title")}</DialogTitle>
          <DialogDescription>
            {channel.shareToken
              ? channel.shareMode === "append-only"
                ? t("channelManagement.publishSpace.publishedAppendOnly")
                : t("channelManagement.publishSpace.publishedReadOnly")
              : t("channelManagement.publishSpace.makeAccessible")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("channelManagement.publishSpace.mode")}</Label>
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
                  <span className="text-sm font-medium">{t("channelManagement.publishSpace.readOnly")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground/70">{t("channelManagement.publishSpace.viewOnly")}</span>
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
                  <span className="text-sm font-medium">{t("channelManagement.publishSpace.collaborative")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground/70">{t("channelManagement.publishSpace.anyoneCanAdd")}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {selectedMode === "read-only" 
                  ? t("channelManagement.publishSpace.readOnlyDescription")
                  : t("channelManagement.publishSpace.collaborativeDescription")}
              </p>
            </div>
          </div>
          {shouldShowLink && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("channelManagement.publishSpace.shareLink")}</Label>
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
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleConfirmModeChange}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? t("channelManagement.publishSpace.changing") : t("channelManagement.publishSpace.confirmChange")}
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
                    {isLoading ? t("channelManagement.publishSpace.unpublishing") : t("channelManagement.publishSpace.unpublish")}
                  </Button>
                )
              ) : (
                <Button
                  type="button"
                  onClick={handlePublish}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? t("channelManagement.publishSpace.publishing") : t("channelManagement.publishSpace.publish")}
                </Button>
              )}
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
