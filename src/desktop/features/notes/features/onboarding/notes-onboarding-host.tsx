import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { useNotesViewStore } from "@/core/stores/notes-view.store";
import { useAuthStore } from "@/core/stores/auth.store";
import { useModalStore } from "@/common/components/modal/modal.store";
import { SpotlightTour } from "@/common/components/ui/spotlight-tour";

type TourStep = "create_space" | "composer";

const STORAGE_KEY = "stillroot:onboarding:notes-tour:v1";

function readPersisted(): { done: boolean; step?: TourStep } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: false };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return { done: false };
    const record = parsed as Record<string, unknown>;
    return {
      done: record.done === true,
      step:
        record.step === "create_space" || record.step === "composer"
          ? (record.step as TourStep)
          : undefined,
    };
  } catch {
    return { done: false };
  }
}

function persist(value: { done: boolean; step?: TourStep }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function NotesOnboardingHost() {
  const { t } = useTranslation();

  const currentUser = useAuthStore(s => s.currentUser);
  const notesUserId = useNotesDataStore(s => s.userId);
  const channels = useNotesDataStore(s => s.channels);
  const channelsLoading = useNotesDataStore(s => s.channelsLoading);
  const currentChannelId = useNotesViewStore(s => s.currentChannelId);
  const isModalOpen = useModalStore(s => s.isOpen);

  const [step, setStep] = useState<TourStep | null>(null);

  const shouldStart = useMemo(() => {
    if (currentUser) return false;
    if (!notesUserId) return false; // wait until guest workspace initialized
    if (isModalOpen) return false;
    if (channelsLoading) return false;
    if (currentChannelId) return false;
    if (channels.length > 0) return false;
    const persisted = readPersisted();
    if (persisted.done) return false;
    return true;
  }, [channels.length, channelsLoading, currentChannelId, currentUser, isModalOpen, notesUserId]);

  useEffect(() => {
    if (!shouldStart) return;
    const persisted = readPersisted();
    const initialStep = persisted.step ?? "create_space";
    setStep(initialStep);
    persist({ done: false, step: initialStep });
  }, [shouldStart]);

  useEffect(() => {
    if (!step) return;
    if (step !== "create_space") return;
    if (!currentChannelId && channels.length === 0) return;
    setStep("composer");
    persist({ done: false, step: "composer" });
  }, [channels.length, currentChannelId, step]);

  useEffect(() => {
    if (step !== "composer") return;
    const root = document.querySelector('[data-tour="timeline-composer"]') as HTMLElement | null;
    if (!root) return;

    const editor =
      (root.querySelector('[contenteditable="true"]') as HTMLElement | null) ||
      (root.querySelector("textarea") as HTMLElement | null);
    editor?.focus?.();

    const markDone = () => {
      setStep(null);
      persist({ done: true });
    };

    const onInput = () => markDone();
    editor?.addEventListener("input", onInput, { once: true });
    editor?.addEventListener("keydown", onInput, { once: true });

    return () => {
      editor?.removeEventListener("input", onInput as never);
      editor?.removeEventListener("keydown", onInput as never);
    };
  }, [step]);

  const dismiss = () => {
    setStep(null);
    persist({ done: true });
  };

  if (!step) return null;

  if (step === "create_space") {
    return (
      <SpotlightTour
        open
        target='[data-tour="create-first-space"]'
        title={t("onboarding.notesTour.createSpace.title")}
        description={t("onboarding.notesTour.createSpace.description")}
        actionLabel={t("onboarding.notesTour.createSpace.action")}
        dismissLabel={t("onboarding.notesTour.later")}
        onAction={() => {
          const el = document.querySelector('[data-tour="create-first-space"]') as HTMLElement | null;
          el?.scrollIntoView?.({ block: "center" });
          el?.click?.();
        }}
        onDismiss={dismiss}
      />
    );
  }

  return (
    <SpotlightTour
      open
      target='[data-tour="timeline-composer"]'
      title={t("onboarding.notesTour.write.title")}
      description={t("onboarding.notesTour.write.description")}
      actionLabel={t("onboarding.notesTour.write.action")}
      dismissLabel={t("onboarding.notesTour.later")}
      onAction={() => {
        const root = document.querySelector('[data-tour="timeline-composer"]') as HTMLElement | null;
        root?.scrollIntoView?.({ block: "end" });
        // Trigger expansion logic without importing business state:
        // the composer already expands on mousedown.
        root?.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        const editor =
          (root?.querySelector('[contenteditable="true"]') as HTMLElement | null) ||
          (root?.querySelector("textarea") as HTMLElement | null);
        editor?.focus?.();
        // This is the last step; once the user explicitly chooses to start writing, close the tour.
        window.setTimeout(() => dismiss(), 0);
      }}
      onTargetClick={() => {
        // If user clicks directly into the composer area, treat it as intent to start writing.
        dismiss();
      }}
      onDismiss={dismiss}
    />
  );
}
