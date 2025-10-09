import { Alert, AlertDescription } from "@/common/components/ui/alert";
import { cn } from "@/common/lib/utils";

export interface ErrorMessageProps {
  error: unknown;
  fallbackMessage?: string;
  variant?: "alert" | "text";
  className?: string;
}

export function ErrorMessage({
  error,
  fallbackMessage = "An error occurred",
  variant = "text",
  className,
}: ErrorMessageProps) {
  const errorText =
    typeof error === "string" ? error : error instanceof Error ? error.message : fallbackMessage;

  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{errorText}</AlertDescription>
      </Alert>
    );
  }

  return <div className={cn("text-red-700 dark:text-red-300 text-sm", className)}>{errorText}</div>;
}
