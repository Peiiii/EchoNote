import { Button } from '@/common/components/ui/button';
import { CheckCircle, ChevronDown, ChevronRight, Clock, Loader2, XCircle } from 'lucide-react';
import React from 'react';

interface ToolDisplayHeaderProps {
  icon: React.ReactNode;
  title: string;
  status: 'loading' | 'ready' | 'success' | 'error';
  statusText: string;
  hasDetails?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export function ToolDisplayHeader({
  icon,
  title,
  status,
  statusText,
  hasDetails = false,
  isExpanded = false,
  onToggleExpanded
}: ToolDisplayHeaderProps) {
  const statusConfig = {
    loading: { icon: <Loader2 className="h-4 w-4 animate-spin text-blue-600" />, color: 'text-blue-600' },
    success: { icon: <CheckCircle className="h-4 w-4 text-green-600" />, color: 'text-green-600' },
    error: { icon: <XCircle className="h-4 w-4 text-red-600" />, color: 'text-red-600' },
    ready: { icon: <Clock className="h-4 w-4 text-gray-500" />, color: 'text-gray-500' }
  };

  const config = statusConfig[status];

  return <div className="px-2 flex gap-2 items-center overflow-hidden">
    <div className="flex items-center gap-2 flex-shrink-0">
      {icon}
    </div>
    <div
      className="overflow-y-auto flex-shrink-0"
    >
      {title}
    </div>
    <div className="flex-shrink-0 flex items-center gap-2">
      {config.icon}
      <span className={`text-sm font-medium ${config.color}`}>{statusText}</span>
    </div>
    <div className="flex-1 w-[9999px]" />
    {hasDetails && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleExpanded}
        className="h-8 w-8 p-0 hover:bg-gray-100 flex-shrink-0"
        aria-label={isExpanded ? "Collapse details" : "Expand details"}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    )}
  </div>
}
