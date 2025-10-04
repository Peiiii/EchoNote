import { CheckCircle, AlertTriangle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/common/lib/utils';

export interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'warning' | 'ready';
  message: string;
  className?: string;
}

const statusConfig = {
  loading: {
    icon: Clock,
    iconClass: 'text-blue-600 dark:text-blue-400',
    textClass: 'text-blue-700 dark:text-blue-300',
  },
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-600 dark:text-green-400',
    textClass: 'text-green-700 dark:text-green-300',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-red-600 dark:text-red-400',
    textClass: 'text-red-700 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-600 dark:text-yellow-400',
    textClass: 'text-yellow-700 dark:text-yellow-300',
  },
  ready: {
    icon: Clock,
    iconClass: 'text-gray-600 dark:text-gray-400',
    textClass: 'text-gray-700 dark:text-gray-300',
  },
};

export function StatusIndicator({ 
  status, 
  message, 
  className 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Icon className={cn('w-4 h-4', config.iconClass)} />
      <span className={cn('text-sm', config.textClass)}>
        {message}
      </span>
    </div>
  );
}
