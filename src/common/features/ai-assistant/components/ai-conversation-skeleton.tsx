import { Skeleton } from "@/common/components/ui/skeleton";

export function AIConversationSkeleton() {
  return (
    <div className="h-full w-full flex flex-col bg-background">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>

      {/* Messages area skeleton */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {/* AI message skeleton */}
        <div className="flex items-start space-x-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* User message skeleton */}
        <div className="flex items-start space-x-3 justify-end">
          <div className="flex-1 space-y-2 min-w-0 max-w-[80%]">
            <div className="flex items-center space-x-2 justify-end">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        </div>

        {/* AI message skeleton */}
        <div className="flex items-start space-x-3">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>

      {/* Input area skeleton */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Skeleton className="flex-1 h-10 rounded-md" />
          <Skeleton className="w-10 h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function AIConversationListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header skeleton */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>

      {/* List skeleton */}
      <div className="flex-1 overflow-hidden p-4 space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-3 border border-border rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create button skeleton */}
      <div className="p-4 border-t border-border">
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    </div>
  );
}
