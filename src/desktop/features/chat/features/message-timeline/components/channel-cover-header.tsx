import { Channel } from "@/core/stores/chat-data.store";
import { Button } from "@/common/components/ui/button";
import { Badge } from "@/common/components/ui/badge";
import { rxEventBusService } from "@/common/services/rx-event-bus.service";
import { MessageSquare, Users, Settings, Star, MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/common/lib/utils";
import { useState } from "react";

interface ChannelCoverHeaderProps {
  channel: Channel;
  onOpenSettings?: () => void;
  className?: string;
  defaultCollapsed?: boolean;
}


const CSS_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
];

const SVG_PATTERNS = [
  "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/svg%3E",
  "data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpolygon points='50 0 100 50 50 100 0 50'/%3E%3C/g%3E%3C/svg%3E",
];


const UNSPLASH_SOURCES = [
  "https://source.unsplash.com/800x400/?abstract,geometric",
  "https://source.unsplash.com/800x400/?nature,landscape", 
  "https://source.unsplash.com/800x400/?minimal,texture",
  "https://source.unsplash.com/800x400/?tech,digital",
  "https://source.unsplash.com/800x400/?pattern,design",
  "https://source.unsplash.com/800x400/?colorful,gradient",
  "https://source.unsplash.com/800x400/?modern,clean",
  "https://source.unsplash.com/800x400/?art,creative",
];

const getChannelBackground = (channel: Channel): { background: string; isImage: boolean } => {
  if (channel.backgroundImage) {
    return { background: `url(${channel.backgroundImage})`, isImage: true };
  }
  
  if (channel.backgroundColor) {
    return { background: channel.backgroundColor, isImage: false };
  }
  
  // 使用简单但可靠的哈希算法
  let hash = 0;
  for (let i = 0; i < channel.id.length; i++) {
    hash = hash * 31 + channel.id.charCodeAt(i);
  }
  
  // 确保为正数
  const absHash = Math.abs(hash);
  
  // 四种方案按比例分配：25% CSS渐变，25% SVG图案，25% Picsum，25% Unsplash
  const backgroundType = absHash % 4;
  
  if (backgroundType === 0) {
    // CSS渐变 (25%)
    const gradientIndex = absHash % CSS_GRADIENTS.length;
    return { 
      background: CSS_GRADIENTS[gradientIndex], 
      isImage: false 
    };
  } else if (backgroundType === 1) {
    // SVG图案 + 渐变组合 (25%)
    const gradientIndex = absHash % CSS_GRADIENTS.length;
    const svgIndex = absHash % SVG_PATTERNS.length;
    return { 
      background: `${CSS_GRADIENTS[gradientIndex]}, url(${SVG_PATTERNS[svgIndex]})`, 
      isImage: true 
    };
  } else if (backgroundType === 2) {
    // Picsum图片 (25%)
    const imageId = (absHash % 1000) + 1;
    return { 
      background: `url(https://picsum.photos/800/400?random=${imageId})`, 
      isImage: true 
    };
  } else {
    // Unsplash Source (25%)
    const sourceIndex = absHash % UNSPLASH_SOURCES.length;
    return { 
      background: `url(${UNSPLASH_SOURCES[sourceIndex]})`, 
      isImage: true 
    };
  }
};

export const ChannelCoverHeader = ({
  channel,
  onOpenSettings,
  className = "",
  defaultCollapsed = false
}: ChannelCoverHeaderProps) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { background: backgroundStyle, isImage: hasBackgroundImage } = getChannelBackground(channel);
  
  if (isCollapsed) {
    return (
      <div 
        className={cn(
          "relative h-12 w-full",
          "flex items-center justify-between px-4",
          "bg-muted/50 border-b border-border",
          className
        )}
      >
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          {channel.emoji && (
            <div className="text-lg flex-shrink-0">{channel.emoji}</div>
          )}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-foreground truncate">
              {channel.name}
            </h1>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {channel.messageCount}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => rxEventBusService.requestOpenAIAssistant$.emit({ channelId: channel.id })}
          >
            <Star className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "relative h-52 w-full overflow-hidden",
        "flex flex-col justify-between p-6",
        "before:absolute before:inset-0 before:bg-gradient-to-b before:from-black/10 before:via-black/20 before:to-black/30 before:z-0",
        "after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-transparent after:to-black/10 after:z-0",
        className
      )}
      style={{
        backgroundImage: backgroundStyle,
        backgroundSize: hasBackgroundImage ? 'cover' : 'auto',
        backgroundPosition: hasBackgroundImage ? 'center' : 'top left',
        backgroundRepeat: hasBackgroundImage ? 'no-repeat' : 'no-repeat'
      }}
    >
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          {channel.emoji && (
            <div className="text-4xl drop-shadow-lg flex-shrink-0">{channel.emoji}</div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg truncate">
              {channel.name}
            </h1>
            {channel.description && (
              <p className="text-white/90 text-sm mt-2 drop-shadow-md line-clamp-2">
                {channel.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-colors"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 transition-colors"
            onClick={() => setIsCollapsed(true)}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-white/25 text-white border-white/40 backdrop-blur-sm">
            <MessageSquare className="h-3 w-3 mr-1.5" />
            <span className="font-medium">{channel.messageCount}</span>
            <span className="ml-1 text-xs opacity-90">messages</span>
          </Badge>
          
          {channel.lastMessageTime && (
            <Badge variant="secondary" className="bg-white/25 text-white border-white/40 backdrop-blur-sm">
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
            onClick={() => rxEventBusService.requestOpenAIAssistant$.emit({ channelId: channel.id })}
          >
            <Star className="h-4 w-4 mr-2" />
            <span className="font-medium">AI Assistant</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
