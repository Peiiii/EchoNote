import React from 'react';
import { Card } from '@/common/components/ui/card';
import { ToolDisplayHeader } from './tool-display-header';
import { ToolDisplayContent } from './tool-display-content';
import { cn } from '@/common/lib/utils';

interface ToolContainerProps {
  children?: React.ReactNode;
  header: {
    icon: React.ReactNode;
    title: string;
    status: 'loading' | 'ready' | 'success' | 'error';
    statusText: string;
    hasDetails?: boolean;
    isExpanded?: boolean;
    onToggleExpanded?: () => void;
  };
  content?: {
    children: React.ReactNode;
    maxHeight?: string;
    isExpanded?: boolean;
  };
  headerCardClassName?: string;
  contentCardClassName?: string;
}

export function ToolContainer({ 
  children, 
  header, 
  content, 
  headerCardClassName = "border-blue-200",
  contentCardClassName = "border-gray-200 mt-2"
}: ToolContainerProps) {
  return (
    <div className="w-full flex flex-col" data-echo-tool>
      {/* Header Card - 独立卡片，宽度固定 */}
      <div className="flex w-full overflow-hidden">
        <Card className={cn(headerCardClassName, "overflow-hidden py-2 px-2")}>
          <ToolDisplayHeader {...header} />
        </Card>
      </div>
      
      {/* Content Card - 独立卡片，可折叠 */}
      {content && content.isExpanded && (
        <div className="w-full">
          <Card className={contentCardClassName}>
            <ToolDisplayContent {...content} />
          </Card>
        </div>
      )}
      
      {/* Legacy children support */}
      {children && (
        <div className="w-full mt-2">
          {children}
        </div>
      )}
    </div>
  );
}
