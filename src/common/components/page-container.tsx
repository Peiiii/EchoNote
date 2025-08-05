import { cn } from "@/common/lib/utils";
import { ScrollArea } from "@/common/components/ui/scroll-area";

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Whether to enable scrolling
   * @default true
   */
  scrollable?: boolean;
  /**
   * Maximum width of the container
   * @default "none" (full width)
   */
  maxWidth?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";
  /**
   * Padding of the container
   * @default "default"
   */
  padding?: "none" | "sm" | "default" | "lg" | "xl";
  /**
   * Whether to center the content
   * @default false
   */
  centered?: boolean;
}

const maxWidthClasses = {
  none: "",
  sm: "max-w-sm",
  md: "max-w-md", 
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
};

const paddingClasses = {
  none: "",
  sm: "p-2",
  default: "p-6",
  lg: "p-8", 
  xl: "p-12",
};

export function PageContainer({
  children,
  className,
  scrollable = true,
  maxWidth = "none",
  padding = "default",
  centered = false,
}: PageContainerProps) {
  const containerClasses = cn(
    "w-full h-full flex-1 min-h-0 overflow-hidden",
    maxWidthClasses[maxWidth],
    centered && "mx-auto",
    className
  );

  const contentClasses = cn(
    "w-full h-full",
    paddingClasses[padding]
  );

  if (scrollable) {
    return (
      <div className={containerClasses}>
        <ScrollArea className="w-full h-full">
          <div className={contentClasses}>
            {children}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
} 