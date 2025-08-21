import { ReactNode } from "react";
import { ActionMenu, ActionMenuItem, ActionMenuGroup } from "./index";

export interface ActionMenuItemConfig {
  id: string;
  icon: ReactNode;
  title: string;
  description?: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "warning";
  disabled?: boolean;
  hidden?: boolean;
}

export interface ActionMenuGroupConfig {
  id: string;
  title?: string;
  variant?: "default" | "warning" | "danger";
  showSeparator?: boolean;
  items: ActionMenuItemConfig[];
}

export interface ConfigurableActionMenuProps {
  groups: ActionMenuGroupConfig[];
  trigger?: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  width?: "sm" | "md" | "lg" | "xl";
}

export function ConfigurableActionMenu({
  groups,
  trigger,
  triggerClassName,
  contentClassName,
  align = "end",
  sideOffset = 8,
  width = "lg"
}: ConfigurableActionMenuProps) {
  const visibleGroups = groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.hidden)
    }))
    .filter(group => group.items.length > 0);

  return (
    <ActionMenu
      trigger={trigger}
      triggerClassName={triggerClassName}
      contentClassName={contentClassName}
      align={align}
      sideOffset={sideOffset}
      width={width}
    >
      {visibleGroups.map((group, groupIndex) => (
        <ActionMenuGroup
          key={group.id}
          title={group.title}
          variant={group.variant}
          showSeparator={group.showSeparator !== false || groupIndex > 0}
        >
          {group.items.map((item) => (
            <ActionMenuItem
              key={item.id}
              icon={item.icon}
              title={item.title}
              description={item.description}
              onClick={item.onClick}
              variant={item.variant}
              className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
            />
          ))}
        </ActionMenuGroup>
      ))}
    </ActionMenu>
  );
}
