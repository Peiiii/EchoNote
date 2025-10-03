import React, { useMemo, useState } from 'react';
import { ToolContainer } from './tool-container';

export type ToolStatus = 'loading' | 'ready' | 'success' | 'error';

interface ToolPanelProps {
  icon: React.ReactNode;
  title: string;
  status: ToolStatus;
  statusText: string;
  children?: React.ReactNode;
  maxHeight?: string;
  defaultExpanded?: boolean; // default collapsed unless specified
  expandable?: boolean; // default true when children exist
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
  headerCardClassName,
  contentCardClassName,
}: ToolPanelProps) {
  const hasContent = !!children;
  const showDetails = expandable !== false && hasContent;
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded ?? false);

  const header = useMemo(() => ({
    icon,
    title,
    status,
    statusText,
    hasDetails: showDetails,
    isExpanded: expanded,
    onToggleExpanded: showDetails ? () => setExpanded(v => !v) : undefined,
  }), [icon, title, status, statusText, showDetails, expanded]);

  const content = showDetails ? { children, maxHeight, isExpanded: expanded } : undefined;

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

