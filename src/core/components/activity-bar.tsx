import { ThemeToggle } from "@/common/components/theme";
import { cn } from "@/common/lib/utils";
import { IconRegistry } from "@/core/components/icon-registry";
import { ActivityBarGroup, useActivityBarStore, type ActivityItem } from "@/core/stores/activity-bar.store";
import { ActivityBar } from "composite-kit";
import { LayoutDashboard } from "lucide-react";
import { useState } from "react";

interface ActivityBarProps {
  className?: string;
}

export function ActivityBarComponent({ className }: ActivityBarProps) {
  const {
    expanded,
    setExpanded,
    activeId,
    setActiveId,
    items,
  } = useActivityBarStore();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const mainGroupItems = items.filter(item => item.group === ActivityBarGroup.MAIN);
  const footerItems = items.filter(item => item.group === ActivityBarGroup.FOOTER);

  const handleExpandedChange = (newExpanded: boolean) => {
    setIsAnimating(true);
    setExpanded(newExpanded);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleActiveChange = (activeId: string) => {
    setIsAnimating(true);
    setActiveId(activeId);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleItemHover = (itemId: string | null) => {
    setHoveredItem(itemId);
  };

  return (
    <div className={cn(
      "relative flex-shrink-0 h-full",
      "bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95",
      "backdrop-blur-xl border-r border-white/10",
      "shadow-2xl",
      className
    )}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      
      <ActivityBar.Root
        expanded={expanded}
        activeId={activeId}
        expandedWidth={240}
        onExpandedChange={handleExpandedChange}
        onActiveChange={handleActiveChange}
        className="relative z-10 h-full bg-transparent"
      >
        {/* Enhanced Header */}
        <div className="relative">
          <ActivityBar.Header
            icon={
              <div className="relative">
                <LayoutDashboard className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              </div>
            }
            title="EchoNote"
            showSearch={false}
            className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-b border-white/10"
          />
        </div>

        {/* Enhanced Group List */}
        <ActivityBar.GroupList className="space-y-2 p-2">
          <ActivityBar.Group 
            title="main"
            className="space-y-1"
          >
            {mainGroupItems.map((item: ActivityItem, index) => (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => handleItemHover(item.id)}
                onMouseLeave={() => handleItemHover(null)}
              >
                {/* Hover effect background */}
                <div className={cn(
                  "absolute inset-0 rounded-lg transition-all duration-300",
                  hoveredItem === item.id 
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-105" 
                    : "bg-transparent scale-100"
                )} />
                
                {/* Active indicator */}
                {activeId === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full animate-pulse" />
                )}
                
                <ActivityBar.Item
                  id={item.id}
                  icon={
                    <div className={cn(
                      "relative transition-all duration-300",
                      activeId === item.id 
                        ? "text-white scale-110" 
                        : "text-slate-400 group-hover:text-white"
                    )}>
                      <IconRegistry id={item.icon} />
                      {activeId === item.id && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 animate-pulse" />
                      )}
                    </div>
                  }
                  label={item.label}
                  title={item.title}
                  className={cn(
                    "relative transition-all duration-300 rounded-lg",
                    "hover:bg-white/10 hover:shadow-lg",
                    activeId === item.id 
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 shadow-lg" 
                      : "bg-transparent",
                    isAnimating && "animate-pulse"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                />
              </div>
            ))}
          </ActivityBar.Group>
        </ActivityBar.GroupList>

        {/* Enhanced Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <ActivityBar.Footer className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-t border-white/10">
            <ActivityBar.Separator className="bg-white/10" />
            
            <ActivityBar.Group className="space-y-1 p-2">
              {footerItems.map((item: ActivityItem, index) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => handleItemHover(item.id)}
                  onMouseLeave={() => handleItemHover(null)}
                >
                  {/* Hover effect background */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg transition-all duration-300",
                    hoveredItem === item.id 
                      ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 scale-105" 
                      : "bg-transparent scale-100"
                  )} />
                  
                  <ActivityBar.Item
                    id={item.id}
                    icon={
                      <div className={cn(
                        "relative transition-all duration-300",
                        activeId === item.id 
                          ? "text-white scale-110" 
                          : "text-slate-400 group-hover:text-white"
                      )}>
                        <IconRegistry id={item.icon} />
                        {activeId === item.id && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg opacity-20 animate-pulse" />
                        )}
                      </div>
                    }
                    label={item.label}
                    title={item.title}
                    className={cn(
                      "relative transition-all duration-300 rounded-lg",
                      "hover:bg-white/10 hover:shadow-lg",
                      activeId === item.id 
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-lg" 
                        : "bg-transparent",
                      isAnimating && "animate-pulse"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  />
                </div>
              ))}
            </ActivityBar.Group>
            
            <ActivityBar.Separator className="bg-white/10" />
            
            {/* Enhanced Theme Toggle */}
            <div className="p-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <ThemeToggle className="relative w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300" />
              </div>
            </div>
          </ActivityBar.Footer>
        </div>
      </ActivityBar.Root>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
    </div>
  );
} 