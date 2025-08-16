import React from 'react';
import { cn } from '@/common/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  if (children) {
    return (
      <div className={cn('animate-pulse', className)}>
        {children}
      </div>
    );
  }
  
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-slate-200 dark:bg-slate-700',
        className
      )}
    />
  );
};

// 应用骨架屏
export const AppSkeleton: React.FC = () => {
  return (
    <div className="h-screen bg-white dark:bg-slate-900">
      {/* 顶部导航栏骨架 */}
      <div className="h-16 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center h-full px-4">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="w-32 h-6 ml-4" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-20 h-8 rounded-md" />
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* 左侧边栏骨架 */}
        <div className="w-16 bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <div className="py-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-center">
                <Skeleton className="w-10 h-10 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
        
        {/* 主内容区域骨架 */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* 标题骨架 */}
            <div className="space-y-2">
              <Skeleton className="w-48 h-8" />
              <Skeleton className="w-96 h-4" />
            </div>
            
            {/* 内容卡片骨架 */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="space-y-3">
                  <Skeleton className="w-3/4 h-5" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                  <div className="flex space-x-2 pt-2">
                    <Skeleton className="w-16 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
