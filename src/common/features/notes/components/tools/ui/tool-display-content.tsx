import React from 'react';

interface ToolDisplayContentProps {
  children: React.ReactNode;
  maxHeight?: string;
  isExpanded?: boolean;
  scrollable?: boolean;
}

export function ToolDisplayContent({ children, maxHeight = '400px', isExpanded = false, scrollable = true }: ToolDisplayContentProps) {
  if (!isExpanded) {
    return null;
  }
  
  return (
    <div className="p-4 w-full">
      <div
        className={scrollable ? 'overflow-y-auto w-full' : 'w-full'}
        style={scrollable ? { maxHeight: maxHeight } : undefined}
      >
        {children}
      </div>
    </div>
  );
}
