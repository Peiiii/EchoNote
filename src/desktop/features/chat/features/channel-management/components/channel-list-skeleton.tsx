import { Skeleton } from '@/common/components/ui/skeleton';
import { CollapsibleSidebar } from '@/common/components/collapsible-sidebar';

export function ChannelListSkeleton() {
  return (
    <div data-component="channel-list" className="flex flex-col h-full overflow-hidden min-h-0">
      {/* Header */}
      <div data-component="channel-list-header" className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-slate-900 dark:text-slate-100">
              Thought Spaces
            </h3>
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
            className="w-full group transition-all duration-200 cursor-pointer"
          >
            <div className="relative p-3 rounded-lg transition-all duration-200 bg-transparent">
              <div className="flex items-start gap-3">
                {/* Channel Icon Skeleton */}
                <Skeleton className="w-8 h-8 rounded-lg flex-shrink-0" />
                
                {/* Channel Info Skeleton */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="w-20 h-4" />
                  </div>
                  <Skeleton className="w-24 h-3" />
                </div>
                
                {/* Action Buttons Skeleton */}
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
