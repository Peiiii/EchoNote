import { modal } from "@/common/components/modal/modal.store";
import { Button } from "@/common/components/ui/button";
import { openLoginModal } from "@/common/features/auth/open-login-modal";
import { i18n } from "@/common/i18n";

function GuestDataNoticeContent() {
  const t = i18n.t.bind(i18n);
  return (
    <div className="space-y-4">
      <div className="text-sm text-foreground">
        {t('auth.guestDataNotice.description')}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          onClick={() => {
            modal.close();
            openLoginModal({
              title: t('auth.guestDataNotice.loginTitle'),
              description: t('auth.guestDataNotice.loginDescription'),
            });
          }}
        >
          {t('auth.guestDataNotice.goToLogin')}
        </Button>
        <Button
          variant="ghost"
          className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
          onClick={() => modal.close()}
        >
          {t('auth.guestDataNotice.gotIt')}
        </Button>
      </div>
    </div>
  );
}

export function openGuestDataNoticeModal() {
  const t = i18n.t.bind(i18n);
  modal.show({
    title: t('auth.guestDataNotice.title'),
    description: t('auth.guestDataNotice.subtitle'),
    showFooter: false,
    className: "w-full max-w-[520px]",
    content: <GuestDataNoticeContent />,
  });
}
