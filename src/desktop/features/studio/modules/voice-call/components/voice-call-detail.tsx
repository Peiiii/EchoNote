import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { ArrowDown, ArrowLeft, Mic, MicOff, PhoneOff, Trash2 } from "lucide-react";
import { useStudioStore } from "@/core/stores/studio.store";
import { useVoiceCall } from "../hooks/use-voice-call";
import { useTranslation } from "react-i18next";

export const VoiceCallDetail = memo(function VoiceCallDetail(props: { onClose: () => void }) {
  const { onClose } = props;
  const { t } = useTranslation();
  const channelIds = useStudioStore((s) => s.ephemeralContextChannelIds);
  const { status, error, messages, isMuted, assistantVoice, start, stop, toggleMute, clear } =
    useVoiceCall({ channelIds });

  const canStart = status === "idle" || status === "error";
  const isInCall = status !== "idle";

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(true);
  const isStickyRef = useRef(true);

  const computeIsSticky = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return true;
    const threshold = 48;
    return el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  }, []);

  const updateSticky = useCallback(() => {
    const next = computeIsSticky();
    isStickyRef.current = next;
    setIsSticky(next);
  }, [computeIsSticky]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => updateSticky();
    el.addEventListener("scroll", onScroll, { passive: true });
    updateSticky();
    return () => el.removeEventListener("scroll", onScroll);
  }, [updateSticky]);

  useEffect(() => {
    if (isStickyRef.current) {
      scrollToBottom("auto");
    }
  }, [messages.length, scrollToBottom]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "idle":
        return t("studio.voiceCall.status.idle");
      case "connecting":
        return t("studio.voiceCall.status.connecting");
      case "listening":
        return t("studio.voiceCall.status.listening");
      case "thinking":
        return t("studio.voiceCall.status.thinking");
      case "speaking":
        return t("studio.voiceCall.status.speaking");
      case "error":
        return t("studio.voiceCall.status.error");
      default:
        return status;
    }
  }, [status, t]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{t("studio.voiceCall.title")}</div>
          <div className="text-xs text-muted-foreground truncate">
            {t("studio.voiceCall.subtitle", { voice: assistantVoice })}
          </div>
        </div>
        {isInCall ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              stop();
            }}
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            {t("studio.voiceCall.end")}
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              void start();
            }}
            disabled={!canStart}
          >
            <Mic className="w-4 h-4 mr-2" />
            {t("studio.voiceCall.start")}
          </Button>
        )}
      </div>

      <div className="px-4 py-2 flex items-center gap-2 border-b border-border/40">
        <div className="text-xs text-muted-foreground">
          {t("studio.voiceCall.statusLabel", { status: statusLabel })}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            disabled={!isInCall}
            className="h-8"
          >
            {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isMuted ? t("studio.voiceCall.unmute") : t("studio.voiceCall.mute")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
            }}
            className="h-8"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("studio.voiceCall.clear")}
          </Button>
        </div>
      </div>

      {error ? (
        <div className="px-4 py-2 text-sm text-destructive border-b border-border/40 break-words">
          {error}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 relative">
        <div ref={scrollRef} className="h-full overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {t("studio.voiceCall.emptyHint")}
            </div>
          ) : null}

          {messages.map((m) => (
            <div
              key={m.id}
              className={[
                "rounded-xl border border-border/50 p-3 text-sm leading-relaxed",
                m.role === "assistant" ? "bg-card/60" : "bg-muted/30",
              ].join(" ")}
            >
              <div className="text-xs text-muted-foreground mb-1">
                {m.role === "assistant"
                  ? t("studio.voiceCall.role.assistant")
                  : t("studio.voiceCall.role.user")}
              </div>
              <div className="whitespace-pre-wrap break-words">{m.text}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {!isSticky && messages.length > 0 ? (
          <div className="absolute inset-x-0 bottom-0 pointer-events-none">
            <div className="h-12 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="px-4 pb-3 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="shadow-md pointer-events-auto"
              onClick={() => scrollToBottom("smooth")}
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              {t("studio.voiceCall.scrollToLatest")}
            </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});
