import { ReactNode } from "react";
import { ReadMoreBaseWrapper } from "@/common/features/read-more/components/read-more-wrapper";
import { cn } from "@/common/lib/utils";

interface MobileReadMoreWrapperProps {
  children: ReactNode;
  messageId: string;
  maxHeight?: number;
  className?: string;
}

export function MobileReadMoreWrapper({
  children,
  messageId,
  maxHeight = 600,
  className,
}: MobileReadMoreWrapperProps) {
  return (
    <ReadMoreBaseWrapper
      messageId={messageId}
      maxHeight={maxHeight}
      clampMargin={24}
      className={cn("relative group", className)}
    >
      {children}
    </ReadMoreBaseWrapper>
  );
}
