import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
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
import { HeaderMenuItem } from "./header-menu-item";
import { HeaderMenuRadioItem } from "./header-menu-radio-item";
import { HeaderMenuSubTrigger } from "./header-menu-sub-trigger";

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
            "group transition-all duration-200 flex-shrink-0",
            className
          )}
          title={t("header.menu.title")}
          aria-label={t("header.menu.title")}
          onClick={e => e.stopPropagation()}
        >
          <Menu className="h-4 w-4 transition-transform duration-200 group-hover:scale-105" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="min-w-[220px] p-1">
        <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
          {user ? (user.displayName || user.email || t("header.menu.account")) : t("header.menu.guestMode")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {user ? (
          <HeaderMenuItem icon={LogOut} onSelect={handleLogout} disabled={isAuthenticating}>
            {t("header.menu.logout")}
          </HeaderMenuItem>
        ) : (
          <HeaderMenuItem icon={LogIn} onSelect={handleLogin}>
            {t("header.menu.login")}
          </HeaderMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <HeaderMenuSubTrigger icon={theme === "dark" ? Moon : Sun}>
            {t("header.menu.theme.label")}
          </HeaderMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[200px]">
            <DropdownMenuRadioGroup value={theme} onValueChange={v => setTheme(v as typeof theme)}>
              <HeaderMenuRadioItem icon={Sun} value="light">
                {t("header.menu.theme.light")}
              </HeaderMenuRadioItem>
              <HeaderMenuRadioItem icon={Moon} value="dark">
                {t("header.menu.theme.dark")}
              </HeaderMenuRadioItem>
              <HeaderMenuRadioItem icon={Monitor} value="system">
                {t("header.menu.theme.system")}
              </HeaderMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <HeaderMenuSubTrigger icon={Languages}>
            {t("header.menu.language.label")}
          </HeaderMenuSubTrigger>
          <DropdownMenuSubContent className="min-w-[200px]">
            <DropdownMenuRadioGroup value={language} onValueChange={v => setLanguage(v as typeof language)}>
              <HeaderMenuRadioItem value="en">
                {t("header.menu.language.english")}
              </HeaderMenuRadioItem>
              <HeaderMenuRadioItem value="zh-CN">
                {t("header.menu.language.chinese")}
              </HeaderMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <HeaderMenuItem icon={MessageSquareText} onSelect={() => openFeedbackModal()}>
          {t("header.menu.feedback")}
        </HeaderMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
