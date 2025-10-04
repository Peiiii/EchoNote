import React, { useMemo, useState } from 'react';
import { ToolContainer } from './tool-container';

export type ToolStatus = 'loading' | 'ready' | 'success' | 'error';

export interface ToolPanelProps {
  icon: React.ReactNode;
  title: string;
  status: ToolStatus;
  statusText: string;
  children?: React.ReactNode;
  maxHeight?: string;
  defaultExpanded?: boolean; // default collapsed unless specified
  expandable?: boolean; // default true when children exist
  forceExpanded?: boolean; // when true, always show content without a toggle
  contentScrollable?: boolean; // control content scroll; default true
  headerCardClassName?: string;
  contentCardClassName?: string;
}

/**
 * Unified tool presentation panel with built-in expand/collapse.
 * - Shows expand toggle automatically when there is content and `expandable !== false`.
 * - Manages its own expanded state; callers can set `defaultExpanded`.
 */
export function ToolPanel({
  icon,
  title,
  status,
  statusText,
  children,
  maxHeight = '400px',
  defaultExpanded,
  expandable,
  forceExpanded,
  contentScrollable,
  headerCardClassName,
  contentCardClassName,
}: ToolPanelProps) {
  const hasContent = !!children;
  const canToggle = expandable !== false && hasContent && !forceExpanded;
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);
  const isExpanded = forceExpanded ? true : expanded;

  const header = useMemo(() => ({
    icon,
    title,
    status,
    statusText,
    hasDetails: canToggle,
    isExpanded,
    onToggleExpanded: canToggle ? () => setExpanded(v => !v) : undefined,
  }), [icon, title, status, statusText, canToggle, isExpanded]);

  // Show content when toggle is available or when explicitly forced expanded
  const content = hasContent ? { children, maxHeight, isExpanded, scrollable: contentScrollable !== false } : undefined;

  return (
    <div className="w-full" data-echo-tool>
      <ToolContainer
        header={header}
        content={content}
        headerCardClassName={headerCardClassName}
        contentCardClassName={contentCardClassName}
      />
    </div>
  );
}
