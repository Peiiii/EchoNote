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

interface ActivityBarProps {
  className?: string;
}

export function ActivityBarComponent({ className }: ActivityBarProps) {
  const { expanded, setExpanded, activeId, setActiveId, items } =
    useActivityBarStore();

  const mainGroupItems = items.filter(
    (item) => item.group === ActivityBarGroup.MAIN
  );
  const footerItems = items.filter(
    (item) => item.group === ActivityBarGroup.FOOTER
  );

  console.log("[ActivityBarComponent] items", { items });
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
        // 简约纯净：中性色调，适合记录工具
        "bg-white dark:bg-slate-900",
        "border-r border-slate-200 dark:border-slate-700",
        "shadow-sm",
        className
      )}
    >
      <ActivityBar.Root
        expanded={expanded}
        activeId={activeId}
        expandedWidth={240}
        onExpandedChange={handleExpandedChange}
        onActiveChange={handleActiveChange}
        className="relative z-10 h-full bg-transparent"
      >
        {/* Header - 简洁的标题区域 */}
        <ActivityBar.Header
          icon={
            <div className="flex items-center justify-center w-6 h-6">
              <LayoutDashboard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          }
          title="EchoNote"
          showSearch={false}
          className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700"
        />

        {/* Group List - 主要功能区域 */}
        <ActivityBar.GroupList>
          <ActivityBar.Group title="main">
            {mainGroupItems.map((item: ActivityItem) => (
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
                      item.iconColor || "text-blue-600 dark:text-blue-400"
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
        <ActivityBar.Footer className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {/* Auth Status Section - 统一的认证状态显示 */}
          <div className="px-2 py-2 border-b border-slate-200 dark:border-slate-700 flex justify-center">
            <AuthStatus />
          </div>

          {footerItems.length > 0 && (
            <>
              <ActivityBar.Group>
                {footerItems.map((item: ActivityItem) => (
                  <ActivityBar.Item
                    key={item.id}
                    id={item.id}
                    collapsedLabel={item.collapsedLabel}
                    icon={
                      <div
                        data-testid={item.id}
                        className={cn(
                          "flex items-center justify-center",
                          item.iconColor || "text-green-600 dark:text-green-400"
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

              <ActivityBar.Separator className="bg-slate-200 dark:border-slate-700" />
            </>
          )}

          {/* Theme Toggle - 简洁的主题切换并居中 */}
          <div className="px-2 py-2 flex justify-center">
            <ThemeToggle className="w-full max-w-[120px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200" />
          </div>
        </ActivityBar.Footer>
      </ActivityBar.Root>
    </div>
  );
}
