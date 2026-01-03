import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import { useTheme } from "@/common/components/theme";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { openFeedbackModal } from "@/common/features/feedback/open-feedback-modal";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { cn } from "@/common/lib/utils";
import { useAuthStore } from "@/core/stores/auth.store";
import { LogIn, LogOut, Menu, MessageSquareText, Monitor, Moon, Sun } from "lucide-react";
import { useCallback } from "react";

type HeaderMenuTone = "light" | "dark";

interface HeaderMenuProps {
  tone?: HeaderMenuTone;
  className?: string;
}

export function HeaderMenu({ tone = "dark", className }: HeaderMenuProps) {
  const { user } = useFirebaseAuth();
  const { theme, setTheme } = useTheme();
  const signOut = useAuthStore(s => s.signOut);
  const isAuthenticating = useAuthStore(s => s.isAuthenticating);

  const handleLogin = useCallback(() => {
    openLoginModal({ allowGuest: true });
  }, []);

  const handleLogout = useCallback(() => {
    void signOut();
  }, [signOut]);

  const triggerClassName =
    tone === "light"
      ? "h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/20"
      : "h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            triggerClassName,
            "transition-all duration-200 hover:scale-105 flex-shrink-0",
            className
          )}
          title="Menu"
          aria-label="Menu"
          onClick={e => e.stopPropagation()}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="min-w-[220px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {user ? (user.displayName || user.email || "Account") : "Guest mode"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem disabled={isAuthenticating} onSelect={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleLogin}>
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[200px]">
            <DropdownMenuRadioGroup value={theme} onValueChange={v => setTheme(v as typeof theme)}>
              <DropdownMenuRadioItem value="light">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => openFeedbackModal()}>
          <MessageSquareText className="h-4 w-4" />
          <span>Feedback</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

