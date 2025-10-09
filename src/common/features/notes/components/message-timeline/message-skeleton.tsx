import { Skeleton } from "@/common/components/ui/skeleton";

export const MessageSkeleton = () => {
  return (
    <div className="w-full p-4 space-y-3 border-b border-border/50">
      {/* 头像和基本信息 */}
      <div className="flex items-start space-x-3">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          {/* 用户名和时间 */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>

          {/* 消息内容骨架 */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* 操作按钮骨架 */}
          <div className="flex items-center space-x-2 pt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

// 多个消息的骨架屏
export const MessageTimelineSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </div>
  );
};
