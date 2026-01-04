import { MoreHorizontal, Reply } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ReplyIndicatorProps } from "../types";

export function ReplyIndicator({ replyToMessage, onCancelReply }: ReplyIndicatorProps) {
  const { t } = useTranslation();
  return (
    <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Reply className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-blue-700 dark:text-blue-300">{t("messageInput.reply.label")}</span>
          <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
            {replyToMessage.content.substring(0, 50)}...
          </span>
        </div>
        <button
          onClick={onCancelReply}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
