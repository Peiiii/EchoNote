import React from 'react';
import { cn } from '@/common/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'pulse' | 'dots' | 'spinner' | 'ripple';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const renderSpinner = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700',
      'border-t-blue-600 dark:border-t-blue-400',
      sizeClasses[size]
    )} />
  );

  const renderPulse = () => (
    <div className={cn(
      'animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-purple-500',
      sizeClasses[size]
    )} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'animate-bounce rounded-full bg-blue-600 dark:bg-blue-400',
            size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-3 h-3'
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderRipple = () => (
    <div className="relative">
      <div className={cn(
        'absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-400 opacity-75',
        sizeClasses[size]
      )} />
      <div className={cn(
        'absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-400 opacity-75',
        sizeClasses[size],
        'animate-ping'
      )} />
      <div className={cn(
        'relative rounded-full bg-blue-600 dark:bg-blue-400',
        sizeClasses[size]
      )} />
    </div>
  );

  const renderDefault = () => (
    <div className="flex items-center space-x-2">
      <div className={cn(
        'animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700',
        'border-t-blue-600 dark:border-t-blue-400',
        sizeClasses[size]
      )} />
      {text && (
        <span className={cn(
          'text-slate-600 dark:text-slate-400 font-medium',
          textSizes[size]
        )}>
          {text}
        </span>
      )}
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      case 'ripple':
        return renderRipple();
      default:
        return renderDefault();
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      {renderContent()}
    </div>
  );
};

// 全屏 Loading 组件
interface FullScreenLoadingProps {
  text?: string;
  variant?: LoadingProps['variant'];
  size?: LoadingProps['size'];
  className?: string;
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  text = 'Loading...',
  variant = 'default',
  size = 'lg',
  className
}) => {
  return (
    <div className={cn(
      'fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800',
      'flex items-center justify-center z-50',
      className
    )}>
      <div className="text-center space-y-6">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">EN</span>
          </div>
        </div>
        
        {/* Loading Animation */}
        <Loading 
          variant={variant} 
          size={size} 
          text={text}
        />
        
        {/* Subtle Text */}
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Please wait while we prepare your workspace...
        </p>
      </div>
    </div>
  );
};

// 内联 Loading 组件
export const InlineLoading: React.FC<Omit<LoadingProps, 'size'>> = (props) => (
  <Loading {...props} size="sm" />
);

// 按钮 Loading 组件
export const ButtonLoading: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center space-x-2', className)}>
    <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <span>Loading...</span>
  </div>
);
