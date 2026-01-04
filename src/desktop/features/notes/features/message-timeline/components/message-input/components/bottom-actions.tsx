import { ArrowUp, FileText, Image, Mic, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ToolbarButton } from "./toolbar-button";
import { getFeaturesConfig } from "@/core/config/features.config";

interface BottomActionsProps {
  onSend: () => void;
  canSend: boolean;
  shortcutHint?: string;
}

export function BottomActions({ onSend, canSend, shortcutHint }: BottomActionsProps) {
  const { t } = useTranslation();
  const leftButtons: Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    onClick?: () => void;
    enabled: boolean;
  }> = [
    { icon: Image, title: t("messageInput.bottom.image"), onClick: undefined, enabled: getFeaturesConfig().channel.input.image.enabled },
    { icon: FileText, title: t("messageInput.bottom.file"), onClick: undefined, enabled: getFeaturesConfig().channel.input.file.enabled },
    { icon: Mic, title: t("messageInput.bottom.voice"), onClick: undefined, enabled: getFeaturesConfig().channel.input.voice.enabled },
    { icon: MoreHorizontal, title: t("messageInput.bottom.more"), onClick: undefined, enabled: getFeaturesConfig().channel.input.more.enabled },
  ].filter(b => b.enabled);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {leftButtons.map((b, i) => (
          <ToolbarButton key={i} icon={b.icon} onClick={b.onClick} title={b.title} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        {shortcutHint && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{t("messageInput.bottom.sendHint", { shortcut: shortcutHint })}</span>
        )}
        <button
          onClick={onSend}
          disabled={!canSend}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors duration-150 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 ${
            !canSend ? "opacity-40 cursor-not-allowed hover:bg-transparent" : ""
          }`}
          aria-label={t("messageInput.bottom.sendNote")}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
