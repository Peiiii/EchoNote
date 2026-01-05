import { memo, useCallback, useMemo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { X, ArrowLeft } from "lucide-react";
import { getEnabledModules } from "../modules/registry";
import { useUIStateStore } from "@/core/stores/ui-state.store";
import { useStudioStore, StudioModuleId } from "@/core/stores/studio.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { StudioModuleCard } from "./studio-module-card";
import { StudioContextSelector } from "./studio-context-selector";
import { AudioSummaryDetail } from "../modules/audio-summary/components/audio-summary-detail";
import { MindmapDetail } from "../modules/mindmap/components/mindmap-detail";
import { WikiCardDetail } from "../modules/wiki-card/components/wiki-card-detail";
import { ReportDetail } from "../modules/report/components/report-detail";
import { useConceptCards } from "../modules/wiki-card/hooks/use-concept-cards";
import { useMindmap } from "../modules/mindmap/hooks/use-mindmap";
import { useReport } from "../modules/report/hooks/use-report";
import { StudioRecentItem } from "./studio-recent-item";
import { StudioEmptyState } from "./studio-empty-state";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const renderDetail = (
  moduleId: StudioModuleId,
  itemId: string | null,
  onClose: () => void,
  contentItems: ReturnType<typeof useStudioStore.getState>["contentItems"]
) => {
  const items = contentItems[moduleId];
  const item = items.find((i) => i.id === itemId);
  if (!item) return null;

  switch (moduleId) {
    case "audio-summary":
      return <AudioSummaryDetail item={item} onClose={onClose} />;
    case "mindmap":
      return <MindmapDetail item={item} onClose={onClose} />;
    case "wiki-card":
      return <WikiCardDetail item={item} onClose={onClose} />;
    case "report":
      return <ReportDetail item={item} onClose={onClose} />;
    default:
      return null;
  }
};

export const StudioSidebar = memo(function StudioSidebar() {
  const { t } = useTranslation();
  const close = useUIStateStore((s) => s.closeStudio);
  const {
    currentModule,
    activeItemId,
    setCurrentModule,
    setActiveItem,
    contentItems,
    currentContext,
    deleteContentItem,
    togglePin,
  } = useStudioStore();
  const { currentChannelId } = useNotesViewStore();
  const { channels } = useNotesDataStore();

  const modules = getEnabledModules();
  const { generate: generateConceptCards } = useConceptCards();
  const { generate: generateMindmap } = useMindmap();
  const { generate: generateReport } = useReport();

  const handleModuleClick = useCallback(
    async (moduleId: string) => {
      if (moduleId === "wiki-card" || moduleId === "mindmap" || moduleId === "report") {
        let channelIds: string[] = [];

        if (currentContext?.mode === "all") {
          channelIds = channels.map((ch) => ch.id);
        } else if (currentContext?.mode === "custom" && currentContext.channelIds.length > 0) {
          channelIds = currentContext.channelIds;
        } else if (currentContext?.mode === "auto" && currentChannelId) {
          channelIds = [currentChannelId];
        } else if (currentChannelId) {
          channelIds = [currentChannelId];
        }

        if (channelIds.length === 0) {
          console.warn("No channels available for studio generation");
          return;
        }

        try {
          setCurrentModule(moduleId as typeof currentModule);
          const itemId = await (moduleId === "wiki-card"
            ? generateConceptCards(channelIds)
            : moduleId === "mindmap"
              ? generateMindmap(channelIds)
              : generateReport(channelIds));
          setActiveItem(itemId);
        } catch (error) {
          console.error(
            moduleId === "wiki-card"
              ? "Failed to generate concept cards:"
              : moduleId === "mindmap"
                ? "Failed to generate mindmap:"
                : "Failed to generate report:",
            error
          );
        }
      } else {
        console.warn(`Module ${moduleId} generation not yet implemented`);
      }
    },
    [
      setCurrentModule,
      setActiveItem,
      currentContext,
      currentChannelId,
      channels,
      generateConceptCards,
      generateMindmap,
      generateReport,
    ]
  );

  const handleCloseDetail = useCallback(() => {
    setCurrentModule(null);
    setActiveItem(null);
  }, [setCurrentModule, setActiveItem]);

  const detailView = useMemo(() => {
    if (!currentModule || !activeItemId) return null;
    const items = contentItems[currentModule];
    const item = items.find((i) => i.id === activeItemId);
    if (!item) return null;

    if (item.status === "error") {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCloseDetail}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium flex-1 truncate">{item.title}</div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteContentItem(item.id);
                handleCloseDetail();
              }}
            >
              {t("studio.recentItem.delete")}
            </Button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center px-6">
            <div className="max-w-md w-full rounded-xl border border-border/50 bg-card/60 p-5">
              <div className="text-sm font-semibold">{t("studio.recentItem.failed")}</div>
              <div className="mt-2 text-sm text-muted-foreground break-words">
                {item.errorMessage || t("common.unknownError")}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (item.status === "generating") {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/40 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCloseDetail}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-medium flex-1">{item.title}</div>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 pointer-events-none">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative inline-block">
              <div className="w-3 h-3 rounded-full bg-primary/40 animate-[dot-pulse_1.5s_ease-in-out_infinite] mx-auto" />
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-[expand-ring_2.5s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      );
    }
    return renderDetail(currentModule, activeItemId, handleCloseDetail, contentItems);
  }, [activeItemId, contentItems, currentModule, deleteContentItem, handleCloseDetail, t]);

  const recentItems = useMemo(() => {
    const all = Object.values(contentItems).flat();
    const pinned = all.filter((i) => i.pinned).sort((a, b) => b.updatedAt - a.updatedAt);
    const others = all.filter((i) => !i.pinned).sort((a, b) => b.updatedAt - a.updatedAt);
    return [...pinned, ...others].slice(0, 8);
  }, [contentItems]);

  return (
    <div className="h-full flex flex-col bg-background">
      <AnimatePresence mode="wait" initial={false}>
        {detailView ? (
          <motion.div
            key="detail"
            className="h-full flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {detailView}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="h-full flex flex-col"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 gap-2">
              <StudioContextSelector />
              <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={close}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-shrink-0 p-4 pb-3">
                <div className="grid grid-cols-2 gap-3">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <StudioModuleCard
                        module={module}
                        onClick={() => handleModuleClick(module.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex-1 min-h-0 border-t border-border/40">
                {recentItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: modules.length * 0.05 + 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full flex items-center justify-center px-4"
                  >
                    <StudioEmptyState />
                  </motion.div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="py-3">
                      {recentItems.map((item) => (
                        <StudioRecentItem
                          key={item.id}
                          item={item}
                          onOpen={(it) => {
                            setCurrentModule(it.moduleId);
                            setActiveItem(it.id);
                          }}
                          onDelete={(it) => deleteContentItem(it.id)}
                          onTogglePin={(it) => togglePin(it.id)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
