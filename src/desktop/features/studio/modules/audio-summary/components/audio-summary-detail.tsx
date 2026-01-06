import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { ArrowLeft, Download, Pause, Play } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";
import { useTranslation } from "react-i18next";
import { AudioPodcastData } from "../types";
import { studioAudioCache } from "../services/studio-audio-cache.service";
import { MarkdownContent } from "@/common/components/markdown/markdown-content";

interface AudioSummaryDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const AudioSummaryDetail = memo(function AudioSummaryDetail({ item, onClose }: AudioSummaryDetailProps) {
  const { t } = useTranslation();
  const data = item.data as AudioPodcastData | undefined;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string | null>(null);

  const transcript = data?.transcriptMarkdown || "";

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!data?.audioStorageKey) return;
      const stored = await studioAudioCache.get(data.audioStorageKey);
      if (!stored || cancelled) return;
      const url = URL.createObjectURL(stored.blob);
      setAudioUrl(url);
      setAudioMimeType(stored.mimeType);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [data?.audioStorageKey]);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const filename = useMemo(() => {
    const title = (data?.title || "podcast").replace(/[\\/:*?"<>|]+/g, "_");
    return `${title}.wav`;
  }, [data?.title]);

  const handleTogglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      await el.play();
    } else {
      el.pause();
    }
  };

  const handleDownload = async () => {
    if (!data?.audioStorageKey) return;
    const stored = await studioAudioCache.get(data.audioStorageKey);
    if (!stored) return;
    const url = URL.createObjectURL(stored.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="text-sm font-medium flex-1 truncate">{data?.title || item.title}</div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {item.status === "error" ? (
            <div className="text-sm text-destructive">
              {item.errorMessage || t("common.unknownError")}
            </div>
          ) : audioUrl ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => void handleTogglePlay()}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={() => void handleDownload()}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                className="w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              <div className="text-xs text-muted-foreground">
                {audioMimeType ? `${audioMimeType} • ` : ""}
                {t("studio.audioSummary.generatedPodcast")}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {t("studio.audioSummary.noAudioAvailable")}
            </div>
          )}

          {transcript && (
            <div>
              <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {t("studio.audioSummary.transcript")}
              </div>
              <MarkdownContent content={transcript} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});
