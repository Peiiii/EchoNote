import { memo } from "react";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Card } from "@/common/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { StudioContentItem } from "@/core/stores/studio.store";
import { ConceptCardsData } from "../types";
import { cn } from "@/common/lib/utils";

interface WikiCardDetailProps {
  item: StudioContentItem;
  onClose: () => void;
}

export const WikiCardDetail = memo(function WikiCardDetail({ item, onClose }: WikiCardDetailProps) {
  const data = item.data as ConceptCardsData | undefined;
  const cards = data?.cards || [];

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
        <div className="text-sm font-medium flex-1 truncate">{item.title}</div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-4">
          {cards.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              No concept cards generated yet
            </div>
          ) : (
            cards.map((card, cardIndex) => {
              const colorVariants = [
                "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40 border-amber-200/80 dark:border-amber-800/50",
                "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40 border-orange-200/80 dark:border-orange-800/50",
                "bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-950/40 dark:via-orange-950/40 dark:to-amber-950/40 border-yellow-200/80 dark:border-yellow-800/50",
                "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200/80 dark:border-amber-800/50",
                "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 border-orange-200/80 dark:border-orange-800/50",
              ];
              const colorVariant = colorVariants[cardIndex % colorVariants.length];
              
              return (
                <Card
                  key={card.id}
                  className={cn(
                    "p-5 border shadow-sm transition-all duration-300 hover:shadow-md",
                    colorVariant
                  )}
                >
                  <h3 className="text-base font-semibold mb-3 text-amber-900 dark:text-amber-100">
                    {card.title}
                  </h3>
                  <div className="text-sm text-foreground/90 mb-4 leading-relaxed">
                    {card.definition}
                  </div>

                  {card.keyPoints.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2 uppercase tracking-wide">
                        Key Points
                      </div>
                      <ul className="space-y-1.5">
                        {card.keyPoints.map((point, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-foreground/85 flex items-start gap-2.5"
                          >
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-semibold">
                              •
                            </span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {card.examples.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2 uppercase tracking-wide">
                        Examples
                      </div>
                      <ul className="space-y-1.5">
                        {card.examples.map((example, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-foreground/85 flex items-start gap-2.5"
                          >
                            <span className="text-amber-600 dark:text-amber-400 mt-0.5 font-semibold">
                              —
                            </span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {card.relatedConcepts.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2 uppercase tracking-wide">
                        Related Concepts
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {card.relatedConcepts.map((concept, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200/60 dark:border-amber-700/40 font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

