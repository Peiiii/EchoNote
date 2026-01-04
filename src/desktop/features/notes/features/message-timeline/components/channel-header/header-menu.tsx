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
import { useLanguage } from "@/common/hooks/use-language";
import { cn } from "@/common/lib/utils";
import { useAuthStore } from "@/core/stores/auth.store";
import { LogIn, LogOut, Languages, Menu, MessageSquareText, Monitor, Moon, Sun } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

type HeaderMenuTone = "light" | "dark";

interface HeaderMenuProps {
  tone?: HeaderMenuTone;
  className?: string;
}

export function HeaderMenu({ tone = "dark", className }: HeaderMenuProps) {
  const { user } = useFirebaseAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
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

      <DropdownMenuContent align="start" sideOffset={8} className="min-w-[220px] p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
          {user ? (user.displayName || user.email || t("header.menu.account")) : t("header.menu.guestMode")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user ? (
          <DropdownMenuItem
            className="cursor-pointer rounded-md"
            disabled={isAuthenticating}
            onSelect={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span>{t("header.menu.logout")}</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer rounded-md" onSelect={handleLogin}>
            <LogIn className="h-4 w-4" />
            <span>{t("header.menu.login")}</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer rounded-md">
            {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span>{t("header.menu.theme.label")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[200px]">
            <DropdownMenuRadioGroup value={theme} onValueChange={v => setTheme(v as typeof theme)}>
              <DropdownMenuRadioItem value="light">
                <Sun className="h-4 w-4" />
                <span>{t("header.menu.theme.light")}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="h-4 w-4" />
                <span>{t("header.menu.theme.dark")}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="h-4 w-4" />
                <span>{t("header.menu.theme.system")}</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer rounded-md">
            <Languages className="h-4 w-4" />
            <span>{t("header.menu.language.label")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[200px]">
            <DropdownMenuRadioGroup value={language} onValueChange={v => setLanguage(v as typeof language)}>
              <DropdownMenuRadioItem value="en">
                <span>{t("header.menu.language.english")}</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="zh-CN">
                <span>{t("header.menu.language.chinese")}</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer rounded-md" onSelect={() => openFeedbackModal()}>
          <MessageSquareText className="h-4 w-4" />
          <span>{t("header.menu.feedback")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
