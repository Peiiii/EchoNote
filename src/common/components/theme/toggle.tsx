import { Button } from "@/common/components/ui/button";
import { cn } from "@/common/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./context";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <Button
      variant="ghost" 
      size="icon"
      onClick={toggleDarkMode}
      className={cn("hover:bg-muted/80", className)}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  );
} 