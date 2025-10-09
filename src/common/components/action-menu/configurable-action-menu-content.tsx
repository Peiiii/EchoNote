import { ReactNode } from "react";
import { ActionMenuItem, ActionMenuGroup } from "./index";

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

export interface ConfigurableActionMenuContentProps {
  groups: ActionMenuGroupConfig[];
}

export function ConfigurableActionMenuContent({ groups }: ConfigurableActionMenuContentProps) {
  const visibleGroups = groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.hidden),
    }))
    .filter(group => group.items.length > 0);

  return (
    <>
      {visibleGroups.map((group, groupIndex) => (
        <ActionMenuGroup
          key={group.id}
          title={group.title}
          variant={group.variant}
          showSeparator={groupIndex > 0 || group.showSeparator === true}
        >
          {group.items.map(item => (
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
    </>
  );
}
