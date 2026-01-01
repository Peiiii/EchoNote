import { modal } from "@/common/components/modal/modal.store";
import { Button } from "@/common/components/ui/button";
import { openLoginModal } from "@/common/features/auth/open-login-modal";

export function openGuestDataNoticeModal() {
  modal.show({
    title: "访客模式提示",
    description: "你当前在使用本地数据集",
    showFooter: false,
    className: "w-full max-w-[520px]",
    content: (
      <div className="space-y-4">
        <div className="text-sm text-foreground">
          你的数据仅保存在本机（不会云同步，换设备不可见）。登录后可启用云同步与发布能力。
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            onClick={() => {
              modal.close();
              openLoginModal({
                title: "登录以启用云端能力",
                description: "登录后可云同步、发布空间，并在多设备访问你的数据。",
              });
            }}
          >
            去登录
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
            onClick={() => modal.close()}
          >
            我知道了
          </Button>
        </div>
      </div>
    ),
  });
}
