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

const DEFAULT_BACKGROUNDS = [
  // 渐变背景
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
  "linear-gradient(135deg, #48cae4 0%, #023e8a 100%)",
  "linear-gradient(135deg, #f72585 0%, #b5179e 100%)",
  "linear-gradient(135deg, #06ffa5 0%, #3a86ff 100%)",
  "linear-gradient(135deg, #ffbe0b 0%, #fb5607 100%)",
  "linear-gradient(135deg, #8338ec 0%, #3a86ff 100%)",
  "linear-gradient(135deg, #06ffa5 0%, #8338ec 100%)",
  "linear-gradient(135deg, #ff006e 0%, #8338ec 100%)",
];

const DEFAULT_BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop&q=80",
];

const getChannelBackground = (channel: Channel): { background: string; isImage: boolean } => {
  if (channel.backgroundImage) {
    return { background: `url(${channel.backgroundImage})`, isImage: true };
  }
  
  if (channel.backgroundColor) {
    return { background: channel.backgroundColor, isImage: false };
  }
  
  // 使用channel ID生成一致的哈希值
  const hash = channel.id.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const absHash = Math.abs(hash);
  
  // 70% 概率使用背景图，30% 概率使用渐变
  const useImage = (absHash % 10) < 7;
  
  if (useImage) {
    const imageIndex = absHash % DEFAULT_BACKGROUND_IMAGES.length;
    return { background: `url(${DEFAULT_BACKGROUND_IMAGES[imageIndex]})`, isImage: true };
  } else {
    const gradientIndex = absHash % DEFAULT_BACKGROUNDS.length;
    return { background: DEFAULT_BACKGROUNDS[gradientIndex], isImage: false };
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
