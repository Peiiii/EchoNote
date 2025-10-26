import { ReactNode } from "react";
import { Channel } from "@/core/stores/notes-data.store";
import { ChannelHeader } from "./channel-header";
import { useUIStateStore } from "@/core/stores/ui-state.store";

interface TimelineLayoutProps {
  content?: ReactNode;
  actions?: ReactNode;
  channel?: Channel;
  className?: string;
}

export const TimelineLayout = ({
  content,
  actions,
  channel,
  className = "",
}: TimelineLayoutProps) => {
  // Classic Focus Mode: when no right sidebar (AI Assistant/Thread) is open,
  // keep the reading width comfortable and centered.
  const { sideView } = useUIStateStore();
  const isFocusMode = !sideView;
  const sectionWidthClass = isFocusMode ? "w-full max-w-[850px] mx-auto px-4 sm:px-6" : "w-full";

  return (
    <div className={`relative w-full h-full ${className}`} data-component="timeline-layout">
      <div className="relative flex-1 flex flex-col h-full">
        {/* Channel Cover Header */}
        {channel && <ChannelHeader channel={channel} />}

        {/* Timeline content area */}
        <div className={`flex-1 flex flex-col min-h-0 ${sectionWidthClass}`}>
          {content}
        </div>

        {/* Actions area at bottom (composer)
            - Focus mode: keep the same width as content (centered)
            - Otherwise: full-width so its top border divides the whole container */}
        {actions && (
          <div className={`${sectionWidthClass} shrink-0`}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
