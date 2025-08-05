import { ThemeToggle } from "@/common/components/theme";
import { cn } from "@/common/lib/utils";
import { IconRegistry } from "@/core/components/icon-registry";
import { ActivityBarGroup, useActivityBarStore, type ActivityItem } from "@/core/stores/activity-bar.store";
import { ActivityBar } from "composite-kit";
import { LayoutDashboard } from "lucide-react";

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

  const mainGroupItems = items.filter(item => item.group === ActivityBarGroup.MAIN);
  const footerItems = items.filter(item => item.group === ActivityBarGroup.FOOTER);


  const handleExpandedChange = (newExpanded: boolean) => {
    setExpanded(newExpanded);
  };

  const handleActiveChange = (activeId: string) => {
    setActiveId(activeId);
  };

  return (
    <ActivityBar.Root
      expanded={expanded}
      activeId={activeId}
      expandedWidth={200}
      onExpandedChange={handleExpandedChange}
      onActiveChange={handleActiveChange}
      className={cn("flex-shrink-0", className)}
    >
      <ActivityBar.Header
        icon={<LayoutDashboard className="w-5 h-5" />}
        title="EchoNote"
        showSearch={false}
      />

      <ActivityBar.GroupList>
        <ActivityBar.Group title="main">
          {mainGroupItems.map((item: ActivityItem) => (
            <ActivityBar.Item
              key={item.id}
              id={item.id}
              icon={<IconRegistry id={item.icon} />}
              label={item.label}
              title={item.title}
            />
          ))}
        </ActivityBar.Group>
      </ActivityBar.GroupList>

      <ActivityBar.Footer>
        <ActivityBar.Separator />
        <ActivityBar.Group>
          {footerItems.map((item: ActivityItem) => (
            <ActivityBar.Item
              key={item.id}
              id={item.id}
              icon={<IconRegistry id={item.icon} />}
              label={item.label}
              title={item.title}
            />
          ))}
        </ActivityBar.Group>
        <ActivityBar.Separator />
        <div className="px-3 py-2">
          <ThemeToggle className="w-full" />
        </div>
      </ActivityBar.Footer>
    </ActivityBar.Root>
  );
} 