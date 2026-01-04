import { memo, useState, useCallback, useMemo } from "react";
import { Button } from "@/common/components/ui/button";
import { RefinedPopover } from "@/common/components/refined-popover";
import { ChevronDown, Check, Search } from "lucide-react";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useStudioStore } from "@/core/stores/studio.store";
import { cn } from "@/common/lib/utils";
import { useTranslation } from "react-i18next";

export const StudioContextSelector = memo(function StudioContextSelector() {
  const { t } = useTranslation();
  const { channels } = useNotesDataStore();
  const { currentContext, setCurrentContext } = useStudioStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentChannelIds = useMemo(() => currentContext?.channelIds || [], [currentContext?.channelIds]);
  const currentMode = currentContext?.mode || "auto";

  const filteredChannels = channels.filter((ch) =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChannel = useCallback(
    (channelId: string) => {
      const newIds = currentChannelIds.includes(channelId)
        ? currentChannelIds.filter((id) => id !== channelId)
        : [...currentChannelIds, channelId];

      setCurrentContext({
        mode: "custom",
        channelIds: newIds,
      });
    },
    [currentChannelIds, setCurrentContext]
  );

  const setMode = useCallback(
    (mode: "auto" | "none" | "all" | "custom") => {
      if (mode === "all") {
        setCurrentContext({
          mode: "all",
          channelIds: channels.map((ch) => ch.id),
        });
      } else if (mode === "none") {
        setCurrentContext({
          mode: "none",
          channelIds: [],
        });
      } else if (mode === "auto") {
        setCurrentContext({
          mode: "auto",
          channelIds: [],
        });
      }
      setIsOpen(false);
    },
    [channels, setCurrentContext]
  );

  const getLabel = () => {
    if (currentMode === "all") return t("studio.contextSelector.mode.all");
    if (currentMode === "none") return t("studio.contextSelector.mode.none");
    if (currentMode === "auto") return t("studio.contextSelector.mode.auto");
    if (currentChannelIds.length === 0) return t("studio.contextSelector.noSpacesSelected");
    if (currentChannelIds.length === 1) {
      const ch = channels.find((c) => c.id === currentChannelIds[0]);
      return ch?.name || t("studio.contextSelector.oneSpace");
    }
    return t("studio.contextSelector.multipleSpaces", { count: currentChannelIds.length });
  };

  return (
    <RefinedPopover open={isOpen} onOpenChange={setIsOpen}>
      <RefinedPopover.Trigger asChild>
        <div className="flex items-center gap-1.5 h-8 px-3 rounded-md bg-transparent hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <span className="text-sm font-medium truncate">{getLabel()}</span>
          <ChevronDown className="w-3 h-3 opacity-50 flex-shrink-0" />
        </div>
      </RefinedPopover.Trigger>
      <RefinedPopover.Content className="w-80">
        <RefinedPopover.Header>
          <div className="text-sm font-semibold text-foreground/90">{t("studio.contextSelector.title")}</div>
        </RefinedPopover.Header>
        <RefinedPopover.Body>
          <div className="space-y-2">
            <Button
              variant={currentMode === "auto" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setMode("auto")}
            >
              {t("studio.contextSelector.mode.auto")}
            </Button>
            <Button
              variant={currentMode === "all" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setMode("all")}
            >
              {t("studio.contextSelector.mode.all")}
            </Button>
            <Button
              variant={currentMode === "none" ? "default" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setMode("none")}
            >
              {t("studio.contextSelector.mode.none")}
            </Button>
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center gap-2 px-2 mb-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("studio.contextSelector.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-sm"
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredChannels.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    {searchQuery ? t("studio.contextSelector.noSpacesFound") : t("studio.contextSelector.noSpacesAvailable")}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredChannels.map((ch) => {
                      const checked = currentChannelIds.includes(ch.id);
                      return (
                        <div
                          key={ch.id}
                          className={cn(
                            "flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors",
                            checked ? "bg-primary/10 text-primary" : "hover:bg-accent"
                          )}
                          onClick={() => {
                            setMode("custom");
                            toggleChannel(ch.id);
                          }}
                        >
                          <span>{ch.emoji || "📝"}</span>
                          <span className="flex-1 truncate">{ch.name}</span>
                          {checked && <Check className="w-4 h-4" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </RefinedPopover.Body>
      </RefinedPopover.Content>
    </RefinedPopover>
  );
});

