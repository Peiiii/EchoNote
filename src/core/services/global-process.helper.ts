import { useGlobalProcessStore } from "@/core/stores/global-process.store";

type StepInit = { id: string; title: string };

export async function withGlobalProcess<T>(
  options: {
    id: string;
    title: string;
    message?: string;
    steps?: StepInit[];
    displayMode?: "dialog" | "fullscreen";
    dismissible?: boolean;
  },
  runner: (ctx: {
    setStepStatus: (id: string, status: "pending" | "running" | "success" | "error") => void;
    setProgress: (p: number) => void;
    setMessage: (m: string) => void;
  }) => Promise<T>
): Promise<T> {
  const store = useGlobalProcessStore.getState();

  store.show({
    id: options.id,
    title: options.title,
    message: options.message,
    steps: options.steps?.map(s => ({ ...s, status: "pending" })),
    displayMode: options.displayMode,
    dismissible: options.dismissible ?? false,
  });

  try {
    const result = await runner({
      setStepStatus: store.setStepStatus,
      setProgress: store.setProgress,
      setMessage: store.setMessage,
    });
    store.succeed();
    setTimeout(() => useGlobalProcessStore.getState().hide(), 400);
    return result;
  } catch (e) {
    store.fail(e instanceof Error ? e.message : "Operation failed");
    // keep the error visible briefly
    setTimeout(() => useGlobalProcessStore.getState().hide(), 1200);
    throw e;
  }
}

