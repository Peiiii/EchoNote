import { ThemeToggle } from "@/common/components/theme";
import { cn } from "@/common/lib/utils";
import { IconRegistry } from "@/core/components/icon-registry";
import {
  ActivityBarGroup,
  useActivityBarStore,
  type ActivityItem,
} from "@/core/stores/activity-bar.store";
import { ActivityBar } from "composite-kit";
import { LayoutDashboard } from "lucide-react";
import { AuthStatus } from "@/common/components/firebase/auth-status";

interface DesktopActivityBarProps {
  className?: string;
}

export function DesktopActivityBar({ className }: DesktopActivityBarProps) {
  const { expanded, setExpanded, activeId, setActiveId, items } =
    useActivityBarStore();

  const mainGroupItems = items.filter(
    (item) => item.group === ActivityBarGroup.MAIN
  );
  const footerItems = items.filter(
    (item) => item.group === ActivityBarGroup.FOOTER
  );

  const handleExpandedChange = (newExpanded: boolean) => {
    setExpanded(newExpanded);
  };

  const handleActiveChange = (activeId: string) => {
    setActiveId(activeId);
  };

  return (
    <div
      className={cn(
        "relative flex-shrink-0 h-full",
        "bg-sidebar dark:bg-card border-none",
        "shadow-md",
        className
      )}
    >
      <ActivityBar.Root
        toggleable={false}
        expanded={expanded}
        activeId={activeId}
        expandedWidth={240}
        onExpandedChange={handleExpandedChange}
        onActiveChange={handleActiveChange}
        className="relative z-10 h-full bg-transparent border-none"
      >
        {/* Header - 简洁的标题区域 */}
        <ActivityBar.Header
          icon={
            <div className="flex items-center justify-center w-6 h-6">
              <LayoutDashboard className="w-5 h-5" />
            </div>
          }
          title="EchoNote"
          showSearch={false}
          showSeparator={false}
          className="bg-sidebar dark:bg-card"
        />

        {/* Group List - 主要功能区域 */}
        <ActivityBar.GroupList showSeparator={false}>
          <ActivityBar.Group title="main">
            {mainGroupItems.map((item: ActivityItem) => (
              <ActivityBar.Item
                key={item.id}
                id={item.id}
                className="activity-bar-item dark:bg-accent"
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                collapsedLabel={item.collapsedLabel}
                icon={
                  <div
                    data-testid={item.id}
                    className={cn(
                      "flex items-center justify-center",
                    )}
                  >
                    <IconRegistry id={item.icon} />
                  </div>
                }
                onClick={item.onClick}
                label={item.label}
                title={item.title}
              />
            ))}
          </ActivityBar.Group>
        </ActivityBar.GroupList>

        {/* Footer - 设置区域 */}
        <ActivityBar.Footer className="bg-sidebar dark:bg-card">
          {/* Auth Status Section - 统一的认证状态显示 */}
          <div className="px-2 py-2 flex justify-center">
            <AuthStatus />
          </div>

          {/* Theme Toggle Section */}
          <div className="px-2 py-2 flex justify-center">
            <ThemeToggle />
          </div>

          {/* Footer Items */}
          {footerItems.map((item: ActivityItem) => (
            <ActivityBar.Item
              key={item.id}
              id={item.id}
              className="activity-bar-item"
              collapsedLabel={item.collapsedLabel}
              icon={
                <div
                  data-testid={item.id}
                  className={cn(
                    "flex items-center justify-center",
                    item.iconColor || "text-slate-600 dark:text-slate-400"
                  )}
                >
                  <IconRegistry id={item.icon} />
                </div>
              }
              onClick={item.onClick}
              label={item.label}
              title={item.title}
            />
          ))}
        </ActivityBar.Footer>
      </ActivityBar.Root>
    </div>
  );
}
