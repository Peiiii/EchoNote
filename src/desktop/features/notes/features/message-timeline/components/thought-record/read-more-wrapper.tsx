import { ReactNode } from "react";
import { cn } from "@/common/lib/utils";
import { ReadMoreBaseWrapper } from "@/common/features/read-more/components/read-more-wrapper";

interface ReadMoreWrapperProps {
  children: ReactNode;
  maxHeight?: number;
  className?: string;
  messageId: string;
}

export function ReadMoreWrapper({
  children,
  maxHeight = 300,
  className = "",
  messageId,
}: ReadMoreWrapperProps) {
  return (
    <ReadMoreBaseWrapper
      messageId={messageId}
      maxHeight={maxHeight}
      className={cn("relative overflow-hidden pb-3", className)}
    >
      {children}
    </ReadMoreBaseWrapper>
  );
}
