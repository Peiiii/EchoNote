import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import { CreateChannelPopover } from "@/common/features/channel-management/components/create-channel-popover";
import { openQuickSearchModal } from "@/common/features/note-search/components/quick-search-modal";
import { useReadMoreStore } from "@/common/features/read-more/store/read-more.store";
import { sortChannelsWithCurrentFirst } from "@/common/lib/channel-sorting";
import { cn } from "@/common/lib/utils";
import { getFeaturesConfig } from "@/core/config/features.config";
import { Channel, useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useUIPreferencesStore } from "@/core/stores/ui-preferences.store";
import { useDesktopPresenterContext } from "@/desktop/hooks/use-desktop-presenter-context";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PanelLeft,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { BackgroundSwitcher } from "./background-switcher";
import { ChannelDropdownSelector } from "./channel-dropdown-selector";
import { EditChannelPopover } from "../../../channel-management/components/edit-channel-popover";
import { Edit2 } from "lucide-react";

interface ChannelHeaderProps {
  channel: Channel;
  className?: string;
  defaultCollapsed?: boolean;
}

const generateHash = (channelId: string): number => {
  let hash = 0;
  for (let i = 0; i < channelId.length; i++) {
    hash = hash * 31 + channelId.charCodeAt(i);
  }
  return Math.abs(hash);
};

const getPicsumBackground = (hash: number) => {
  const imageId = (hash % 100) + 1;
  return {
    background: `url(https://picsum.photos/800/400?random=${imageId})`,
    isImage: true,
  };
};

const getChannelBackground = (channel: Channel): { background: string; isImage: boolean } => {
  if (channel.backgroundImage) {
    return { background: `url(${channel.backgroundImage})`, isImage: true };
  }

  if (channel.backgroundColor) {
    return { background: channel.backgroundColor, isImage: false };
  }

  const hash = generateHash(channel.id);
  return getPicsumBackground(hash);
};

export const ChannelHeader = ({
  channel,
  className = "",
  defaultCollapsed = false,
}: ChannelHeaderProps) => {
  const presenter = useDesktopPresenterContext();
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifyLayoutChange = useReadMoreStore(useCallback(state => state.notifyLayoutChange, []));
  const setTimelineCoverCollapsed = useUIPreferencesStore(
    useCallback(state => state.setTimelineCoverCollapsed, [])
  );
  const isCollapsed = useUIPreferencesStore(
    useCallback(state => state.timelineCoverCollapsed ?? defaultCollapsed, [defaultCollapsed])
  );
  const isLeftSidebarCollapsed = useUIPreferencesStore(
    useCallback(state => state.isLeftSidebarCollapsed, [])
  );
  const setLeftSidebarCollapsed = useUIPreferencesStore(
    useCallback(state => state.setLeftSidebarCollapsed, [])
  );
  const channels = useNotesDataStore(state => state.channels);
  const { setCurrentChannel } = useNotesViewStore();
  const sortedChannels = sortChannelsWithCurrentFirst(channels, channel.id);
  const { background: backgroundStyle, isImage: hasBackgroundImage } =
    getChannelBackground(channel);
  const isGradient = backgroundStyle.includes("gradient");

  const getBackgroundStyle = (): React.CSSProperties => {
    if (hasBackgroundImage) {
      return {
        backgroundImage: backgroundStyle,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }

    if (isGradient) {
      return {
        background: backgroundStyle,
      };
    }

    return {
      backgroundColor: backgroundStyle,
    };
  };

  const handleToggle = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const nextCollapsed = !isCollapsed;
    setTimelineCoverCollapsed(nextCollapsed);
    notifyLayoutChange();

    setTimeout(() => {
      setIsAnimating(false);
      notifyLayoutChange();
    }, 300);
  };

  const handleExpandSidebar = () => {
    setLeftSidebarCollapsed(false);
  };

  const handleBackgroundChange = async ({
    type,
    value,
  }: {
    type: "color" | "image";
    value: string;
  }) => {
    try {
      if (type === "color") {
        await presenter.channelManager.updateChannel(channel.id, { backgroundColor: value, backgroundImage: undefined });
      } else if (type === "image") {
        await presenter.channelManager.updateChannel(channel.id, { backgroundImage: value, backgroundColor: undefined });
      }
    } catch (error) {
      console.error("Failed to update channel background:", error);
    }
  };

  const handleRemoveBackground = async () => {
    try {
      await presenter.channelManager.updateChannel(channel.id, { backgroundColor: undefined, backgroundImage: undefined });
    } catch (error) {
      console.error("Failed to remove channel background:", error);
    }
  };

  // Collapsed header content. When the left sidebar is collapsed, we also expose
  // an inline edit entry so users can quickly edit space name/emoji/description
  // without expanding the sidebar.
  const collapsedContent = (
    <div className="flex items-center space-x-2 min-w-0 w-full max-w-full overflow-hidden">
      {/* Sidebar expand button when sidebar is collapsed */}
      {isLeftSidebarCollapsed && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExpandSidebar}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 flex-shrink-0 animate-in fade-in slide-in-from-left-2 duration-300"
            title="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <CreateChannelPopover
            instantCreate
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 flex-shrink-0"
                title="New space"
                aria-label="New space"
              >
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        </>
      )}

      {isLeftSidebarCollapsed ? (
        <div className="flex flex-1 min-w-0 max-w-full items-center gap-1">
          <ChannelDropdownSelector
            currentChannel={channel}
            channels={sortedChannels}
            onChannelSelect={setCurrentChannel}
            className="min-w-0 max-w-full"
          />
          {/* Inline edit when sidebar is collapsed */}
          <EditChannelPopover channel={channel}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105 flex-shrink-0"
              title="Edit space"
              aria-label="Edit space"
              onClick={e => e.stopPropagation()}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </EditChannelPopover>
        </div>
      ) : (
        <>
          {channel.emoji && (
            <div className="text-lg flex-shrink-0 transition-all duration-300 ease-out hover:scale-110 cursor-pointer">
              {channel.emoji}
            </div>
          )}
          <div className="flex items-center space-x-1.5 min-w-0 p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 cursor-pointer group flex-1 overflow-hidden">
            <h1 className="text-lg font-semibold text-muted-foreground group-hover:text-foreground truncate transition-all duration-200 min-w-0">
              {channel.name}
            </h1>
            <Badge
              variant="secondary"
              className="text-xs flex-shrink-0 transition-all duration-200 text-muted-foreground group-hover:text-foreground"
            >
              {channel.messageCount}
            </Badge>
          </div>
        </>
      )}
    </div>
  );

  const expandedContent = (
    <>
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {/* Sidebar expand button when sidebar is collapsed */}
          {isLeftSidebarCollapsed && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExpandSidebar}
                className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200 hover:scale-105 flex-shrink-0 animate-in fade-in slide-in-from-left-2 duration-300"
                title="Expand sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
              {/* New space button remains useful in collapsed mode */}
              <CreateChannelPopover
                instantCreate
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20 transition-all duration-200 hover:scale-105 flex-shrink-0"
                    title="New space"
                    aria-label="New space"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                }
              />
            </>
          )}

          {channel.emoji && (
            <div className="text-4xl drop-shadow-lg flex-shrink-0 transition-all duration-300 ease-out">
              {channel.emoji}
            </div>
          )}
          <div className="flex-1 min-w-0 ml-3">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg truncate transition-all duration-300 ease-out min-w-0">
              {channel.name}
            </h1>
            {channel.description && (
              <p className="text-white/90 text-sm mt-1.5 drop-shadow-md line-clamp-2 transition-all duration-300 ease-out">
                {channel.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
          {/* Offer edit in header when sidebar is collapsed as well */}
          {isLeftSidebarCollapsed && (
            <EditChannelPopover channel={channel}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
                title="Edit space"
                aria-label="Edit space"
                onClick={e => e.stopPropagation()}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </EditChannelPopover>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
            onClick={() => openQuickSearchModal()}
            title="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
          {getFeaturesConfig().channel.settings.enabled && (
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
              onClick={() => presenter.openSettings()}
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          <BackgroundSwitcher
            currentBackground={{
              type: channel.backgroundColor ? "color" : "image",
              value: channel.backgroundColor || channel.backgroundImage,
            }}
            onBackgroundChange={handleBackgroundChange}
            onRemoveBackground={handleRemoveBackground}
            buttonClassName="h-8 w-8 p-0 text-white hover:text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          />
          {/* <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-105"
            onClick={handleToggle}
          >
            <ChevronUp className="h-4 w-4 transition-transform duration-200" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <Badge
            variant="secondary"
            className="bg-white/25 text-white border-white/40 backdrop-blur-sm transition-all duration-300 ease-out"
          >
            <MessageSquare className="h-3 w-3 mr-1.5" />
            <span className="font-medium">{channel.messageCount}</span>
            <span className="ml-1 text-xs opacity-90">messages</span>
          </Badge>

          {channel.lastMessageTime && (
            <Badge
              variant="secondary"
              className="bg-white/25 text-white border-white/40 backdrop-blur-sm transition-all duration-300 ease-out"
            >
              <Users className="h-3 w-3 mr-1.5" />
              <span className="text-xs">
                {new Date(channel.lastMessageTime).toLocaleDateString()}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white/25 text-white border-white/40 hover:bg-white/35 backdrop-blur-sm transition-all duration-200 hover:scale-105"
            onClick={() => presenter.openAIAssistant()}
          >
            <Bot className="h-4 w-4 mr-2" />
            <span className="font-medium">AI Assistant</span>
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden transition-all duration-300 ease-out",
        isCollapsed ? "h-12" : "h-52",
        isCollapsed ? "flex items-center justify-between px-4" : "",
        className
      )}
      style={!isCollapsed ? getBackgroundStyle() : {}}
    >
      {isCollapsed ? (
        <>
          {collapsedContent}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
              onClick={() => openQuickSearchModal()}
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
              onClick={() => presenter.openAIAssistant()}
            > 
              <Bot className="h-4 w-4" />
            </Button>
            {getFeaturesConfig().channel.settings.enabled && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
                onClick={() => presenter.openSettings()}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 hover:scale-105"
              onClick={handleToggle}
            >
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </Button>
          </div>
        </>
      ) : (
        <div className="relative w-full h-full flex flex-col justify-between p-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/30 z-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10 z-0" />
          {expandedContent}
        </div>
      )}
    </div>
  );
};
