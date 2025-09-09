import { Skeleton } from '@/common/components/ui/skeleton';
import { CollapsibleSidebar } from '@/common/components/collapsible-sidebar';

export function ChannelListSkeleton() {
  return (
    <div data-component="channel-list" className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div data-component="channel-list-header" className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="w-32 h-5" />
          </div>
          <CollapsibleSidebar.ToggleButton />
        </div>
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
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            {/* Channel Icon Skeleton */}
            <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
            
            {/* Channel Info Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-12 h-3 rounded-full" />
              </div>
              <Skeleton className="w-24 h-3" />
            </div>
            
            {/* More Actions Skeleton */}
            <Skeleton className="w-6 h-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
