import React from 'react';

interface ToolDisplayContentProps {
  children: React.ReactNode;
  maxHeight?: string;
  isExpanded?: boolean;
}

export function ToolDisplayContent({ children, maxHeight = '400px', isExpanded = false }: ToolDisplayContentProps) {
  if (!isExpanded) {
    return null;
  }
  
  return (
    <div className="p-4 w-full">
      <div 
        className="overflow-y-auto w-full" 
        style={{ maxHeight: maxHeight }}
      >
        {children}
      </div>
    </div>
  );
}
