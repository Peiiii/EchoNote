import { Skeleton } from '@/common/components/ui/skeleton';
import { CollapsibleSidebar } from '@/common/components/collapsible-sidebar';

interface ChannelListSkeletonProps {
  count?: number;
}

export function ChannelListSkeleton({ count = 12 }: ChannelListSkeletonProps) {
  return (
    <div data-component="channel-list" className="w-full h-full overflow-hidden flex flex-col bg-card shadow-sm">
      {/* Header */}
      <div data-component="channel-list-header" className="h-12 px-4 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 truncate">
            Thought Spaces
          </h3>
        </div>
        <CollapsibleSidebar.ToggleButton />
      </div>

      {/* Channel List */}
      <div
        data-component="channel-list-content"
        className="flex-1 overflow-y-auto p-3 space-y-1 min-h-0 channel-list-content"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="w-full group transition-all duration-200 cursor-pointer"
          >
            <div className="relative p-3 rounded-lg transition-all duration-200 bg-transparent">
              <div className="flex items-start gap-3">
                {/* Channel Icon Skeleton - 匹配真实item的8x8尺寸 */}
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                
                {/* Channel Info Skeleton - 匹配真实item的布局和高度 */}
                <div className="flex-1 text-left min-w-0">
                  {/* 标题行 - 匹配font-medium的高度 */}
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="w-20 h-4" />
                  </div>
                  {/* 描述行 - 匹配text-xs line-clamp-2的高度，通常是2行 */}
                  <div className="space-y-1">
                    <Skeleton className="w-24 h-3" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                
                {/* Action Buttons Skeleton - 匹配真实按钮的6x6尺寸 */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <Skeleton className="w-6 h-6 rounded" />
                  <Skeleton className="w-6 h-6 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div data-component="channel-list-footer" className="p-3 border-t border-slate-200 dark:border-slate-700">
        <Skeleton className="w-full h-10 rounded-lg" />
      </div>
    </div>
  );
}
