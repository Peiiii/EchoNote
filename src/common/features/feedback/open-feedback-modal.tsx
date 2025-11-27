import { modal } from "@/common/lib/imperative-modal";

const FEEDBACK_SPACE_URL =
  import.meta.env.VITE_FEEDBACK_SPACE_URL ??
  "https://stillroot.app/#/space/18ec8262-2f5b-4c07-8dd1-fb3cdda8f1e7";

export function openFeedbackModal() {
  let modalController: ReturnType<typeof modal.show> | null = null;

  modalController = modal.show({
    content: (
      <div className="flex flex-col w-screen max-w-[1024px] h-[80vh]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">产品反馈</span>
            <span className="text-xs text-muted-foreground">
              在下面的空间里直接写下你的想法，我们会定期查看
            </span>
          </div>
          <button
            type="button"
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded"
            onClick={() => modalController?.close()}
          >
            关闭
          </button>
        </div>
        <div className="flex-1 bg-muted">
          <iframe
            src={FEEDBACK_SPACE_URL}
            title="Feedback Space"
            className="w-full h-full border-0"
          />
        </div>
      </div>
    ),
    className: "w-full max-w-[1024px] h-[80vh] flex flex-col",
    position: "center",
  });

  return modalController;
}

